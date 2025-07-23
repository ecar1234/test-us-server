import { ReviewUseCase } from "../../app/ReviewUseCase";
import { ReviewModel } from "../../domain/entities/ReviewModel";
import { Request, Response } from 'express';

export class ReviewController {
    constructor(private reviewUseCase: ReviewUseCase) { }

    async createReview(req: Request, res: Response): Promise<void> {
        const { reviewId, rating, comment, reviewType, createdAt, applicationId, reviewerUserId, reviewedUserId } = req.body;
        const reviewData = new ReviewModel(
            reviewId, rating, comment, reviewType, createdAt, applicationId, reviewerUserId, reviewedUserId
        );

        const result = await this.reviewUseCase.createReview(reviewData);
        res.status(200).json({ review: result, message: "review create success." })
    }
    async getReviewById(req: Request, res: Response): Promise<void> {
        const reviewId: string = req.params.reviewId;
        const result = await this.reviewUseCase.getReviewById(reviewId);

        res.status(result ? 200 : 404).json({ review: result });
    }
    async getReviewsByApplicationId(req: Request, res: Response): Promise<void> {
        const appId: string = req.params.applicationId;
        const result: ReviewModel[] = await this.reviewUseCase.getReviewsByApplicationId(appId);

        res.status(200).json({ reviews: result });
    }
    async getReviewsByReviewerUserId(req: Request, res: Response): Promise<void> {
        const reviewerId: string = req.params.reviewerId;
        const result: ReviewModel[] = await this.reviewUseCase.getReviewsByReviewerUserId(reviewerId);

        res.status(200).json({ reviews: result });
    }
    async getReviewsByReviewedUserId(req: Request, res: Response): Promise<void> {
        const reviewedId: string = req.params.reviewedId;
        const result : ReviewModel[] = await this.reviewUseCase.getReviewsByReviewedUserId(reviewedId);

        res.status(200).json({ reviews : result });
    }
    async deleteReview(req: Request, res: Response): Promise<void> {
        const reviewId: string = req.params.reviewId;
        const result: boolean = await this.reviewUseCase.deleteReview(reviewId);

        res.status(result ? 200 : 404).json({ result : result ? 'success delete review' : 'delete failed' });
    }
}