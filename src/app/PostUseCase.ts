import { PostModel } from "../domain/entities/PostModel";
import { PostRepositoryImpl } from "../infrastructure/repositories/PostRepositoryImpl";

export class PostUseCase {
    constructor(private postRepository: PostRepositoryImpl){}

    async createPost(title: string, subtitle: string, content: string, status: string = 'active', period: number = 7): Promise<PostModel> {
        const post = new PostModel(null, null,title, subtitle, content, status, period);
        return this.postRepository.createPost(post);
    }
    async updatePost(id: string, authorId: string, title: string, subtitle: string, content: string, status: string = 'active', period: number = 7): Promise<[PostModel | null, string]> {
        const post = new PostModel(id, authorId, title, subtitle, content, status, period);
        return this.postRepository.updatePost(post);
    }
    async deletePost(id: string): Promise<boolean> {
        return this.postRepository.deletePost(id);
    }
    async getPostById(id: string): Promise<[PostModel | null, string]> {
        return this.postRepository.getPostById(id);
    }
    async getPostByTitle(title: string): Promise<[PostModel | null, string]> {
        return this.postRepository.getPostByTitle(title);
    }
    async getAllPosts(): Promise<PostModel[]> {
        return this.postRepository.getAllPosts();
    }
    async getPostsByAuthor(authorId: string): Promise<PostModel[]> {
        const allPosts = await this.postRepository.getAllPosts();
        return allPosts.filter(post => post.authorId === authorId);
    }
}