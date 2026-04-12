import axios from "axios";
import { PurchaseModel } from "../domain/entities/PurchaseModel.js";
import { PurchaseRepositoryImpl } from "../infrastructure/repositories/PurchaseRepositoryImpl.js";
import { getAndroidPublisher } from "../service/googleapis/googleClient.js";
import { IResIosVerifyReceipt } from "../domain/entities/interface/applePackage.js";
import { IIosWebhookPayload } from "../domain/entities/interface/appleTypes.js";
import { decodeJwt } from "jose";


export class PurchaseUseCase {
    constructor(private purchaseRepository: PurchaseRepositoryImpl) { }

    // 직접 실행 되지 않는 저장과 업데이트..
    async saveSubscribe(subscribe: PurchaseModel, tokenOrReceipt: string): Promise<PurchaseModel> {
        const newSubscribe = await this.purchaseRepository.saveSubscribe(subscribe, tokenOrReceipt);
        return newSubscribe;
    }
    async updateSubcribe(subscribe: PurchaseModel, tokenOrReceipt: string): Promise<PurchaseModel> {
        const newSubscribe = await this.purchaseRepository.updateSubcribe(subscribe, tokenOrReceipt);
        return newSubscribe;
    }
    /// Token값으로 purchase정보 가져오기
    async getSubscribeByToken(token: string): Promise<PurchaseModel> {
        const subscribe = await this.purchaseRepository.getSubscribeByToken(token);
        return subscribe;
    }
    /// 유져의 모든 구독정보 가져오기
    async getSubscriptions(userId: string): Promise<PurchaseModel[]> {
        const subscribes = await this.purchaseRepository.getSubscriptions(userId);
        return subscribes;
    }
    /// Play store 구매 검증
    /// 영수 검증 후 purchaseModel 리턴
    async verifyPurchaseAOS(purchaseToken: string): Promise<PurchaseModel> {
        const purblisher = await getAndroidPublisher();

        const product = await purblisher.purchases.subscriptionsv2.get({
            packageName: 'com.testus.devon.studio.app',
            token: purchaseToken
        });
        if (!product.data.lineItems) {
            throw new Error("Product not found");
        }
        console.log('[Purchase] AOS verify success');

        // 데이터 가공
        const productId = product.data.lineItems[0].offerDetails.basePlanId;
        const expiresAt = product.data.lineItems[0].expiryTime;
        const planInfo = productId.split('-');
        let plan: string = '';
        switch (planInfo[0]) {
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
        const newPurchase = new PurchaseModel({
            plan: plan,
            productId: productId,
            store: 'play-store',
            isActive: true,
            willRenew: true,
            state: 'purchased',
            expiresAt: new Date(expiresAt),
            userId: ''
        });
        return newPurchase;
    }
    /// App store 구매 검증
    /// 영수 검증 후 purchaseModel 리턴
    async verifyPurchaseIOS(receipt: string): Promise<[PurchaseModel, string]> {
        const isProd = process.env.NODE_ENV === 'prod';
        const url = isProd ? 'https://buy.itunes.apple.com/verifyReceipt' : 'https://sandbox.itunes.apple.com/verifyReceipt';
        const verifiedItem = await axios.post(url, {
            "receipt-data": receipt,
            "password": process.env.APPLE_PASSWORD,
            "exclude-old-transactions": true,
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const verifiedData: IResIosVerifyReceipt = verifiedItem.data;
        if (verifiedItem.status !== 0) {
            if (verifiedItem.status === 21007) {

            } else {
                throw new Error('[Purchase] IOS verify failed :' + verifiedItem.data.errorMessage);
            }
        }
        const latest = verifiedData.leatest_receipt_info.sort((a, b) => {
            return Number(b.expires_date_ms) - Number(a.expires_date_ms);
        })[0];
        console.log('[Purchase] IOS verify success');

        const itemInfo = latest.product_id.split('_');
        const expiredAt = new Date(latest.expires_date_ms);
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
        const originalId = latest.original_transaction_id;
        const newPurchase = new PurchaseModel({
                plan: 'standard',
                productId: latest.product_id,
                store: 'app-store',
                isActive: true,
                willRenew: true,
                state: 'purchased',
                expiresAt: expiredAt,
                userId: '',
            });
        return [newPurchase, originalId];
    }

    // front 정보 transactions
    async subscriptionPurchaseHandelerAOS(useId: string, verificationData: string): Promise<PurchaseModel> {
        const verified = await this.verifyPurchaseAOS(verificationData);
        if(!verified){
            throw new Error('[Purchase] Subscribe verify failed.');
        }
        verified.userId = useId;
        const newPurchase = await this.saveSubscribe(verified, verificationData);
        return newPurchase;
    }
    async subscriptionPurchaseUpdateAOS(useId: string, verificationData: string, prevToken: string): Promise<PurchaseModel> {
        const prevProduct = await this.getSubscribeByToken(prevToken);
        if(!prevProduct){
            const isActived = await this.purchaseRepository.getIsActiveSubscription(useId);
            if(!isActived){
                console.log('[Purchase] prevProduct & isActived not found.');
                console.log('[Purchase] changes to new purchase.');
                const newPurchase = await this.subscriptionPurchaseHandelerAOS(useId, verificationData);
                return newPurchase;
            }else {
                isActived.isActive = false;
                isActived.willRenew = false;
                await this.updateSubcribe(isActived, prevToken);
            }
        }
        const verified = await this.verifyPurchaseAOS(verificationData);
        if(!verified){
            throw new Error('[Purchase] Subscribe verify failed.');
        }
        verified.id = prevProduct.id;
        verified.createdAt = prevProduct.createdAt;
        verified.userId = useId;
        
        const updatePurchase = await this.updateSubcribe(verified, verificationData);
        console.log('[Purchase] update success');
        return updatePurchase;
    }
    async subscriptionHandelerIOS(useId: string, verificationData: string): Promise<PurchaseModel> {
        const [model, originalId] = await this.verifyPurchaseIOS(verificationData);
        model.userId = useId;
        const newPurchase = await this.saveSubscribe(model, originalId);
        return newPurchase;
        // TODO확인 요망
    }
    // store 별 webHook 실행
    // webHook에서 받은 데이터는 영수검증이 필요 없음
    // 바로 서버 조회 후 신규 or 업데이트 
    async webhookAOS(purchaseToken: string, subscriptionId: string, notificationType: number): Promise<void> {
        //DB조회
        const findProduct = await this.getSubscribeByToken(purchaseToken);
        // 신규 구매 시 이미 데이터 존재 하면 멈춤
        if (notificationType === 4 && findProduct.state !== 'purchased') {
            console.log('[Webhook AOS] purchaseToken data already exsist.');
            return;
        }
        let type: string;
        switch (notificationType) {
            case 2:
                type = 'renew';
                break;
            case 3:
                type = 'cancel';
                break;
            case 4:
                type = 'purchased';
            case 12:
                type = 'revoke';
                break;
            case 13:
                type = 'expried';
                break;
        }
        if (findProduct) {
            const verified = await this.verifyPurchaseAOS(purchaseToken);
            findProduct.expiresAt = verified.expiresAt;
            findProduct.state = type;
            if (type !== 'renew') {
                if (type === 'cancel') {
                    findProduct.willRenew = false;
                } else {
                    findProduct.isActive = false;
                    findProduct.willRenew = false;
                }
            }
            await this.updateSubcribe(findProduct, purchaseToken);
            //TODO: FCM service 연동 필요. 변경 알림.
        } else {
            // 기존 데이터가 없다면 업데이트 진행 안함/ 신규 구매는 전적으로 front에서 전담.
            return;
        }
    }
    async webhookIOS(payload: IIosWebhookPayload): Promise<void> {

        let transactions = null;
        if (payload.data.signedTransactionInfo) {
            transactions = decodeJwt(payload.data.signedTransactionInfo);
        }
        const updateItem = await this.getSubscribeByToken(transactions.originalTransactionId);

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
        updateItem.plan = plan;
        updateItem.productId = productId;
        updateItem.expiresAt = expiredAt;
        await this.saveSubscribe(updateItem, transactions.originalTransactionId);
        console.log('[Purchase Webhook] IOS update success');
        return;
    }
}