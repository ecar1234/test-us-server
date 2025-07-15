import { Post } from "../domain/entities/post";
import { PostRepository } from "../infrastructure/repositories/post_repo";

export class PostUseCase {
    constructor(private postRepository: PostRepository){}

    async createPost(title: string, subtitle: string, content: string, status: string = 'active', period: number = 7): Promise<Post> {
        const post = new Post(null, null,title, subtitle, content, status, period);
        return this.postRepository.createPost(post);
    }
    async updatePost(id: string, authorId: string, title: string, subtitle: string, content: string, status: string = 'active', period: number = 7): Promise<[Post | null, string]> {
        const post = new Post(id, authorId, title, subtitle, content, status, period);
        return this.postRepository.updatePost(post);
    }
    async deletePost(id: string): Promise<boolean> {
        return this.postRepository.deletePost(id);
    }
    async getPostById(id: string): Promise<[Post | null, string]> {
        return this.postRepository.getPostById(id);
    }
    async getPostByTitle(title: string): Promise<[Post | null, string]> {
        return this.postRepository.getPostByTitle(title);
    }
    async getAllPosts(): Promise<Post[]> {
        return this.postRepository.getAllPosts();
    }
    async getPostsByAuthor(authorId: string): Promise<Post[]> {
        const allPosts = await this.postRepository.getAllPosts();
        return allPosts.filter(post => post.authorId === authorId);
    }
}