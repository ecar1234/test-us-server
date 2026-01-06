import { MoreThan } from "typeorm";
import { AppDataSource } from "../../config/DataSource";
import { redisClient } from "../../config/RedisConfig";
import { PromotionPostModel } from "../../domain/entities/PromotionPostModel";
import { RecruitmentPostModel } from "../../domain/entities/RecruitmentPostModel";
import { BasePostEntity, BasePostStateType } from "../entities/BasePostEntity";
import { PromotionPostEntity } from "../entities/PromotionPostEntity";
import { RecruitmentPostEntity } from "../entities/RecruitmentPostEntity";
import { PromotionPostRepositoryImpl } from "./PromotionPostRepositoryImpl";
import { RecruitmentPostRepositoryImpl } from "./RecruitmentPostRepositoryImpl";
import { IPostRepository } from "../../domain/interface_repositories/IPostRepository";

export class PostRepositoryImpl implements IPostRepository {
    private baseRepo = AppDataSource.getRepository(BasePostEntity);

    // 각 전문 리포지토리를 사용하여 도메인 모델로 변환
    private recruitmentRepo = new RecruitmentPostRepositoryImpl();
    private promotionRepo = new PromotionPostRepositoryImpl();

    async getFavoritePosts(): Promise<(RecruitmentPostModel | PromotionPostModel)[]> {
        const cachedKey = `favoritePosts`;
        const cachedData = await redisClient.get(cachedKey);
        if (cachedData && cachedData.length > 0) {
            try {
                return JSON.parse(cachedData);
            } catch (error) {
                await redisClient.del(cachedKey);
            }
        }

        const favoritePostEntities = await this.baseRepo.find({
            relations: ['author'],
            where: { views: MoreThan(50) , status: BasePostStateType.ACTIVE},
            order: { views: 'DESC' },
            take: 10
        });

        const favoritePostsPromises = favoritePostEntities.map(async post => {
            if (post instanceof RecruitmentPostEntity) {
                return this.recruitmentRepo.toDomainPost(post);
            } else if (post instanceof PromotionPostEntity) {
                return this.promotionRepo.toDomain(post);
            }
            return null;
        });

        const favoritePosts = (await Promise.all(favoritePostsPromises))
            .filter((p): p is RecruitmentPostModel | PromotionPostModel => p !== null);

        await redisClient.set(cachedKey, JSON.stringify(favoritePosts), 'EX', 60 * 10);
        return favoritePosts;
    }
}