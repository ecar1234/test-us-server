import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import { RecruitmentPostEntity } from "./RecruitmentPostEntity";
import { UserEntity } from "./UserEntity";
import { UserReviewEntity } from "./UserReviewEntiry";

// 신청 상태를 정의하는 Enum
export enum ApplicationStatus {
    PENDING = 'pending',
    ACCEPTED = 'accepted',
    REJECTED = 'rejected',
    CANCEL = 'cancel'
}
export enum ApplicationsPlatform {
    WEB = 'web',
    IOS = 'ios',
    ANDROID = 'android',
}

@Entity('applications')
@Unique(['post', 'applicant'])
export class ApplicationEntity {
    @PrimaryGeneratedColumn('increment')
    appId: number

    @Column({type: 'enum', enum: ApplicationsPlatform, default: ApplicationsPlatform.WEB})
    platform: ApplicationsPlatform

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
    applicant: UserEntity

    @OneToMany(() => UserReviewEntity, review => review.application)
    reviews: UserReviewEntity[];
}