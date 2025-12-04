import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { UserEntity } from "./UserEntity";
import { BasePostEntity } from "./BasePostEntity";

export enum PostReviewType {
    PROMOTION_RATING = 'PROMOTION',
    RECRUIT_RATING = 'RECRUIT',
}

@Entity('post_reviews') // 새로운 테이블 이름
@Unique(['reviewer', 'post'])
export class PostReviewEntity {
    @PrimaryGeneratedColumn("uuid")
    reviewId: string;

    @Column('float')
    rating: number;

    @Column({ type: 'text', nullable: true })
    comment: string;

    @Column({ type: 'enum', enum: PostReviewType })
    reviewType: PostReviewType;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: 'reviewerUserId' })
    reviewer: UserEntity;

    @ManyToOne(() => BasePostEntity)
    @JoinColumn({ name: 'postId' })
    post: BasePostEntity;
}
