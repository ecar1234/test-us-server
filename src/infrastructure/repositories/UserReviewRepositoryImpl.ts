import { AppDataSource } from "../../config/DataSource";
import { In, IsNull } from "typeorm";
import { IUserReviewRepository } from "../../domain/interface_repositories/IUserReview_repository";
import { UserReviewModel } from "../../domain/entities/UserReviewModel";
import { UserReviewEntity } from "../entities/UserReviewEntiry";


export class UserReviewRepositoryImpl implements IUserReviewRepository {
  
    private userReviewDataSource = AppDataSource.getRepository(UserReviewEntity);

    public toDomainUserReview(reviewEntity: UserReviewEntity): UserReviewModel {
        return new UserReviewModel({
            reviewId: reviewEntity.reviewId,
            rating: reviewEntity.rating,
            comment: reviewEntity.comment,
            createdAt: reviewEntity.createdAt,
            applicationId: reviewEntity.application.appId,
            reviewerUserId: reviewEntity.reviewer.userId,
            reviewedUserId: reviewEntity.reviewed.userId,
            postId: reviewEntity.application.post?.postId
        });
    }
    public toEntityUserReview(userReviewModel: UserReviewModel): UserReviewEntity {
        const reviewEntity: UserReviewEntity = this.userReviewDataSource.create({
            ...(userReviewModel.reviewId && { reviewId: userReviewModel.reviewId }),
            rating: userReviewModel.rating,
            comment: userReviewModel.comment,
            application: { appId: userReviewModel.applicationId },
            reviewer: { userId: userReviewModel.reviewerUserId },
            reviewed: { userId: userReviewModel.reviewedUserId },
            createdAt: userReviewModel.createdAt ? userReviewModel.createdAt : new Date(),
        });
        return reviewEntity;
    }

    async addUserReview(review: UserReviewModel): Promise<UserReviewModel> {
        // console.log(review);
        const entity = this.toEntityUserReview(review);
        const savedEntity = await this.userReviewDataSource.save(entity);
        const newReview = await this.userReviewDataSource.findOne({
            where: { reviewId: savedEntity.reviewId },
            relations: ['application', 'application.post', 'reviewer', 'reviewed'],
        });
        if (!newReview) throw new Error('Failed to retrieve the review after saving.');
        // console.log(newReview);
        return this.toDomainUserReview(newReview);
    }
    async getUserReviewsByUserId(userId: string): Promise<UserReviewModel[]> {
        const reviews = await this.userReviewDataSource.find({
            where: {reviewed: {userId: userId}},
            relations: ['application', 'application.post', 'reviewer', 'reviewed']
        });
        
        if(!reviews) return [];

        return reviews.map(review => this.toDomainUserReview(review));
    }

    async getReviewByUserId(userId: string): Promise<UserReviewModel> {
        const review = await this.userReviewDataSource.findOne({
            where: { reviewer: { userId: userId } },
            relations: ['application', 'application.post', 'reviewer', 'reviewed']
        });
        if (!review) throw new Error("Review not found");
        return this.toDomainUserReview(review);
    }
    async getReviewByTesterIds(ids: string[], appId: number): Promise<UserReviewModel[]> { // 타입 변경
        const reviews = await this.userReviewDataSource.find({ // DataSource 변경
            where: { reviewed: { userId: In(ids) }, application: { appId: appId } },
            relations: ['application', 'application.post', 'reviewer', 'reviewed'] // application.post 관계 유지
        });

        if (!reviews.length) return [];

        return reviews.map(review => this.toDomainUserReview(review));
    }

    async getReviewsByApplicationIds(appIds: number[]): Promise<UserReviewModel[]> {
        const reviews = await this.userReviewDataSource.find({
            where: { application: { appId: In(appIds) } },
            relations: ['application', 'application.post', 'reviewer', 'reviewed']
        });

        return reviews.map(review => this.toDomainUserReview(review));
    }
    
}