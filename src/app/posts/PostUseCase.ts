import { PromotionPostModel } from "../../domain/entities/PromotionPostModel.js";
import { RecruitmentPostModel } from "../../domain/entities/RecruitmentPostModel.js";
import { PostRepositoryImpl } from "../../infrastructure/repositories/PostRepositoryImpl.js";
import { PromotionPostRepositoryImpl } from "../../infrastructure/repositories/PromotionPostRepositoryImpl.js";
import { RecruitmentPostRepositoryImpl } from "../../infrastructure/repositories/RecruitmentPostRepositoryImpl.js";
import { FirebaseRepositoryImpl } from "../../infrastructure/repositories/FirebaseRepositoryImpl.js";
import { ApplicationRepositoryImpl } from "../../infrastructure/repositories/ApplicationRepositoryImpl.js";
import { UserRepositoryImpl } from "../../infrastructure/repositories/UserRepositoryImpl.js";



export class PostUseCase {
    constructor(
        private userRepo: UserRepositoryImpl,
        private postRepo: PostRepositoryImpl,
        private recruitRepo: RecruitmentPostRepositoryImpl,
        private promotionRepo: PromotionPostRepositoryImpl,
        private fireRepository: FirebaseRepositoryImpl,
        private applicationRepo: ApplicationRepositoryImpl,
    ) { }

    async getInitPosts(): Promise<[(RecruitmentPostModel | PromotionPostModel | PromotionPostModel)[], RecruitmentPostModel[], PromotionPostModel[]]> {
        const favoritePosts = await this.postRepo.getFavoritePosts();
        const recriutPosts = await this.recruitRepo.getPostsPaginations(1);
        const promotionPosts = await this.promotionRepo.getPostsPaginations(1);
        // const promotionPosts = await this.promotionRepo.getPostsPaginations(1);
        return [favoritePosts, recriutPosts, promotionPosts];
    }

    async getInitUserPosts(userId: string): Promise<[RecruitmentPostModel[], PromotionPostModel[]]> {
        const recruitPosts = await this.recruitRepo.getUserRecuritmentPosts(userId);
        const promotionPosts = await this.promotionRepo.getUserPromotionPosts(userId);
        // console.log(recruitPosts);
        return [recruitPosts, promotionPosts];
    }
    async searchPosts(keyword: string): Promise<[RecruitmentPostModel[], PromotionPostModel[]]> {
        const recruitPosts = await this.recruitRepo.searchPosts(keyword);
        const promotionPosts = await this.promotionRepo.searchPosts(keyword);
        return [recruitPosts, promotionPosts];
    }
}