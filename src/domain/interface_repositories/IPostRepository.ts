import { Post } from "../entities/post";

export interface IPostRepository {
    createPost(post:Post): Promise<Post>;
    updatePost(post:Post): Promise<[Post, string]>;
    deletePost(id: string): Promise<boolean>;
    getPostById(id: string): Promise<[Post | null, string]>;
    getPostByTitle(title: string): Promise<[Post | null, string]>;
    getAllPosts(): Promise<Post[]>;
}