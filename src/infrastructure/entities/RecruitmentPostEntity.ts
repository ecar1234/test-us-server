import { Column, ChildEntity, OneToMany } from "typeorm";
import { ApplicationEntity } from "./ApplicationEntity";
import { BasePostEntity } from "./BasePostEntity";

export enum RecruitmentPostStatusType {
    ACTIVE = 'active',
    END = 'end',
    EXPIRED = 'expired',
    DELETE = 'delete'
} 
@ChildEntity()
export class RecruitmentPostEntity extends BasePostEntity {

    @Column({ type: 'simple-array', nullable: false })
    platform: string[]

    @Column({ type: 'enum', enum: RecruitmentPostStatusType, default: 'active' })
    status: RecruitmentPostStatusType

    @Column('int', { default: 7 })
    period: number

    @OneToMany(() => ApplicationEntity, application => application.post)
    applications: ApplicationEntity[]
}