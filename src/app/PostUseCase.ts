import { PromotionPostModel } from "../domain/entities/PromotionPostModel";
import { RecruitmentPostModel } from "../domain/entities/RecruitmentPostModel";
import { UserEntity } from "../infrastructure/entities/UserEntity";
import { PostRepositoryImpl } from "../infrastructure/repositories/PostRepositoryImpl";
import { PromotionPostRepositoryImpl } from "../infrastructure/repositories/PromotionPostRepositoryImpl";
import { RecruitmentPostRepositoryImpl } from "../infrastructure/repositories/RecruitmentPostRepositoryImpl";

export class PostUseCase {
    constructor(
        private postRepo: PostRepositoryImpl,
        private recruitRepo: RecruitmentPostRepositoryImpl,
        private promotionRepo: PromotionPostRepositoryImpl
    ) { }

    async getInitPosts(): Promise<[ (RecruitmentPostModel | PromotionPostModel | PromotionPostModel)[], RecruitmentPostModel[], PromotionPostModel[] ]> {
        const favoritePosts = await this.postRepo.getFavoritePosts();
        const recriutPosts = await this.recruitRepo.getPostsPaginations(1);
        const promotionPosts = await this.promotionRepo.getPostsPaginations(1);
        // const promotionPosts = await this.promotionRepo.getPostsPaginations(1);

        return [favoritePosts, recriutPosts, promotionPosts];
    }
   // Recruitment
        async createRecruitPost(author: UserEntity, title: string, subtitle: string, platform: string[], contents: string, images: object[], status: string = 'active', period: number = 7): Promise<RecruitmentPostModel> {
        const post = new RecruitmentPostModel(null, author.userId, title, subtitle, platform, contents, status, period, 0, images);
        return this.recruitRepo.createPost(post);
    }
    async updateRecruitPost(id: string, author: UserEntity, title: string, subtitle: string, platform: string[], contents: string, status: string = 'active'): Promise<RecruitmentPostModel> {
        const post = new RecruitmentPostModel(id, author.userId, title, subtitle, platform, contents, status);
        return this.recruitRepo.updatePost(post);
    }
    async deleteRecruitPost(id: string): Promise<boolean> {
        return this.recruitRepo.deletePost(id);
    }
    async getRecruitPostById(id: string): Promise<RecruitmentPostModel> {
        return this.recruitRepo.getPostById(id);
    }
    async getUserRecuritmentPosts(userId: string): Promise<RecruitmentPostModel[]> {
        // 이제 Repository에서 모든 변환을 처리하므로, UseCase는 간단히 데이터를 요청하기만 하면 됩니다.
        return this.recruitRepo.getUserRecuritmentPosts(userId);
    }
    async getRecruitPostByTitle(title: string): Promise<RecruitmentPostModel> {
        return this.recruitRepo.getPostByTitle(title);
    }
    async getRecruitPostPagination(page: number): Promise<RecruitmentPostModel[]> {

        const posts = await this.recruitRepo.getPostsPaginations(page);
        // console.log(posts);
        return posts;
    }
    async getRecruitPostsByAuthor(authorId: string): Promise<RecruitmentPostModel[]> {
        return this.recruitRepo.getPostsByAuthor(authorId);
    }
    // async getPostsByNickname(nickname: string): Promise<PostModel[]> {
    //    return this.postRepository.getPostsByNickname(nickname);
    // }

    // Promotion
    async createPromotionPost(author: UserEntity, title: string, subtitle: string, platform: string[], contents: string, images: object[], domain: string[], status: string = 'active', period: number = 7): Promise<PromotionPostModel> {
        const post = new PromotionPostModel(null, author.userId, title, subtitle, platform, contents, status, period, 0, images, domain);
        return this.promotionRepo.createPost(post);
    }
    async updatePromotionPost(id: string, author: UserEntity, title: string, subtitle: string, platform: string[], contents: string, domain: string[], status: string = 'active'): Promise<PromotionPostModel> {
        const post = new PromotionPostModel(id, author.userId, title, subtitle, platform, contents, status, undefined, undefined, undefined, domain);
        return this.promotionRepo.updatePost(post);
    }
    async deletePromotionPost(id: string): Promise<boolean> {
        return this.promotionRepo.deletePost(id);
    }
    async getPromotionPostById(id: string): Promise<PromotionPostModel> {
        return this.promotionRepo.getPostById(id);
    }
    async getUserPromotionPosts(userId: string): Promise<PromotionPostModel[]> {
        return this.promotionRepo.getUserPromotionPosts(userId);
    }
    async getPromotionPostByTitle(title: string): Promise<PromotionPostModel> {
        return this.promotionRepo.getPostByTitle(title);
    }
    async getPromotionPostPagination(page: number): Promise<PromotionPostModel[]> {
        return this.promotionRepo.getPostsPaginations(page);
    }
    async getPromotionPostsByAuthor(authorId: string): Promise<PromotionPostModel[]> {
        return this.promotionRepo.getPostsByAuthor(authorId);
    }
}