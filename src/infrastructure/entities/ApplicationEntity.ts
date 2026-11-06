import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, Relation, Unique, UpdateDateColumn } from "typeorm";
import type { RecruitmentPostEntity } from "./PostEntities/RecruitmentPostEntity.js";
import type { UserEntity } from "./UserEntity.js";
import type { SideProjectPostEntity } from "./PostEntities/SideProject/SideProjectPostEntity.js";
import { MobileOsType } from "../enums/PostEnums.js";

// 신청 상태를 정의하는 Enum
export enum ApplicationStatus {
    PENDING = 'pending',
    ACCEPTED = 'accepted',
    REJECTED = 'rejected',
    CANCEL = 'cancel'
}
export enum ApplicationsPlatform {
    WEB = 'web',
    MOBILE = 'mobile',
    EMPTY = 'empty'
}

@Entity('applications')
@Unique(['recruitPost', 'applicant'])
export class ApplicationEntity {
    @PrimaryGeneratedColumn('increment')
    appId: number

    @Column({type: 'enum', enum: ApplicationsPlatform, default: ApplicationsPlatform.WEB})
    platform: ApplicationsPlatform

    @Column({type: 'enum', enum: MobileOsType, nullable: true})
    mobileOs: MobileOsType

    @Column({
        type: 'enum',
        enum: ApplicationStatus,
        default: ApplicationStatus.PENDING,
    })
    status: ApplicationStatus;

    @CreateDateColumn()
    appliedAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne('RecruitmentPostEntity', (recruitPost:RecruitmentPostEntity) => recruitPost.applications, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'postId' })
    recruitPost: Relation<RecruitmentPostEntity>

    @ManyToOne( 'SideProjectPostEntity', (side:SideProjectPostEntity) => side.applications, {onDelete : 'CASCADE'})
    @JoinColumn({name: 'postId'})
    sidePost : Relation<SideProjectPostEntity>

    // 신청 유저의 승인 상테
    @ManyToOne('UserEntity', (user:UserEntity) => user.applications, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'appUserId' })
    applicant: Relation<UserEntity>

    // @OneToMany(() => UserReviewEntity, review => review.application)
    // reviews: UserReviewEntity[];
}