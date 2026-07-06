import { PurchaseModel } from "../domain/entities/PurchaseModel.js";
import { PurchaseRepositoryImpl } from "../infrastructure/repositories/Purchase/CommomPurchaseRepositoryImpl.js";
import { getAndroidPublisher } from "../service/googleapis/googleClient.js";
import { IIosWebhookPayload } from "../domain/entities/interface/appleTypes.js";
import { PurchaseAosRepositoryImpl } from "../infrastructure/repositories/Purchase/PurchaseAosRepositoryImpl.js";
import { PurchaseIosRepositoryImpl } from "../infrastructure/repositories/Purchase/PurchaseIosRepositoryImpl.js";
import { AppStoreServerAPIClient, JWSRenewalInfoDecodedPayload, JWSTransactionDecodedPayload, SignedDataVerifier } from "@apple/app-store-server-library";
import { androidpublisher_v3 } from "googleapis";
import { decodeJwt } from "jose";
import { TypeOrmUnitOfWork } from "../infrastructure/repositories/Message/UnitOfWorkImpl.js";


export class PurchaseUseCase {
    constructor(
        private purchaseRepository: PurchaseRepositoryImpl,
        private aosRepository: PurchaseAosRepositoryImpl,
        private iosRepository: PurchaseIosRepositoryImpl,
        private appStoreClient: AppStoreServerAPIClient,
        private verifer: SignedDataVerifier,
        private unitOfWork: TypeOrmUnitOfWork
    ) { }
    private getPlan(plan: string): string {
        switch (plan) {
            case 'std':
                return 'standard';

            case 'pre':
                return 'premium';

            default:
                return 'standard';
        }
    }

    private setNewAOSPurchaseModel(verifer: androidpublisher_v3.Schema$SubscriptionPurchaseV2, userId?: string, type?: string): PurchaseModel {
        const lineItem = verifer.lineItems?.[0];
        const productId = lineItem?.offerDetails?.basePlanId || '';
        const itemInfo = productId.split('-');
        const plan = this.getPlan(itemInfo[0]);
        const isRenew = itemInfo[1] !== 'm1';
        const expiredDate = new Date(lineItem?.expiryTime || '');
        const googleState = verifer.subscriptionState;

        const itemReplacement = lineItem?.itemReplacement;

        let state: string = 'purchased'; // 기본값
        let isActive: boolean = false;

        // 1. 구글 상태값을 기반으로 기본 분기 처리 (기본 상태 유추)
        switch (googleState) {
            case 'SUBSCRIPTION_STATE_ACTIVE':
                isActive = true;
                if (itemReplacement || verifer.linkedPurchaseToken) {
                    state = 'renew';
                } else {
                    state = 'purchased';
                }
                break;

            case 'SUBSCRIPTION_STATE_DEFERRED':
                isActive = false;
                state = 'deferred';
                break;

            case 'SUBSCRIPTION_STATE_CANCELED':
                const isExpiredYet = expiredDate.getTime() < Date.now();
                isActive = !isExpiredYet;
                state = isExpiredYet ? 'expired' : 'canceled';
                break;

            case 'SUBSCRIPTION_STATE_ON_HOLD':
            case 'SUBSCRIPTION_STATE_PAUSED':
                isActive = false;
                state = 'canceled';
                break;

            case 'SUBSCRIPTION_STATE_PENDING':
                isActive = false;
                state = 'deferred';
                break;

            default:
                isActive = false;
                state = 'expired';
                break;
        }

        // 2. 외부에서 명확한 웹훅 type(힌트)을 명시했다면 우선 적용
        if (type) {
            state = type;

            // 💡 중요: 강제 지정된 type에 맞게 isActive 권한도 동기화해 줍니다.
            if (['expired', 'revoke', 'deferred'].includes(type)) {
                isActive = false;
            } else if (type === 'purchased' || type === 'renew') {
                isActive = true;
            }
        }

        // 3. 시간 기반 최후의 만료 체크 (type이 없을 때나 만료 기간이 진짜 끝났을 때의 안전장치)
        if (expiredDate.getTime() < Date.now()) {
            isActive = false;
            if (!type && googleState !== 'SUBSCRIPTION_STATE_CANCELED') {
                state = 'expired';
            }
        }

        const productModel = new PurchaseModel({
            plan: plan,
            productId: productId,
            store: 'play-store',
            isActive: isActive,
            willRenew: isRenew,
            state: state,
            expiresAt: expiredDate,
            userId: userId ? userId : verifer.externalAccountIdentifiers?.obfuscatedExternalAccountId
        });

        return productModel;
    }
    private setNewIOSPurchaseModel(transaction: JWSTransactionDecodedPayload, userId?: string, type?: string): PurchaseModel {
        const productId: string = transaction.productId;
        const expiredAt: Date = new Date(transaction.expiresDate);
        const isRenew = productId.split('_')[1] !== 'm1';
        const itemInfo = productId.split('_');
        const plan = this.getPlan(itemInfo[0]);

        const originalId = transaction.originalTransactionId;
        const decodedTransactionsId = transaction.transactionId;

        let isActive = false;
        let state = 'purchased';

        const isRevoked = !!transaction.revocationDate;
        const isExpiredYet = expiredAt.getTime() < Date.now();

        if (isRevoked) {
            isActive = false;
            state = 'revoke';
        }
        // 조건 2. 기간 만료 체크
        else if (isExpiredYet) {
            isActive = false;
            state = 'expired';
        }
        // 조건 3. 정상 이용 중인 경우
        else {
            isActive = true;
            // 최초 거래 ID와 현재 거래 ID가 다르다면 정기 갱신(renew)으로 판단
            state = originalId !== decodedTransactionsId ? 'renew' : 'purchased';
        }

        // 조건 4. 웹훅에서 명확한 type(힌트)을 인자로 던져준 경우 강제 매핑 및 권한 동기화
        if (type) {
            state = type;
            if (['expired', 'revoke', 'deferred'].includes(type)) {
                isActive = false;
            } else if (type === 'purchased' || type === 'renew' || type === 'canceled') {
                // 💡 주의: 애플에서 'canceled'는 구독 해지 버튼을 누른 상태일 뿐, 
                // 남은 기간 동안은 이용해야 하므로 isActive는 true여야 합니다.
                isActive = !isExpiredYet;
            }
        }

        const productModel = new PurchaseModel({
            plan: plan,
            productId: productId,
            store: 'app-store',
            isActive: isActive,
            willRenew: isRenew,
            state: state,
            expiresAt: expiredAt,
            userId: userId
        });

        return productModel;
    }

