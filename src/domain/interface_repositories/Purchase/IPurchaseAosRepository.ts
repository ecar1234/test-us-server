import { PurchaseModel } from "../../entities/PurchaseModel.js"


export interface IPurchaseAosRepository {
    saveSubscribe(subscribe: PurchaseModel, token: string, linkedToken?: string): Promise<PurchaseModel>
    updateSubcribe(subscribe: PurchaseModel, tokenOrReceipt: string): Promise<PurchaseModel>
    getSubscribeByToken(userId: string): Promise<PurchaseModel>;
}