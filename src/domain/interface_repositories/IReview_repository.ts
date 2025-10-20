import { ReviewModel } from '../entities/ReviewModel';

export interface IReviewRepository {
    createReview(review: ReviewModel): Promise<ReviewModel>;
    getReviewById(reviewId: string): Promise<ReviewModel | null>;
    // getUserReviewAverage(userIds: string[]): Promise<Array<{ userId: string; reviews: ReviewModel[] }>>; // This can remain as is, as the transformation happens in the UseCase
    // getReviewsByApplicationId(applicationId: number): Promise<ReviewModel[]>;
    // getReviewsByReviewerUserId(reviewerUserId: string): Promise<ReviewModel[]>;
    // getReviewsByReviewedUserId(reviewedUserId: string): Promise<ReviewModel[]>;
    // deleteReview(reviewId: string): Promise<boolean>;
}