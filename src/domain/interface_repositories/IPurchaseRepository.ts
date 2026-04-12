import { PurchaseModel } from "../entities/PurchaseModel.js";

export interface IPurchaseRepository {
    saveSubscribe(subscribe: PurchaseModel, tokenOrReceipt: string): Promise<PurchaseModel>
    updateSubcribe(subscribe: PurchaseModel, tokenOrReceipt: string): Promise<PurchaseModel>
    getSubscribeByToken(userId: string): Promise<PurchaseModel>
    getSubscriptions(userId: string): Promise<PurchaseModel[]>
}