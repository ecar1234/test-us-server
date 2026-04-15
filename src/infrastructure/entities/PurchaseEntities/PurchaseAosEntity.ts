import { ChildEntity, Column } from "typeorm";
import { PurchaseEntity } from "./PurchaseEntity.js";

@ChildEntity()
export class PurchaseAosEntity extends PurchaseEntity {
    @Column()
    rootId: string;

    @Column()
    purchaseToken: string;
    
    @Column()
    linkedPurchaseToken?: string;
}