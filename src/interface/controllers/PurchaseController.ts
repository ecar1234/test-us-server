import { PurchaseUseCase } from "../../app/PurchaseUseCase.js";
import { Request, Response } from "express";

export class PurchaseController {

    constructor(private purchaseUseCase: PurchaseUseCase) { }

    // Store Webhooks
    async handleWebhookGoogle(req: Request, res: Response): Promise<void> {
        const pubSubMessage = req.body.message;
        if(!pubSubMessage || !pubSubMessage.data){
            res.status(400).json({ status: 400, message: 'no data found'});
            return;
        }

        const decodeData = Buffer.from(pubSubMessage.data, 'base64').toString('utf-8');
        const payload = JSON.parse(decodeData);
        if(payload.testNotification){
            console.log('----- Google test notification -----');
            console.log(payload);
            
            res.status(200).send('OK');
            return;
        }

        if(payload.subscriptionNotification){
            const { purchaseToken, subscriptionId, notificationType } = payload.subscriptionNotification;
            // notificationType
            // 2 : SUBSCTIPTION_RENEWED
            // 3 : SUBSCRIPTION_CANCELLED
            // 4 : SUBSBRIPTION_PURCHASED
            // 12: SUBSCRIPTION_REVOKED
            // 13 : SUBSCRIPTION_EXPIRED
            // subscriptionId : productID
            await this.purchaseUseCase.webhookAOS(purchaseToken, subscriptionId, notificationType);
        }
        res.status(200).send('OK');
        return;
    }
    async handleWebhookApple(req: Request, res: Response): Promise<void> {
        const payload = req.applePayload;
        if(!payload){
            res.status(400).json({ status: 400, message: 'no data found'});
            return;
        }

        await this.purchaseUseCase.webhookIOS(payload);
        res.status(200).send('OK');
        return;
    }
    // 테스트용 debugging
    async logDebugEvent(req: Request, res: Response): Promise<void> {
        try {
            const eventData = req.body;
            // Implementation for logging debug events
            console.log('[Purchase Debug]', eventData);
            res.status(200).json({ status: 200, result: true });
        } catch (error) {
            res.status(500).json({ status: 500, message: error.message });
        }
    }

    async errorlogEvent(req: Request, res: Response): Promise<void> {
        try {
            const errorData = req.body;
            console.log('[Purchase Debug]', errorData);
            // Implementation for logging errors
            res.status(200).json({ status: 200, result: true });
        } catch (error) {
        }
    }

    /// 강제 동기화
    async refreshPurchaseStatus(req: Request, res: Response): Promise<void> {
        try {
            const { userId } = req.body;
            // Implementation for refreshing subscription status
            res.status(200).json({ status: 200, result: true });
        } catch (error) {
            res.status(500).json({ status: 500, message: error.message });
        }
    }
    /// 구독 내역 가져오기
    async getSubscribes(req: Request, res: Response): Promise<void> {
        try {
            const { userId } = req.params;
            const subscribes = await this.purchaseUseCase.getSubscriptions(userId);
            
            res.status(200).json({ status: 200, subscribes: subscribes });
            
        } catch (error) {
            res.status(500).json({ status: 500, message: error.message });
        }
    }
    /// 구독 확인
    async purchaseAOS(req: Request, res: Response): Promise<void> {
        const { userId, verificationData } = req.body;
        try {
           const subscribe = await this.purchaseUseCase.subscriptionPurchaseHandelerAOS(userId, verificationData);
           res.status(200).json({ status: 200, subscribe: subscribe });
        } catch (error) {
            console.log('[Purchase verification] Error', error);
            res.status(500).json({ status: 500, message: error.message });
            return;
        }
    }
    async purchaseIOS(req: Request, res: Response): Promise<void> {
        const { userId, verificationData } = req.body;
        try {} catch (error) {}
    }
    
}