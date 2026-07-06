import { ChildEntity, Column } from "typeorm";
import { PurchaseEntity } from "./PurchaseEntity.js";

@ChildEntity()
export class PurchaseAosEntity extends PurchaseEntity {
    @Column('varchar')
    rootId: string;

    @Column({ type: 'varchar', unique: true })
    purchaseToken: string;
    
    @Column('varchar', { nullable: true })
    linkedPurchaseToken?: string;
}