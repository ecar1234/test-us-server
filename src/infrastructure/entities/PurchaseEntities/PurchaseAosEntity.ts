import { ChildEntity, Column } from "typeorm";
import { PurchaseEntity } from "./PurchaseEntity.js";

@ChildEntity()
export class PurchaseAosEntity extends PurchaseEntity {
    @Column('varchar', { nullable: true })
    rootId: string;

    @Column({ type: 'varchar', unique: true, nullable: true })
    purchaseToken: string;

    @Column('varchar', { nullable: true })
    linkedPurchaseToken?: string;
}