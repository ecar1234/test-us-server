import { ApplicationModel } from "../domain/entities/ApplicationModel";
import { PostModel } from "../domain/entities/PostModel";
import { UserEntity } from "../infrastructure/entities/UserEntity";
import { ApplicationRepositoryImpl } from "../infrastructure/repositories/ApplicationRepositoryImpl";
import { PostRepositoryImpl } from "../infrastructure/repositories/PostRepositoryImpl";
import { UserRepositoryImpl } from "../infrastructure/repositories/UserRepositoryImpl";

export class PostUseCase {
    constructor(private postRepository: PostRepositoryImpl, private userRepository: UserRepositoryImpl, private applicationRepository: ApplicationRepositoryImpl) { }

    async createPost(author: UserEntity, title: string, subtitle: string, platform: string[], contents: string, images: object[], status: string = 'active', period: number = 7): Promise<PostModel> {
        const post = new PostModel(null, author.userId, title, subtitle, platform, contents, status, period, 0, images);
        return this.postRepository.createPost(post);
    }
    async updatePost(id: string, author: UserEntity, title: string, subtitle: string, platform: string[], contents: string, status: string = 'active'): Promise<PostModel> {
        const post = new PostModel(id, author.userId, title, subtitle, platform, contents, status);
        return this.postRepository.updatePost(post);
    }
    async deletePost(id: string): Promise<boolean> {
        return this.postRepository.deletePost(id);
    }
    async getPostById(id: string): Promise<PostModel> {
        return this.postRepository.getPostById(id);
    }
    async getUserRecuritmentPosts(userId: string): Promise<PostModel[]> {
        // 이제 Repository에서 모든 변환을 처리하므로, UseCase는 간단히 데이터를 요청하기만 하면 됩니다.
        return this.postRepository.getUserRecuritmentPosts(userId);
    }
    async getPostByTitle(title: string): Promise<PostModel> {
        return this.postRepository.getPostByTitle(title);
    }
    // async getAllPosts(): Promise<PostModel[]> {
    //     return this.postRepository.getAllPosts();
    // }
    async getInitPosts(): Promise<PostModel[][]> {
        // const webPosts = await this.postRepository.getWebPostsPaginations(1);
        // const mobilePosts = await this.postRepository.getMobilePostsPaginations(1);
        const posts = await this.postRepository.getPostsPaginations(1);
        const favoritePosts = await this.postRepository.getFavoritePostsPaginations(1);
        console.log([favoritePosts, posts]);
        return [favoritePosts, posts];
    }
    // async getWebPostsPaginations(page: number): Promise<PostModel[]> {
    //     return await this.postRepository.getWebPostsPaginations(page);
    // }
    // async getMobilePostsPaginations(page: number): Promise<PostModel[]> {
    //     return await this.postRepository.getMobilePostsPaginations(page);
    // }
    async getFavoritePostsPaginations(page: number): Promise<PostModel[]> {
        return await this.postRepository.getFavoritePostsPaginations(page);
    }
    async getPostsPaginations(page: number):Promise<PostModel[]>{

        const posts = await this.postRepository.getPostsPaginations(page);
        // console.log(posts);
        return posts;
    }
    async getPostsByAuthor(authorId: string): Promise<PostModel[]> {
        return this.postRepository.getPostsByAuthor(authorId);
    }
    // async getPostsByNickname(nickname: string): Promise<PostModel[]> {
    //    return this.postRepository.getPostsByNickname(nickname);
    // }
}