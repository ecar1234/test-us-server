import { ReviewModel } from "../domain/entities/ReviewModel";
import { ReviewRepositoryImpl } from "../infrastructure/repositories/ReviewRepositoryImpl";


export class ReviewUseCase {
    constructor(private reviewRepo: ReviewRepositoryImpl){}

    async createReview(review: ReviewModel): Promise<ReviewModel>{
        return this.reviewRepo.createReview(review);
    }
    async getReviewById(reviewId: string):Promise<ReviewModel | null>{
        return this.reviewRepo.getReviewById(reviewId);
    }
    async getReviewsByApplicationId(applicationId: string): Promise<ReviewModel[]>{
        return this.reviewRepo.getReviewsByApplicationId(applicationId);
    }
    async getReviewsByReviewerUserId(reviewerUserId: string): Promise<ReviewModel[]>{
        return this.reviewRepo.getReviewsByReviewedUserId(reviewerUserId);
    }
    async getReviewsByReviewedUserId(reviewedUserId: string): Promise<ReviewModel[]>{
        return this.reviewRepo.getReviewsByReviewedUserId(reviewedUserId);
    }
    async deleteReview(reviewId: string): Promise<boolean>{
        return this.reviewRepo.deleteReview(reviewId);
    }
}