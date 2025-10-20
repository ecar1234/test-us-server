import { AppDataSource } from "../../config/DataSource";
import { ApplicationModel } from "../../domain/entities/ApplicationModel";
import { ReviewModel } from "../../domain/entities/ReviewModel";
import { UserModel } from "../../domain/entities/UserModel";
import { IReviewRepository } from "../../domain/interface_repositories/IReview_repository";
import { ApplicationEntity } from "../entities/ApplicationEntity";
import { UserEntity } from "../entities/UserEntity";
import { ReviewEntity, ReviewType } from "../entities/ReviewEntiry";
import { In } from "typeorm";


export class ReviewRepositoryImpl implements IReviewRepository {
    private reviewDataSource = AppDataSource.getRepository(ReviewEntity);
    private toDomainReview(reviewEntity: ReviewEntity): ReviewModel {
        // ReviewModel constructor expects IDs, not full model objects.
        // Ensure relations are loaded when calling this method.
        return new ReviewModel(
            reviewEntity.reviewId,
            reviewEntity.rating,
            reviewEntity.comment,
            reviewEntity.reviewType,
            reviewEntity.createdAt,
            reviewEntity.application?.appId, // Pass appId
            reviewEntity.reviewer?.userId,   // Pass userId
            reviewEntity.reviewed?.userId    // Pass userId
        );
    }
    private toEntityReview(reviewModel: ReviewModel): ReviewEntity {
        const reviewType = reviewModel.reviewType === 'PRODUCT_RATING' ? ReviewType.PRODUCT_RATING : ReviewType.PARTICIPANT_ATTITUDE_RATING;
        const reviewEntity = new ReviewEntity();
        reviewEntity.reviewId = reviewModel.reviewId;
        reviewEntity.rating = reviewModel.rating;
        reviewEntity.comment = reviewModel.comment;
        reviewEntity.reviewType = reviewType;
        reviewEntity.createdAt = reviewModel.createdAt || new Date(); // Ensure createdAt is set
        reviewEntity.application = { appId: reviewModel.applicationId } as ApplicationEntity; // No change needed here
        reviewEntity.reviewer = { userId: reviewModel.reviewerUserId } as UserEntity; // No change needed here
        reviewEntity.reviewed = { userId: reviewModel.reviewedUserId } as UserEntity; // No change needed here
        return reviewEntity;
    }
    async createReview(review: ReviewModel): Promise<ReviewModel> {
        const reviewEntity = this.toEntityReview(review);
        const savedEntity = await this.reviewDataSource.save(reviewEntity);
        // Fetch the saved entity with relations to convert it to domain model
        const fullSavedEntity = await this.reviewDataSource.findOne({
            where: { reviewId: savedEntity.reviewId },
            relations: ['application', 'reviewer', 'reviewed']
        });
        return this.toDomainReview(fullSavedEntity);
    }
    async getReviewById(reviewId: string): Promise<ReviewModel | null> {
        // post 정보까지 함께 로드하기 위해 relations를 추가합니다.
        return this.reviewDataSource.findOne({
            where: { reviewId },
            relations: ['application', 'application.post', 'reviewer', 'reviewed']
        })
            .then(reviewEntity => reviewEntity ? this.toDomainReview(reviewEntity) : null);
    }
    async getUserReviewAverage(userIds: string[]): Promise<ReviewModel[]> {
        
       const reviews = await this.reviewDataSource.find({
            where: { reviewed: { userId: In(userIds) }, reviewType: ReviewType.PARTICIPANT_ATTITUDE_RATING },
            relations : ['application', 'application.post', 'reviewer', 'reviewed']
        });

       return reviews.map(review => this.toDomainReview(review));
    }
    // async getReviewsByApplicationId(applicationId: number): Promise<ReviewModel[]> {
    //     return this.reviewDataSource.find({
    //         where: { application: { appId: applicationId } },
    //         relations: ['application', 'application.post', 'reviewer', 'reviewed']
    //     })
    //         .then(reviewEntities => reviewEntities.map(this.toDomainReview.bind(this)));
    // }
    // async getReviewsByReviewerUserId(reviewerUserId: string): Promise<ReviewModel[]> {
    //     return this.reviewDataSource.find({
    //         where: { reviewer: { userId: reviewerUserId } },
    //         relations: ['application', 'application.post', 'reviewer', 'reviewed']
    //     })
    //         .then(reviewEntities => reviewEntities.map(this.toDomainReview.bind(this)));
    // }
    // async getReviewsByReviewedUserId(reviewedUserId: string): Promise<ReviewModel[]> {
    //     return this.reviewDataSource.find({
    //         where: { reviewed: { userId: reviewedUserId } },
    //         relations: ['application', 'application.post', 'reviewer', 'reviewed']
    //     }).then(reviewEntities => reviewEntities.map(this.toDomainReview.bind(this)));
    // }
    // async deleteReview(reviewId: string): Promise<boolean> {
    //     const result = await this.reviewDataSource.delete({ reviewId : reviewId});
    //     return result.affected !== 0;
    // }
    
}