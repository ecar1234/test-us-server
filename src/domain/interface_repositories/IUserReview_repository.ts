import { UserReviewModel } from '../entities/UserReviewModel';

export interface IUserReviewRepository {
    // addPromotionReview(review: ReviewModel):Promise<ReviewModel> 
    // addRecruitReview(review: ReviewModel):Promise<ReviewModel> 
    addUserReview(review: UserReviewModel):Promise<UserReviewModel> 
    // getReviewByPostId(postId: string): Promise<ReviewModel>
    getReviewByUserId(userId: string): Promise<UserReviewModel>
    getReviewByTesterIds(ids: string[], appId: number): Promise<UserReviewModel[]>
}