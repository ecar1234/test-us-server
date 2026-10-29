import { Column, ChildEntity, OneToMany } from "typeorm";
import { BasePostEntity } from "./BasePostEntity.js";
import { ApplicationEntity } from "../ApplicationEntity.js";


@ChildEntity('RECRUIT')
export class RecruitmentPostEntity extends BasePostEntity {

    @Column({ type: 'int', nullable: true, comment: '필요한 테스터 인원 수' })
    requiredTesters: number;

    @Column({ type: 'varchar', nullable: true, comment: '테스터 보상 내용' })
    reward: string;

    @Column({ type: 'datetime', nullable: true, comment: '테스트 시작 일시' })
    testStartDate: Date;

    @Column({ type: 'datetime', nullable: true, comment: '테스트 종료 일시' })
    testEndDate: Date;

    @OneToMany(() => ApplicationEntity, application => application.sidePost)
    applications: ApplicationEntity[];
}