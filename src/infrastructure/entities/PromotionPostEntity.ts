import { Column, ChildEntity } from "typeorm";
import { BasePostEntity } from "./BasePostEntity";

export enum PromotionPostStatusType {
    ACTIVE = 'active',
    EXPIRED = 'expired',
    DELETE = 'delete'
}

@ChildEntity()
export class PromotionPostEntity extends BasePostEntity {

    @Column({ type: 'simple-array', nullable: false })
    platform: string[]

    @Column({ type: 'enum', enum: PromotionPostStatusType, default: 'active' })
    status: PromotionPostStatusType

    @Column({ type: 'simple-array', nullable: false })
    domain: string[]

    @Column('int', { default: 7 })
    period: number
}