import { PostReviewModel } from "../entities/PostReviewModel.js";

export interface IPostReviewRepository {
    addPostReview(review: PostReviewModel): Promise<PostReviewModel>;
    getPostReviewByPostId(postId: string): Promise<PostReviewModel>;
    // 필요하다면 다른 조회 메서드 추가
    getReviewByPostReviewId(reviewId: string): Promise<PostReviewModel>;

}