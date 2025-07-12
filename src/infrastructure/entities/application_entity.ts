import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import { PostEntity } from "./post_entity";
import { UserEntity } from "./user_entity";
import { ReviewEntity } from "./review_entity";

// 신청 상태를 정의하는 Enum
export enum ApplicationStatus {
    PENDING = 'pending',
    ACCEPTED = 'accepted',
    REJECTED = 'rejected',
}
export enum ApplicationsPlatform {
    WEB = 'web',
    IOS = 'ios',
    ANDROID = 'android',
}

@Entity('Application')
@Unique(['post', 'applicant'])
export class ApplicationEntity {
    @PrimaryGeneratedColumn('uuid')
    appId: string

    @Column({type: 'enum', enum: ApplicationsPlatform, default: ApplicationsPlatform.WEB})
    platform: ApplicationsPlatform

    @Column({
        type: 'enum',
        enum: ApplicationStatus,
        default: ApplicationStatus.PENDING,
    })
    status: ApplicationStatus;

    @CreateDateColumn()
    appliedAt: Date; // 신청 일시

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => PostEntity, post => post.applications, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'post_id' })
    post: PostEntity

    @ManyToOne(() => UserEntity, user => user.applications, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'app_user_id' })
    applicant: UserEntity

    @OneToMany(() => ReviewEntity, review => review.application)
    reviews: ReviewEntity[];
}