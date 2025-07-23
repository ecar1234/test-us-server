import { PostModel } from "../entities/PostModel";

export interface IPostRepository {
    createPost(post:PostModel): Promise<PostModel>;
    updatePost(post:PostModel): Promise<[PostModel, string]>;
    deletePost(id: string): Promise<boolean>;
    getPostById(id: string): Promise<[PostModel | null, string]>;
    getPostByTitle(title: string): Promise<[PostModel | null, string]>;
    getAllPosts(): Promise<PostModel[]>;
    // 닉네임으로 찾기, 게시물의 속한 리뷰 보기 추가가 필요해 보임
}