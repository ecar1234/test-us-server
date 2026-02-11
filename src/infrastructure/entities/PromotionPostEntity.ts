import { Column, ChildEntity } from "typeorm";
import { BasePostEntity } from "./BasePostEntity";


@ChildEntity()
export class PromotionPostEntity extends BasePostEntity {

    @Column({ type: 'text', nullable: false })
    domain: string
}