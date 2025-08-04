import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import { PostEntity } from "./PostEntity";
import { UserEntity } from "./UserEntity";
import { ReviewEntity } from "./ReviewEntiry";

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

@Entity('Application')
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

    @ManyToOne(() => PostEntity, post => post.applications, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'postId' })
    post: PostEntity

    // 신청 유저의 승인 상테
    @ManyToOne(() => UserEntity, user => user.applications, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'appUserId' })
    applicant: UserEntity

    @OneToMany(() => ReviewEntity, review => review.application)
    reviews: ReviewEntity[];
}