import { ChildEntity, Column, Index } from "typeorm";
import { PurchaseEntity } from "./PurchaseEntity.js";


@ChildEntity()
export class PurchaseIosEntity extends PurchaseEntity {
    @Column({type: 'varchar', unique: true})
    transactionId: string;

    @Column('varchar')
    @Index()
    originalTransactionsId: string;
}