import { PurchaseModel } from "../domain/entities/PurchaseModel.js";
import { PurchaseRepositoryImpl } from "../infrastructure/repositories/Purchase/CommomPurchaseRepositoryImpl.js";
import { getAndroidPublisher } from "../service/googleapis/googleClient.js";
import { IIosWebhookPayload } from "../domain/entities/interface/appleTypes.js";
import { PurchaseAosRepositoryImpl } from "../infrastructure/repositories/Purchase/PurchaseAosRepositoryImpl.js";
import { PurchaseIosRepositoryImpl } from "../infrastructure/repositories/Purchase/PurchaseIosRepositoryImpl.js";
import { AppStoreServerAPIClient, JWSRenewalInfoDecodedPayload, JWSTransactionDecodedPayload, SignedDataVerifier } from "@apple/app-store-server-library";
import { androidpublisher_v3 } from "googleapis";
import { decodeJwt } from "jose";


export class PurchaseUseCase {
    constructor(
        private purchaseRepository: PurchaseRepositoryImpl,
        private aosRepository: PurchaseAosRepositoryImpl,
        private iosRepository: PurchaseIosRepositoryImpl,
        private appStoreClient: AppStoreServerAPIClient,
        private verifer: SignedDataVerifier
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

    // async saveAosSubscribe(subscribe: PurchaseModel, token: string, linkedToken?: string): Promise<PurchaseModel> {
    //     const newSubscribe = await this.aosRepository.saveSubscribe(subscribe);
    //     return newSubscribe;
    // }
    // async updateAosSubcribe(subscribe: PurchaseModel): Promise<PurchaseModel> {
    //     const newSubscribe = await this.aosRepository.updateSubcribe(subscribe);
    //     return newSubscribe;
    // }

    // async saveIosSubscribe(subscribe: PurchaseModel): Promise<PurchaseModel> {
    //     const newSubscribe = await this.iosRepository.saveSubscribe(subscribe);
    //     return newSubscribe;
    // }
    // async updateIosSubcribe(subscribe: PurchaseModel): Promise<PurchaseModel> {
    //     const newSubscribe = await this.iosRepository.updateSubcribe(subscribe);
    //     return newSubscribe;
    // }

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
        const product = await purblisher.purchases.subscriptionsv2.get({
            packageName: 'com.testus.devon.studio.app',
            token: purchaseToken
        });
        if (!product.data.lineItems) {
            throw new Error("Product not found");
        }
        console.log('[Purchase] AOS verify success');

        return product.data;
    }
    /// App store 구매 검증
    /// 영수 검증 후 purchaseModel 리턴
    async verifyPurchaseIOS(transactionId: string): Promise<[JWSTransactionDecodedPayload, JWSRenewalInfoDecodedPayload]> {
        console.log(`[Purchase IOS] Use case start verify`);
        const verified = await this.appStoreClient.getTransactionInfo(transactionId);
        if (!verified) {
            throw new Error('[Purchase IOS] verify failed');
        }
        console.log('[Purchase] IOS verify success');
        console.log(`[Purchase IOS] Use case => verifer decode start]`)
        const transaction = await this.verifer.verifyAndDecodeTransaction(verified.signedTransactionInfo);
        const renewData= await this.verifer.verifyAndDecodeRenewalInfo(verified.signedTransactionInfo);
        console.log(`[Purchase IOS] Use case => transactionId: ${transaction.transactionId}]`);
        console.log(`[Purchase IOS] Use case => renew: ${renewData.autoRenewStatus}]`);
        return [transaction, renewData];
    }

