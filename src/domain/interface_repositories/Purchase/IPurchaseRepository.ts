import { PurchaseModel } from "../../entities/PurchaseModel.js";

export interface IPurchaseRepository {    
    getSubscriptions(userId: string): Promise<PurchaseModel[]>;
}