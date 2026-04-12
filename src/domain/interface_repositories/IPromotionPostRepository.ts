import { PromotionPostModel } from "../entities/PromotionPostModel.js";

export interface IPromotionPostRepository {
    createPost(post: PromotionPostModel): Promise<PromotionPostModel>;
        updatePost(post: PromotionPostModel): Promise<PromotionPostModel>;
        deletePost(id: string): Promise<boolean>;
        getPostById(id: string): Promise<PromotionPostModel>;
        getUserPromotionPosts(userId: string): Promise<PromotionPostModel[]>;
        getPostByTitle(title: string): Promise<PromotionPostModel>;
        getPostsByAuthor(authorId: string): Promise<PromotionPostModel[]>;
        getPostsPaginations(page: number): Promise<PromotionPostModel[]>;
        searchPosts(keyword: string): Promise<PromotionPostModel[]>;
}