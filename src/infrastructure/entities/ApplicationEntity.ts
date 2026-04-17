import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, Relation, Unique, UpdateDateColumn } from "typeorm";
import { RecruitmentPostEntity } from "./PostEntities/RecruitmentPostEntity.js";
import { UserEntity } from "./UserEntity.js";
import { UserReviewEntity } from "./UserReviewEntiry.js";
import { MobileOsType } from "./PostEntities/BasePostEntity.js";

// 신청 상태를 정의하는 Enum
export enum ApplicationStatus {
    PENDING = 'pending',
    ACCEPTED = 'accepted',
    REJECTED = 'rejected',
    CANCEL = 'cancel'
}
export enum ApplicationsPlatform {
    WEB = 'web',
    MOBILE = 'mobile'
}

@Entity('applications')
@Unique(['post', 'applicant'])
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

    @ManyToOne(() => RecruitmentPostEntity, post => post.applications, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'postId' })
    post: RecruitmentPostEntity

    // 신청 유저의 승인 상테
    @ManyToOne(() => UserEntity, user => user.applications, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'appUserId' })
    applicant: Relation<UserEntity>

    // @OneToMany(() => UserReviewEntity, review => review.application)
    // reviews: UserReviewEntity[];
}