    /// Token값으로 purchase정보 가져오기
    async getSubscribeByToken(token: string): Promise<PurchaseModel | null> {
        const subscribe = await this.aosRepository.getSubscribeByToken(token);
        return subscribe;
    }
    /// 유져의 모든 구독정보 가져오기
    async getSubscriptions(userId: string): Promise<PurchaseModel[]> {
        const subscribes = await this.purchaseRepository.getSubscriptions(userId);
        return subscribes;
    }
    /// Play store 구매 검증
    /// 영수 검증 후 purchaseModel 리턴
    async verifyPurchaseAOS(purchaseToken: string): Promise<androidpublisher_v3.Schema$SubscriptionPurchaseV2> {
        const purblisher = await getAndroidPublisher();
        console.log(`[Purchase AOS] Use case start verify`);
        try {
            const product = await purblisher.purchases.subscriptionsv2.get({
                packageName: 'com.testus.devon.studio.app',
                token: purchaseToken
            });
            if (!product.data.lineItems) {
                throw new Error("Product not found");
            }
            console.log('[Purchase] AOS verify success');
            return product.data;
        } catch (error) {
            throw new Error('[Purchase AOS] verify failed');
        }

    }
    /// App store 구매 검증
    /// 영수 검증 후 purchaseModel 리턴
    async verifyPurchaseIOS(transactionId: string): Promise<JWSTransactionDecodedPayload> {
        console.log(`[Purchase IOS] Use case start verify`);
        const verified = await this.appStoreClient.getTransactionInfo(transactionId);
        if (!verified) {
            throw new Error('[Purchase IOS] verify failed');
        }
        console.log('[Purchase] IOS verify success');
        console.log(`[Purchase IOS] Use case => verifer decode start]`)
        const transaction = await this.verifer.verifyAndDecodeTransaction(verified.signedTransactionInfo);

        console.log(`[Purchase IOS] Use case => transactionId: ${transaction.transactionId}]`);
        // console.log(`[Purchase IOS] Use case => renew: ${renewData.autoRenewStatus}]`);
        return transaction;
    }

