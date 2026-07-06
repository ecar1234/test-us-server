import { EntityManager } from "typeorm";
import { PurchaseModel } from "../../entities/PurchaseModel.js"


export interface IPurchaseAosRepository {
    saveSubscribe(subscribe: PurchaseModel, purchaseToken: string, linkedToken?: string, manager?: EntityManager): Promise<PurchaseModel>
    updateSubcribe(subscribe: PurchaseModel, purchaseToken: string, linkedToken?: string, manager?: EntityManager): Promise<PurchaseModel>
    getSubscribeByToken(userId: string): Promise<PurchaseModel>;
}