import { PurchaseModel } from "../../entities/PurchaseModel.js"


export interface IPurchaseAosRepository {
    saveSubscribe(subscribe: PurchaseModel, purchaseToken: string, linkedToken?: string): Promise<PurchaseModel>
    updateSubcribe(subscribe: PurchaseModel, purchaseToken: string, linkedToken: string): Promise<PurchaseModel>
    getSubscribeByToken(userId: string): Promise<PurchaseModel>;
}