import { ReviewUseCase } from "../../app/ReviewUseCase";

import { Request, Response } from 'express';

export class ReviewController {
    constructor(private reviewUseCase: ReviewUseCase) { }

    async addPromotionReview(req: Request, res: Response): Promise<void> {
        const { rating, comment, reviewType, reviewerId, reviewedId } = req.body;
        const review = await this.reviewUseCase.addPromotionReview(rating, comment, reviewType, reviewerId, reviewedId);
        res.status(200).json({ status: 200, review: review });

    }
    async addRecruitReview(req: Request, res: Response): Promise<void> {
        const { rating, comment, reviewType, reviewerId, reviewedId } = req.body;
        const review = await this.reviewUseCase.addRecruitReview(rating, comment, reviewType, reviewerId, reviewedId);
        res.status(200).json({ status: 200, review: review });
    }
    async addUserReview(req: Request, res: Response): Promise<void> {
        const { rating, comment, reviewerUserId, reviewedUserId, applicationId, postId} = req.body;
        const review = await this.reviewUseCase.addUserReview(rating, comment, reviewerUserId, reviewedUserId, applicationId, postId);
        res.status(200).json({ status: 200, review: review });
    }
    async getReviewByPostId(req: Request, res: Response): Promise<void> {
        const { postId } = req.body;
        const review = await this.reviewUseCase.getPostReviewByPostId(postId);
        res.status(200).json({ status: 200, review: review });
    }
    async getReviewByUserId(req: Request, res: Response): Promise<void> {
        const { userId } = req.body;
        const review = await this.reviewUseCase.getUserReviewByUserId(userId);
        res.status(200).json({ status: 200, review: review });
    }
    async getReviewByTesterIds(req: Request, res: Response): Promise<void> {
        const { ids, appId } = req.body;
        const reviews = await this.reviewUseCase.getUserReviewByTesterIds(ids, appId);
        res.status(200).json({ status: 200, reviews: reviews });
    }
}