    // front 정보 transactions
    async subscriptionPurchaseHandelerAOS(userId: string, token: string): Promise<PurchaseModel | null> {
        const verified = await this.verifyPurchaseAOS(token);
        if (!verified) {
            throw new Error('[Purchase] Subscribe verify failed.');
        }

        const linkedToken = verified.linkedPurchaseToken;

        const productId = verified.lineItems[0].offerDetails.basePlanId;
        const itemInfo = productId.split('-');
        const plan = this.getPlan(itemInfo[0]);
        const isRenew = verified.subscriptionState === 'SUBSCRIPTION_STATE_ACTIVE';
        const expiredDate = new Date(verified.lineItems[0].expiryTime);
        console.log(`[Purchase AOS] Use case => productId: ${productId}`);
        console.log(`[Purchase AOS] Use case => plan: ${plan}`);
        console.log(`[Purchase AOS] Use case => expiredDate: ${expiredDate}`);

        if(expiredDate.getTime() < new Date().getTime()){
            console.log(`[Purchase AOS] Use case => item is expired. return null`);
            return null;
        }

        const productModel = new PurchaseModel({
            plan: plan,
            productId: productId,
            store: 'play-store',
            isActive: true,
            willRenew: isRenew,
            state: 'purchased',
            expiresAt: expiredDate,
            userId: userId
        });
        // 기존 활성화 데이터 비활성화
        // Rootid, PurchaseToken, LinkedToken의 관계설정을 명확히 해야한다.
        // 이슈 : 업데이트 시 기존 액티브가 false가 되지 않는다!
        if (linkedToken) {
            console.log(`[Purchase AOS] Use case => linked token exists.`);
            const prevProduct = await this.getSubscribeByToken(linkedToken);
            if (!prevProduct) {
                console.log(`[Purchase AOS] Use case => prev product not found.`);
                const isActived = await this.purchaseRepository.getIsActiveSubscription(userId);
                console.log(`[Purchase AOS] Use case => active product not found`);
                if (!isActived) {
                    console.log('[Purchase] Use case => changes to new purchase.');
                    const newPurchase = await this.aosRepository.saveSubscribe(productModel, token);
                    return newPurchase;
                }
            }
            prevProduct.isActive = false;
            prevProduct.willRenew = false;
            prevProduct.state = 'canceled';

            await this.aosRepository.updateSubcribe(prevProduct, token, linkedToken);
            console.log('[Purchase AOS] Use case => prevProduct disabled success');
        }

        const savePurchase = await this.aosRepository.saveSubscribe(productModel, token, linkedToken);
        return savePurchase;
    }

    async subscriptionHandelerIOS(useId: string, transactionId: string): Promise<PurchaseModel | null> {
        const [verified, renewData] = await this.verifyPurchaseIOS(transactionId);

        const productId: string = verified.productId;
        const expiredAt: Date = new Date(verified.expiresDate);
        const isRenew = renewData.autoRenewStatus === 1;
        const itemInfo = productId.split('_');
        const plan = this.getPlan(itemInfo[0]);
        
        const originalId = verified.originalTransactionId;
        const decodedTransactionsId = verified.transactionId;

        console.log(`[Purchase IOS] Use case => productId: ${productId}`);
        console.log(`[Purchase IOS] Use case => plan: ${plan}`);
        console.log(`[Purchase IOS] Use case => expiredDate: ${expiredAt}`);
        console.log(`[Purchase IOS] Use case => originalId: ${originalId}`);
        console.log(`[Purchase IOS] Use case => decodedTransactionsId: ${decodedTransactionsId}`);

        if(expiredAt.getTime() < new Date().getTime()) {
            console.log(`[Purchase IOS] Use case => item is expired. return null`);
            return null;
        }

        const productModel = new PurchaseModel({
            plan: plan,
            productId: productId,
            store: 'app-store',
            isActive: true,
            willRenew: isRenew,
            state: 'purchased',
            expiresAt: expiredAt,
            userId: useId
        });

        const prevProdect = await this.iosRepository.getSubscriptionByTransactionId(decodedTransactionsId);

        if (prevProdect && prevProdect.isActive) {
            console.log(`[Purchase IOS] Use case => prev product found.`);
            prevProdect.isActive = false;
            prevProdect.willRenew = false;
            prevProdect.state = 'canceled';

            await this.iosRepository.updateSubcribe(prevProdect, decodedTransactionsId, originalId);
            console.log('[Purchase] prevProduct disabled success');
        }
        
        const savePurchase = await this.iosRepository.saveSubscribe(productModel, decodedTransactionsId, originalId);
        return savePurchase;
    }

