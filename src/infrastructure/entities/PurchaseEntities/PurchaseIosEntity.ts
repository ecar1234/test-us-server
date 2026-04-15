import { ChildEntity, Column } from "typeorm";
import { PurchaseEntity } from "./PurchaseEntity.js";


@ChildEntity()
export class PurchaseIosEntity extends PurchaseEntity {
    @Column()
    transactionId: string;

    @Column()
    originalTransactionsId: string;
}