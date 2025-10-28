import { Column, ChildEntity } from "typeorm";
import { BasePostEntity } from "./BasePostEntity";


@ChildEntity()
export class PromotionPostEntity extends BasePostEntity {

    @Column({ type: 'simple-array', nullable: false })
    domain: string[]
}