    // front 정보 transactions
    async subscriptionPurchaseHandelerAOS(userId: string, token: string): Promise<PurchaseModel | null> {
        const verifer = await this.verifyPurchaseAOS(token);

        const product = this.setNewAOSPurchaseModel(verifer, userId);

        return this.unitOfWork.runInTransaction(async (manager) => {
            try {
                if (verifer.linkedPurchaseToken) {
                    const prev = await this.getSubscribeByToken(verifer.linkedPurchaseToken);
                    if (prev) {
                        prev.isActive = false;
                        prev.willRenew = false;
                        prev.state = 'expired';
                        await this.aosRepository.updateSubcribe(prev, verifer.linkedPurchaseToken, null, manager);
                    }
                }
            } catch (error) {
                console.log(`[Purchase AOS] ${error}`);
                throw new Error(`[Purchase AOS] error: ${error}`);
            }
            try {
                const savePurchase = await this.aosRepository.saveSubscribe(product, token, verifer.linkedPurchaseToken, manager);
                return savePurchase;

            } catch (error) {
                if (error.code === 'ER_DUP_ENTRY' || error.code === '23505') {
                    console.log(`[Purchase AOS] 동시 진입 중복 발생. 트랜잭션을 중단하고 기존 데이터를 조회합니다.`);
                    throw error;
                }
                throw error;
            }
        }).catch(async (error) => {
            if (error.code === 'ER_DUP_ENTRY' || error.code === '23505') {
                const prev = await this.getSubscribeByToken(token);
                if (prev) return prev;
            }
            throw new Error(`[Purchase AOS] 처리 실패: ${error.message}`);
        });

    }

    async subscriptionHandelerIOS(useId: string, transactionId: string): Promise<PurchaseModel | null> {
        const verified = await this.verifyPurchaseIOS(transactionId);

        return this.unitOfWork.runInTransaction(async (manager) => {
            try {
                if (verified.isUpgraded) {
                    const prevProdect = await this.iosRepository.getCurrentActiveSubscriptionByOriginalId(verified.originalTransactionId);
                    if (prevProdect) {
                        prevProdect.isActive = false;
                        prevProdect.willRenew = false;
                        prevProdect.state = 'canceled';
                        await this.iosRepository.updateSubcribe(prevProdect, verified.transactionId, verified.originalTransactionId);
                        console.log(`[Purchase IOS] 기존 active 업데이트 false.`)
                    }
                }
            } catch (error) {
                console.log(`[Purchase IOS] ${error}`);
                throw new Error(`[Purchase IOS] error: ${error}`);
            }

            const productModel = this.setNewIOSPurchaseModel(verified, useId);

            const savePurchase = await this.iosRepository.saveSubscribe(productModel, verified.transactionId, verified.originalTransactionId);
            return savePurchase;
        }).catch(async (error) => {
            if (error.code === 'ER_DUP_ENTRY' || error.code === '23505') {
                const prev = await this.iosRepository.getSubscriptionByTransactionId(verified.transactionId);
                if (prev) return prev;
            }
            throw new Error(`[Purchase AOS] 처리 실패: ${error.message}`);
        });


    }

