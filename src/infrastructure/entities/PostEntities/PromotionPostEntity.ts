import { Column, ChildEntity } from "typeorm";
import { BasePostEntity } from "./BasePostEntity.js";


@ChildEntity('PROMOTION')
export class PromotionPostEntity extends BasePostEntity {

    @Column({ type: 'text', nullable: true })
    domain: string
}