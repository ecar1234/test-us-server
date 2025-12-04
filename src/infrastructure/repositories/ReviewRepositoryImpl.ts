import { AppDataSource } from "../../config/DataSource";
import { ApplicationModel } from "../../domain/entities/ApplicationModel";
import { UserModel } from "../../domain/entities/UserModel";
import { IUserReviewRepository } from "../../domain/interface_repositories/IUserReview_repository";
import { ApplicationEntity } from "../entities/ApplicationEntity";
import { UserEntity } from "../entities/UserEntity";
import { UserReviewEntity, ReviewType } from "../entities/UserReviewEntiry";
import { In } from "typeorm";
import { BasePostEntity } from "../entities/BasePostEntity";
import { UserReviewModel } from "../../domain/entities/UserReviewModel";


// export class UserReviewRepositoryImpl implements IUserReviewRepository {
//     private reviewDataSource = AppDataSource.getRepository(UserReviewEntity);
//     public toDomainReview(reviewEntity: UserReviewEntity): UserReviewModel {
//         // UserReviewModel constructor expects IDs, not full model objects.
//         // Ensure relations are loaded when calling this method.
//         return new UserReviewModel({
//             reviewId: reviewEntity.reviewId,
//             rating: reviewEntity.rating,
//             comment: reviewEntity.comment,
//             reviewType: reviewEntity.reviewType,
//             createdAt: reviewEntity.createdAt,
//             applicationId: reviewEntity.application.appId,
//             reviewerUserId: reviewEntity.reviewer.userId,
//             reviewedUserId: reviewEntity.reviewed.userId,
//             // postId: reviewEntity.application.post.postId // postId는 Application을 통해 접근
//         });
//     }
//     public toEntityReview(reviewModel: UserReviewModel): UserReviewEntity {
//         const reviewType = reviewModel.reviewType === 'PRODUCT_RATING' ? ReviewType.PRODUCT_RATING : ReviewType.PARTICIPANT_ATTITUDE_RATING;
//         const reviewEntity: UserReviewEntity = this.reviewDataSource.create({
//             ...(reviewModel.reviewId && { reviewId: reviewModel.reviewId }),
//             rating: reviewModel.rating,
//             comment: reviewModel.comment,
//             reviewType: reviewType,
//             createdAt: reviewModel.createdAt || new Date(),
//             application: { appId: reviewModel.applicationId },
//             reviewer: { userId: reviewModel.reviewerUserId },
//             reviewed: { userId: reviewModel.reviewedUserId },
//         });
//         return reviewEntity;
//     }

//     // async addPromotionReview(review: UserReviewModel): Promise<UserReviewModel> {
//     //     const entity = this.toEntityReview(review);
//     //     const result = await this.reviewDataSource.save(entity);
//     //     return this.toDomainReview(result);
//     // }
//     // async addRecruitReview(review: UserReviewModel): Promise<UserReviewModel> {
//     //     const entity = this.toEntityReview(review);
//     //     const result = await this.reviewDataSource.save(entity);
//     //     return this.toDomainReview(result);
//     // }
//     async addUserReview(review: UserReviewModel): Promise<UserReviewModel> {
//         const entity = this.toEntityReview(review);
//         const result = await this.reviewDataSource.save(entity);
//         return this.toDomainReview(result);
//     }
//     // async getReviewByPostId(postId: string): Promise<UserReviewModel> {
//     //     const review = await this.reviewDataSource.findOne({
//     //         where: {application: {post: {postId: postId}}}, 
//     //         relations: ['application', 'application.post', 'reviewer', 'reviewed']
//     //     });

//     //     if(review){
//     //         return this.toDomainReview(review);
//     //     }
//     //     throw new Error("Review not found");
//     // }
//     async getReviewByUserId(userId: string): Promise<UserReviewModel> {
//         const review = await this.reviewDataSource.findOne({
//             where: {reviewer: {userId: userId}},
//             relations: ['application', 'application.post', 'reviewer', 'reviewed']
//         });

//         if(review){
//             return this.toDomainReview(review);
//         }
//         throw new Error("Review not found");
//     }
//     async getReviewByTesterIds(ids: string[], postId: string): Promise<UserReviewModel[]> {
//         const reviews = await this.reviewDataSource.find({
//             where: {reviewed: {userId: In(ids)}, application: {post: {postId: postId}}}, 
//             relations: ['application', 'application.post', 'reviewer', 'reviewed']
//         });

//         if(reviews){
//             return reviews.map(review => this.toDomainReview(review));
//         }
//         throw new Error("Review not found");
//     }    
// }