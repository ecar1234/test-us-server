import { Column, ChildEntity } from "typeorm";
import { BasePostEntity } from "./BasePostEntity.js";


@ChildEntity()
export class PromotionPostEntity extends BasePostEntity {

    @Column({ type: 'text', nullable: false })
    domain: string
}