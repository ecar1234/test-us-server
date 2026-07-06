import { PurchaseModel } from "../../entities/PurchaseModel.js"


export interface IPurchaseIosRepository {
    saveSubscribe(subscribe: PurchaseModel, transactionId: string, originalId: string): Promise<PurchaseModel>;
    updateSubcribe(subscribe: PurchaseModel, transactionId : string, originalId : string): Promise<PurchaseModel>;
    getSubscriptionByTransactionId(transactionId: string): Promise<PurchaseModel | null>;
    getCurrentActiveSubscriptionByOriginalId(originalId: string): Promise<PurchaseModel | null>;
}