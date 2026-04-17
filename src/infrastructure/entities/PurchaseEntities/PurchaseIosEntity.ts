import { ChildEntity, Column } from "typeorm";
import { PurchaseEntity } from "./PurchaseEntity.js";


@ChildEntity()
export class PurchaseIosEntity extends PurchaseEntity {
    @Column('varchar')
    transactionId: string;

    @Column('varchar')
    originalTransactionsId: string;
}