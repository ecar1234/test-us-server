import { PostReviewModel } from "../domain/entities/PostReviewModel";
import { UserReviewRepositoryImpl } from "../infrastructure/repositories/UserReviewRepositoryImpl";
import { PostReviewRepositoryImpl } from "../infrastructure/repositories/PostReviewRepositoryImpl";
import { UserReviewModel } from "../domain/entities/UserReviewModel";

import { redisClient } from "../config/RedisConfig";
import { RecruitmentPostRepositoryImpl } from "../infrastructure/repositories/RecruitmentPostRepositoryImpl";


export class ReviewUseCase {
    constructor(
        private userReviewRepo: UserReviewRepositoryImpl,
        private postReviewRepo: PostReviewRepositoryImpl,
        private recruitRepo: RecruitmentPostRepositoryImpl
    ){}

    async addPromotionReview(rating: number, comments: string, type: string, reviewer: string, postId: string):Promise<PostReviewModel> {
        const postReviewModel = new PostReviewModel({
            reviewId: null,
            rating: rating,
            comment: comments,
            reviewType: type,
            reviewerUserId: reviewer,
            postId: postId
        });
        const review = await this.postReviewRepo.addPostReview(postReviewModel); // PostReviewRepo 사용

        // 리뷰가 추가된 게시물의 작성자 정보를 가져옵니다.
        const authorId = await this.recruitRepo.getPostAuthorId(postId);
        if (authorId) {
            await redisClient.del(`userPosts:${authorId}`);
        }
        return review;   
    }

    async addRecruitReview(rating: number, comments: string, type: string, reviewer: string, postId: string):Promise<PostReviewModel> {
        const postReviewModel = new PostReviewModel({
            reviewId: null,
            rating: rating,
            comment: comments,
            reviewType: type,
            reviewerUserId: reviewer,
            postId: postId
        });
        const review = await this.postReviewRepo.addPostReview(postReviewModel); // PostReviewRepo 사용

        // 리뷰가 추가된 게시물의 작성자 정보를 가져옵니다.
        const authorId = await this.recruitRepo.getPostAuthorId(postId);
        if (authorId) {
            await redisClient.del(`userPosts:${authorId}`);
        }
        return review; 
    }

    async addUserReview(rating: number, comments: string, reviewer: string, reviewed: string, applicationId: number, postId: string):Promise<UserReviewModel> {
        const userReviewModel = new UserReviewModel({
            reviewId: null,
            rating: rating,
            comment: comments,
            reviewerUserId: reviewer,
            reviewedUserId: reviewed,
            applicationId: applicationId,
        });
        const review = await this.userReviewRepo.addUserReview(userReviewModel); // UserReviewRepo 사용
        // console.log(review);
        return review; 
    }

   
    // 게시물 ID로 리뷰를 조회하는 것은 이제 PostReviewRepository에서 담당
    async getPostReviewByPostId(postId: string): Promise<PostReviewModel>{
        const reviews = await this.postReviewRepo.getPostReviewByPostId(postId);
        return reviews;
    }

    async getUserReviewByUserId(userId: string): Promise<UserReviewModel>{ // 메서드 이름 변경
        const reviews = await this.userReviewRepo.getReviewByUserId(userId); // UserReviewRepo 사용
        return reviews;
    }
    async getReviewsByUserId(userId: string): Promise<UserReviewModel[]>{
        const reviews = await this.userReviewRepo.getUserReviewsByUserId(userId);
        return reviews;
    }
    async getReviewByPostReviewId(reviewId: string): Promise<PostReviewModel>{
        const reviews = await this.postReviewRepo.getReviewByPostReviewId(reviewId);
        return reviews;
    }

    async getUserReviewByTesterIds(ids: string[], appId: number): Promise<UserReviewModel[]>{ // 메서드 이름 변경
        const reviews = await this.userReviewRepo.getReviewByTesterIds(ids, appId); // UserReviewRepo 사용
        return reviews;
    }
}