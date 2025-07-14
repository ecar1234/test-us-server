import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { ApplicationEntity } from "./application_entity";
import { UserEntity } from "./user_entity";


// 리뷰 유형을 정의하는 Enum
export enum ReviewType {
    PRODUCT_RATING = 'PRODUCT_RATING',             // 참여 유저 -> 작성자 제품 평가
    PARTICIPANT_ATTITUDE_RATING = 'PARTICIPANT_ATTITUDE_RATING', // 작성자 유저 -> 참여자 태도 평가
}

@Entity('Review')
@Unique(['application', 'reviewer', 'reviewed'])
export class ReviewEntity {
    @PrimaryGeneratedColumn('uuid')
    reviewId: string

    @Column({ type: 'int' })
    rating: number; // 1-5점 등

    @Column({ type: 'text', nullable: true })
    comment: string | null; // 평가 내용 (선택 사항)

    @Column({
        type: 'enum',
        enum: ReviewType,
    })
    reviewType: ReviewType;

    @CreateDateColumn()
    createdAt: Date;

    // Review는 하나의 Application에 연결됩니다.
    @ManyToOne(() => ApplicationEntity, application => application.reviews, { onDelete: 'CASCADE' }) // Application 삭제 시 관련 Review도 삭제 (옵션)
    @JoinColumn({ name: 'appId' }) // reviews 테이블에 'application_id' 컬럼 생성 및 외래 키로 사용
    application: ApplicationEntity;

    // Review는 하나의 User(평가자)에 의해 작성됩니다.
    @ManyToOne(() => UserEntity, user => user.givenReviews, { onDelete: 'CASCADE' }) // User 삭제 시 관련 Review도 삭제 (옵션)
    @JoinColumn({ name: 'reviewerUserId' }) // reviews 테이블에 'reviewer_user_id' 컬럼 생성 및 외래 키로 사용
    reviewer: UserEntity;

    // Review는 하나의 User(평가 대상)에 대한 것입니다.
    @ManyToOne(() => UserEntity, user => user.receivedReviews, { onDelete: 'CASCADE' }) // User 삭제 시 관련 Review도 삭제 (옵션)
    @JoinColumn({ name: 'reviewedUserId' }) // reviews 테이블에 'reviewed_user_id' 컬럼 생성 및 외래 키로 사용
    reviewed: UserEntity;
}