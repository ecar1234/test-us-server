import { AppDataSource } from "../../config/DataSource";
import { ReviewModel } from "../../domain/entities/ReviewModel";
import { IReviewRepository } from "../../domain/interface_repositories/IReview_repository";
import { ReviewEntity, ReviewType } from "../entities/ReviewEntiry";


export class ReviewRepositoryImpl implements IReviewRepository {
    private reviewDataSource = AppDataSource.getRepository(ReviewEntity);
    private toDomainReview(reviewEntity: ReviewEntity): ReviewModel {
        return new ReviewModel(
            reviewEntity.reviewId,
            reviewEntity.rating,
            reviewEntity.comment,
            reviewEntity.reviewType,
            reviewEntity.createdAt,
            reviewEntity.application.appId,
            reviewEntity.reviewer.userId,
            reviewEntity.reviewed.userId
        );
    }
    private toEntityReview(reviewModel: ReviewModel): ReviewEntity {
        const reviewType = reviewModel.reviewType === 'PRODUCT_RATING' ? ReviewType.PRODUCT_RATING : ReviewType.PARTICIPANT_ATTITUDE_RATING;
        const reviewEntity = new ReviewEntity();
        reviewEntity.reviewId = reviewModel.reviewId;
        reviewEntity.rating = reviewModel.rating;
        reviewEntity.comment = reviewModel.comment;
        reviewEntity.reviewType = reviewType;
        reviewEntity.createdAt = reviewModel.createdAt;
        // Assuming application, reviewer, and reviewed are set elsewhere
        return reviewEntity;
    }
    async createReview(review: ReviewModel): Promise<ReviewModel> {
        const reviewEntity = this.toEntityReview(review);
        return this.reviewDataSource.save(reviewEntity)
            .then(savedEntity => this.toDomainReview(savedEntity));
    }
    async getReviewById(reviewId: string): Promise<ReviewModel | null> {
        return this.reviewDataSource.findOne({ where: { reviewId } })
            .then(reviewEntity => reviewEntity ? this.toDomainReview(reviewEntity) : null);
    }
    async getReviewsByApplicationId(applicationId: string): Promise<ReviewModel[]> {
        return this.reviewDataSource.find({ where: { application: { appId: applicationId } } })
            .then(reviewEntities => reviewEntities.map(this.toDomainReview.bind(this)));
    }
    async getReviewsByReviewerUserId(reviewerUserId: string): Promise<ReviewModel[]> {
        return this.reviewDataSource.find({ where: {reviewer : {userId: reviewerUserId}}})
            .then(reviewEntities => reviewEntities.map(this.toDomainReview.bind(this)));
    }
    async getReviewsByReviewedUserId(reviewedUserId: string): Promise<ReviewModel[]> {
        return this.reviewDataSource.find({where: {reviewed: {userId : reviewedUserId}}})
        .then(reviewEntities => reviewEntities.map(this.toDomainReview.bind(this)));
    }
    async deleteReview(reviewId: string): Promise<boolean> {
        const result = await this.reviewDataSource.delete({ reviewId : reviewId});
        return result.affected !== 0;
    }
    
}