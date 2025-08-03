import { PostModel } from "../domain/entities/PostModel";
import { PostRepositoryImpl } from "../infrastructure/repositories/PostRepositoryImpl";

export class PostUseCase {
    constructor(private postRepository: PostRepositoryImpl){}

    async createPost(authorId: string, title: string, subtitle: string, platform: string[], contents: string, status: string = 'active', period: number = 7): Promise<PostModel> {
        const post = new PostModel(null, authorId, title, subtitle, platform, contents, status, period);
        return this.postRepository.createPost(post);
    }
    async updatePost(id: string, authorId: string, title: string, subtitle: string, platform: string[], contents: string, status: string = 'active'): Promise<PostModel> {
        const post = new PostModel(id, authorId, title, subtitle, platform, contents, status);
        return this.postRepository.updatePost(post);
    }
    async deletePost(id: string): Promise<boolean> {
        return this.postRepository.deletePost(id);
    }
    async getPostById(id: string): Promise<PostModel> {
        return this.postRepository.getPostById(id);
    }
    async getPostByTitle(title: string): Promise<PostModel> {
        return this.postRepository.getPostByTitle(title);
    }
    async getAllPosts(): Promise<PostModel[]> {
        return this.postRepository.getAllPosts();
    }
    async getPostsByAuthor(authorId: string): Promise<PostModel[]> {
       return this.postRepository.getPostsByAuthor(authorId);
    }
    // async getPostsByNickname(nickname: string): Promise<PostModel[]> {
    //    return this.postRepository.getPostsByNickname(nickname);
    // }
}