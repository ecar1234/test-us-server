import { AppDataSource } from "../../config/DataSource";
import { PostReviewModel } from "../../domain/entities/PostReviewModel";
import { IPostReviewRepository } from "../../domain/interface_repositories/IPostReview_repository";
import { PostReviewEntity, PostReviewType } from "../entities/PostReviewEntity";
import { BasePostEntity } from "../entities/BasePostEntity";
import { UserEntity } from "../entities/UserEntity";

export class PostReviewRepositoryImpl implements IPostReviewRepository {
    private postReviewDataSource = AppDataSource.getRepository(PostReviewEntity);

    public toDomainPostReview(reviewEntity: PostReviewEntity): PostReviewModel {
        return new PostReviewModel({
            reviewId: reviewEntity.reviewId,
            rating: reviewEntity.rating,
            comment: reviewEntity.comment,
            reviewType: reviewEntity.reviewType,
            createdAt: reviewEntity.createdAt,
            reviewerUserId: reviewEntity.reviewer.userId,
            postId: reviewEntity.post.postId
        });
    }

    public toEntityPostReview(postReviewModel: PostReviewModel): PostReviewEntity {
        const reviewType = postReviewModel.reviewType === 'PRODUCT_RATING' ? PostReviewType.PROMOTION_RATING : PostReviewType.RECRUIT_RATING; // Adjust as needed
        const reviewEntity: PostReviewEntity = this.postReviewDataSource.create({
            ...(postReviewModel.reviewId && { reviewId: postReviewModel.reviewId }),
            rating: postReviewModel.rating,
            comment: postReviewModel.comment,
            reviewType: reviewType,
            createdAt: postReviewModel.createdAt || new Date(),
            reviewer: { userId: postReviewModel.reviewerUserId } as UserEntity,
            post: { postId: postReviewModel.postId } as BasePostEntity,
        });
        return reviewEntity;
    }

    async addPostReview(review: PostReviewModel): Promise<PostReviewModel> {
        const entity = this.toEntityPostReview(review);
        const result = await this.postReviewDataSource.save(entity);
        return this.toDomainPostReview(result);
    }

    async getPostReviewByPostId(postId: string): Promise<PostReviewModel> {
        const review = await this.postReviewDataSource.findOne({
            where: { post: { postId: postId } },
            relations: ['reviewer', 'post']
        });

        if (review) {
            return this.toDomainPostReview(review);
        }
        throw new Error("Post Review not found");
    }
    // 필요하다면 다른 조회 메서드 추가
}