    // store 별 webHook 실행
    // webHook에서 받은 데이터는 영수검증이 필요 없음
    // 바로 서버 조회 후 신규 or 업데이트 
    async webhookAOS(purchaseToken: string, subscriptionId: string, notificationType: number): Promise<boolean> {
        //DB조회
        const verifer = await this.verifyPurchaseAOS(purchaseToken);
        let type: string;
        switch (notificationType) {
            case 2:
                type = 'renew';
                break;
            case 3:
                type = 'canceled';
                break;
            case 4:
                type = 'purchased';
                break;
            case 12:
                type = 'revoke';
                break;
            case 13:
                type = 'expired';
                break;
        }

        // SUBSCRIPTION_STATE_ACTIVE: 즉시 변경
        // SUBSCRIPTION_STATE_DEFERRED: 예약 변경
        // 각 State 별 상황도 설정이 필요해 보임.

        if (type === 'purchased') {
            try {
                if (verifer.linkedPurchaseToken) {
                    if (verifer.subscriptionState === 'SUBSCRIPTION_STATE_ACTIVE') {
                        const prev = await this.getSubscribeByToken(verifer.linkedPurchaseToken);
                        if (prev) {
                            prev.isActive = false;
                            prev.willRenew = false;
                            prev.state = 'canceled';
                            await this.aosRepository.updateSubcribe(prev, verifer.linkedPurchaseToken, purchaseToken);
                        }
                        const newModel = this.setNewAOSPurchaseModel(verifer);
                        await this.aosRepository.saveSubscribe(newModel, purchaseToken, verifer.linkedPurchaseToken);
                    } else if (verifer.subscriptionState === 'SUBSCRIPTION_STATE_DEFERRED') {
                        const newOne = this.setNewAOSPurchaseModel(verifer, null, type);
                        await this.aosRepository.saveSubscribe(newOne, purchaseToken, verifer.linkedPurchaseToken);
                    }
                    return true;
                } else {
                    const newModel = this.setNewAOSPurchaseModel(verifer, null, type);
                    await this.aosRepository.saveSubscribe(newModel, purchaseToken);
                    return true;
                }
            } catch (error) {
                if (error.code === 'ER_DUP_ENTRY' || error.code === '23505') {
                    console.log(`[Purchase AOS] 이미 처리된 token 입니다.`);
                    return true;
                } else {
                    throw new Error(`[Purchase AOS] type: ${type} / state: ${verifer.subscriptionState} / error: ${error}`)
                }
            }
        } else {
            let updateItem = await this.getSubscribeByToken(purchaseToken);
            if (!updateItem) {
                // 여기는 무조건 업데이트기 때문에 기존 데이터가 존재해야함.
                // 기존 데이터가 없다면, 오류 보다는 webHook에서 오는 데이터를 신뢰해서 신규 데이터를 저장해야한다.
                const isRenew = type === 'renew';
                updateItem = this.setNewAOSPurchaseModel(verifer, verifer.externalAccountIdentifiers.obfuscatedExternalAccountId, type);
            }

            // renew 일때는 기존 상품 expired로 수정 업데이트 후 새로운 데이터로 저장해야한다.!!! (수정 필!!!!!!)
            try {
                if (type === 'renew') {
                    // updateItem.isActive = true;
                    // updateItem.willRenew = true;
                    // updateItem.state = type;
                    // updateItem.expiresAt = new Date(verifer.lineItems[0].expiryTime);
                    // await this.aosRepository.updateSubcribe(updateItem, purchaseToken, verifer.linkedPurchaseToken);
                } else if (type === 'canceled') {
                    updateItem.willRenew = false;
                    updateItem.state = type;
                    await this.aosRepository.updateSubcribe(updateItem, purchaseToken, verifer.linkedPurchaseToken);
                } else if (type === 'expired' || type === 'revoke') {
                    updateItem.isActive = false;
                    updateItem.willRenew = false;
                    updateItem.state = type;
                    await this.aosRepository.updateSubcribe(updateItem, purchaseToken, verifer.linkedPurchaseToken);
                }
                console.log('[Purchase Webhook] AOS update success: ' + type);
                return true;
            } catch (error) {
                console.log(error);
                return false;
            }
        }
    }
    async webhookIOS(payload: IIosWebhookPayload): Promise<boolean> {
        console.log(`[IOS Webhook] notification type: ${payload.notificationType}`);
        console.log(`[IOS Webhook] subtype: ${payload.subType}`);
        const transactions: JWSTransactionDecodedPayload = decodeJwt(payload.data.signedTransactionInfo);
        const originalTransactionId = transactions.originalTransactionId ?? '';
        const transactionId = transactions.transactionId ?? '';

        let state: string = 'purchased';
        switch (payload.notificationType) {
            case 'SUBSCRIBED':
                state = 'purchased';
                break;
            case 'DID_RENEW':
                state = 'renew';
                break;
            case 'DID_CHANGE_RENEWAL_PREF':
                state = 'renew';
                break;
            case 'EXPIRED':
                state = 'expired';
                break;
            case 'REVOKE':
                state = 'revoke';
                break;
            case 'DID_CHANGE_RENEWAL_STATUS':
                if (payload.subType === 'AUTO_RENEW_DISABLED') {
                    state = 'canceled';
                } else if (payload.subType === 'AUTO_RENEW_ENABLED') {
                    state = 'renew';
                }
                break;
            default:
                state = 'purchased';
                break;
        }

        // transactions.appAccountToken-> 프론트에서 구매 시 입력한 userId.
        let userId: string = transactions.appAccountToken;

        try {
            if (payload.notificationType === 'SUBSCRIBED') {
                const current = await this.iosRepository.getSubscriptionByTransactionId(transactionId);
                if (current) {
                    console.log(`[IOS Webhook] 이미 처리된 데이터 입니다.`);
                    return true;
                }

                if (!(payload.subType === 'INITAL')) {
                    let prev = await this.iosRepository.getCurrentActiveSubscriptionByOriginalId(originalTransactionId);
                    if (!prev) {
                        console.log(`[IOS Webhook] 사용 중인 상품을 찾을 수 없습니다.`);
                    } else {
                        prev.isActive = false;
                        prev.willRenew = false;
                        prev.state = 'expired';
                        await this.iosRepository.updateSubcribe(prev, transactionId, originalTransactionId);
                        console.log(`[IOS Webhook] 기존 상품을 업데이트 했습니다.(만료)`);
                    }
                }
            }
            else if (payload.notificationType === 'DID_RENEW') {
                let prev = await this.iosRepository.getSubscriptionByTransactionId(transactionId);
                if (!prev) {
                    console.log(`[IOS Webhook] 사용 중인 상품을 찾을 수 없습니다.`);
                } else {
                    prev.isActive = false;
                    prev.willRenew = false;
                    prev.state = 'expired';
                    await this.iosRepository.updateSubcribe(prev, '', originalTransactionId); // 여기서 업데이트 시 transactionId 값이 필수 인지 확인 필요.
                    console.log(`[IOS Webhook] 기존 상품을 업데이트 했습니다.(만료)`);
                }
            }
            else if (['EXPIRED', 'REVOKE'].includes(payload.notificationType)) {
                let prev = await this.iosRepository.getCurrentActiveSubscriptionByOriginalId(originalTransactionId);
                if (!prev) {
                    console.log(`[IOS Webhook] 기존에 사용중인 상품이 없습니다.`);
                } else {
                    prev.isActive = false;
                    prev.willRenew = false;
                    prev.state = state;
                    await this.iosRepository.updateSubcribe(prev, transactionId, originalTransactionId);
                }
            }
            // 프론트에서 업/다운 시 즉시 또는 대기에 관한 요청 확인 후 진행 해야 함.
            else if (payload.notificationType === 'DID_CHANGE_RENEWAL_PREF') {
                if (payload.subType === 'UPGRADE') {
                    // 업그레이드는 즉시 새 결제가 시작되므로 즉시 이력 적재

                } else if (payload.subType === 'DOWNGRADE') {
                    // 다운그레이드는 다음 결제일 예약이므로 당장 새 transactionId 행을 쌓지 않고,
                    // 필요하다면 기존 활성화된 행에 '다운그레이드 예약됨' 상태만 가볍게 업데이트합니다.
                    console.log(`[IOS Webhook] 다운그레이드 요청`);
                    return true;
                }
            }

            // 패턴 C: 유저가 단순 [구독 해지] 버튼 클릭 또는 [해지 취소]를 누른 그룹 (기존 행 업데이트)
            else if (payload.notificationType === 'DID_CHANGE_RENEWAL_STATUS') {
                if (payload.subType === 'AUTO_RENEW_DISABLED') {
                    // 환불이 아니므로 서비스는 유지하되 상태만 canceled, 자동갱신 off 처리
                    let prev = await this.iosRepository.getSubscriptionByTransactionId(transactionId);
                    if (!prev) {
                        prev.willRenew = false;
                        await this.iosRepository.updateSubcribe(prev, transactionId, originalTransactionId);
                        console.log(`[IOS Webhook] 상태 업데이트 완료 - SubType: ${payload.subType}`);
                        return true;
                    }
                } else if (payload.subType === 'AUTO_RENEW_ENABLED') {
                    // 해지 예약 취소 -> 다시 자동 갱신 원복
                    let prev = await this.iosRepository.getSubscriptionByTransactionId(transactionId);
                    if (!prev) {
                        prev.willRenew = true;
                        await this.iosRepository.updateSubcribe(prev, transactionId, originalTransactionId);
                        console.log(`[IOS Webhook] 상태 업데이트 완료 - SubType: ${payload.subType}`);
                        return true;
                    }
                }
            }

            const newModel = this.setNewIOSPurchaseModel(transactions, userId, state);
            await this.iosRepository.saveSubscribe(newModel, transactionId, originalTransactionId);

            console.log(`[IOS Webhook] 신규 구매 데이터 저장 완료`);
            return true;

        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY' || error.code === '23505') {
                console.log(`[Purchase IOS] 이미 처리된 transactionId 입니다.`);
                return true;
            } else {
                throw new Error(`[Purchase IOS] type: ${state} / state: ${payload.notificationType} / error: ${error}`)
            }
        }

    }
}