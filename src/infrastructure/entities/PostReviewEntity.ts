import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Relation, Unique } from "typeorm";
import type { BasePostEntity } from "./PostEntities/BasePostEntity.js";
import type { UserEntity } from "./UserEntity.js";

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

    @ManyToOne('UserEntity', (user: UserEntity) => user.userId, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'reviewerUserId' })
    reviewer: Relation<UserEntity>;

    @ManyToOne('BasePostEntity', (post: BasePostEntity) => post.postId, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'postId' })
    post: Relation<BasePostEntity>;
}