    // store 별 webHook 실행
    // webHook에서 받은 데이터는 영수검증이 필요 없음
    // 바로 서버 조회 후 신규 or 업데이트 
    async webhookAOS(purchaseToken: string, subscriptionId: string, notificationType: number): Promise<void> {
        //DB조회
        const findProduct = await this.getSubscribeByToken(purchaseToken);

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
        if (findProduct) {
            // 신규 구매 시 이미 데이터 존재 하면 멈춤
            if (notificationType === 4) {
                console.log('[Webhook AOS] purchaseToken already exists. Skipping...');
                return;
            }
            const verified = await this.verifyPurchaseAOS(purchaseToken);
            const linkedToken = verified.linkedPurchaseToken;
            if (!linkedToken) {
                throw new Error('[Purchase Webhook] linkedToken not found');
            }
            findProduct.expiresAt = new Date(verified.lineItems[0].expiryTime);
            findProduct.state = type;
            console.log('[Purchase webhook] current state : ' + type);
            if (type !== 'renew') {
                if (type === 'cancel') {
                    findProduct.willRenew = false;
                } else {
                    findProduct.isActive = false;
                    findProduct.willRenew = false;
                }
            }
            try {
                await this.aosRepository.updateSubcribe(findProduct, purchaseToken, linkedToken);
                //TODO: FCM service 연동 필요. 변경 알림.
            } catch (error) {
                throw new Error('[Purchase Webhook] Error : ' + error.message);
            }
        } else {
            // 기존 데이터가 없다면 업데이트 진행 안함/ 신규 구매는 전적으로 front에서 전담.
            console.log(`[Webhook AOS] No local data for token: ${purchaseToken}`);
            return;
        }
    }
    async webhookIOS(payload: IIosWebhookPayload): Promise<void> {
        console.log(`[IOS Webhook] notification type: ${payload.notificationType}`);
        console.log(`[IOS Webhook] subtype: ${payload.subType}`);
        if(payload.notificationType === 'SUBSCRIBED' || payload.notificationType === 'DID_CHANGE_RENEWAL_PREF'){
            return;
        }

        let transactions = null;
        if (payload.data.signedTransactionInfo) {
            transactions = decodeJwt(payload.data.signedTransactionInfo);
        }
        const updateItem = await this.getSubscribeByToken(transactions.transactionId);

        if(!updateItem){
            console.log(`[IOS Webhook] No local data for token: ${transactions.transactionId}`);
            return;
        }
        const productId: string = transactions.productId;
        const expiredAt: Date = new Date(transactions.expiresDate);
        const itemInfo = productId.split('_');
        let plan: string = '';
        switch (itemInfo[0]) {
            case 'std':
                plan = 'standard';
                break;
            case 'pre':
                plan = 'premium';
                break;
            default:
                plan = 'standard';
                break;
        }
        switch (payload.notificationType) {
            case 'DID_RENEW':
                updateItem.isActive = true;
                updateItem.willRenew = true;
                break;
            case 'EXPIRED':
                updateItem.isActive = false;
                updateItem.willRenew = false;
                break;
            case 'REFUND':
                updateItem.isActive = false;
                updateItem.willRenew = false;
                break;
            case 'DID_CHANGE_RENEWAL_STATUS':
                if (transactions.autoRenewStatus === '0') {
                    updateItem.willRenew = false;
                } else {
                    updateItem.isActive = true;
                    updateItem.willRenew = true;
                }
                break;
            default:
                break;
        }
        updateItem.plan = '';
        updateItem.productId = productId;
        updateItem.expiresAt = expiredAt;
        await this.iosRepository.updateSubcribe(updateItem, transactions.originalTransactionId, transactions.transactionId);
        console.log('[Purchase Webhook] IOS update success');
        return;
    }


}