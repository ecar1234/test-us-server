import { ChildEntity, Column, Index } from "typeorm";
import { PurchaseEntity } from "./PurchaseEntity.js";


@ChildEntity()
export class PurchaseIosEntity extends PurchaseEntity {
    @Column({ type: 'varchar', unique: true, nullable: true })
    transactionId: string;

    @Column('varchar', { nullable: true })
    @Index()
    originalTransactionId: string;
}