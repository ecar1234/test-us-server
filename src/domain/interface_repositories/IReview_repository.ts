import { ReviewModel } from '../entities/ReviewModel';

export interface IReviewRepository {
    createReview(review: ReviewModel): Promise<ReviewModel>;
    getReviewById(reviewId: string): Promise<ReviewModel | null>;
    getReviewsByApplicationId(applicationId: number): Promise<ReviewModel[]>;
    getReviewsByReviewerUserId(reviewerUserId: string): Promise<ReviewModel[]>;
    getReviewsByReviewedUserId(reviewedUserId: string): Promise<ReviewModel[]>;
    deleteReview(reviewId: string): Promise<boolean>;
}