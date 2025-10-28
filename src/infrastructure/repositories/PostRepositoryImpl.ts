import { MoreThan } from "typeorm";
import { AppDataSource } from "../../config/DataSource";
import { redisClient } from "../../config/RedisConfig";
import { PromotionPostModel } from "../../domain/entities/PromotionPostModel";
import { RecruitmentPostModel } from "../../domain/entities/RecruitmentPostModel";
import { BasePostEntity } from "../entities/BasePostEntity";
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
        if (cachedData) {
            // 캐시된 데이터는 이미 도메인 모델이므로 바로 파싱하여 반환
            return JSON.parse(cachedData);
        }

        const favoritePostEntities = await this.baseRepo.find({
            relations: ['author'],
            where: { views: MoreThan(50),  },
            order: { views: 'DESC' },
            take: 10
        });

        const favoritePostsPromises = favoritePostEntities.map(async post => {
            if (post instanceof RecruitmentPostEntity) {
                const domainPost = this.recruitmentRepo.toDomainPost(post);
                domainPost.images = await this.recruitmentRepo.imagesRepository.getImagesByPostId(post.postId);
                return domainPost;
            } else if (post instanceof PromotionPostEntity) {
                const domainPost = this.promotionRepo.toDomain(post);
                domainPost.images = await this.promotionRepo.imagesRepository.getImagesByPostId(post.postId);
                return domainPost;
            }
            return null;
        });

        const favoritePosts = (await Promise.all(favoritePostsPromises))
            .filter((p): p is RecruitmentPostModel | PromotionPostModel => p !== null);

        await redisClient.set(cachedKey, JSON.stringify(favoritePosts), 'EX', 60 * 10);
        return favoritePosts;
    }
}