import { parse } from "path";
import { ApplicationModel } from "../domain/entities/ApplicationModel";
import { RecruitmentPostModel } from "../domain/entities/RecruitmentPostModel";
import { ApplicationRepositoryImpl } from "../infrastructure/repositories/ApplicationRepositoryImpl";
import { RecruitmentPostRepositoryImpl } from "../infrastructure/repositories/RecruitmentPostRepositoryImpl";
import { redisClient } from "../config/RedisConfig";

export class AppUseCase {
    constructor(private applicationRepository: ApplicationRepositoryImpl, private postRepository: RecruitmentPostRepositoryImpl) {}

    async createApplication(userId: string, postId: string, platform: string, status: string = 'pending'): Promise<[ApplicationModel, RecruitmentPostModel]> {
        const result: [ApplicationModel, RecruitmentPostModel] = [null, null];
        const application = new ApplicationModel(null, platform, status, null, null, postId, userId);
        const appResult = await this.applicationRepository.create(application);
        if(appResult == null){
            // console.log(appResult)
            throw new Error("application create failed");
        }
        const post = await this.postRepository.getPostById(appResult.postId);
        
        if(post != null){
            result[0] = appResult;
            result[1] = post;
        }
        // console.log(result)
        
        return result;
    }

    async updateApplication(id: string, postId: string, userId: string, platform: string, status: string): Promise<[ApplicationModel, RecruitmentPostModel]> {
        const result: [ApplicationModel, RecruitmentPostModel] = [null, null];
        const application = new ApplicationModel(parseInt(id), platform, status, null, null, postId, userId);
        // console.log(application);
        const appResult = await this.applicationRepository.update(application);
        if(appResult == null){
            throw new Error("application update failed");
        }
        const post = await this.postRepository.getPostById(appResult.postId);
        if(post != null){
            result[0] = appResult;
            result[1] = post;
        }
        console.log('use case result', result);
        return result
    }

    async cancelApplication(id: string): Promise<[ApplicationModel, RecruitmentPostModel]> {
        const result: [ApplicationModel, RecruitmentPostModel] = [null, null];
        const application = await this.applicationRepository.cancel( parseInt(id));
        if(application == null){
            throw new Error("application cancel failed");
        }
        const post = await this.postRepository.getPostById(application.postId);
        if(post != null){
            result[0] = application;
            result[1] = post;

            // 캐시 무효화: 게시물 작성자의 게시물 목록 캐시를 삭제합니다.
            if (typeof post.author === 'object' && post.author !== null && 'userId' in post.author) {
                const authorId = post.author.userId;
                await redisClient.del(`userPosts:${authorId}`);
            }
        }
        // console.log(result);
        return result
    }

    async acceptUser(userId: string, postId: string): Promise<[ApplicationModel, RecruitmentPostModel]> {
        const application = await this.applicationRepository.acceptUser(userId, postId);
        if(application == null){
            throw new Error("application accept failed");
        }
        const post = await this.postRepository.getPostById(postId);
        if(post == null){
            throw new Error("post not found");
        }

        // 캐시 무효화: 게시물 작성자의 게시물 목록 캐시를 삭제합니다.
        if (typeof post.author === 'object' && post.author !== null && 'userId' in post.author) {
            const authorId = post.author.userId;
            await redisClient.del(`userPosts:${authorId}`);
        }
        return [application, post];
        
    }

    async rejectUser(userId: string, postId: string): Promise<[ApplicationModel, RecruitmentPostModel]> {
        const  application = await this.applicationRepository.rejectUser(userId, postId);
        if(application == null){
            throw new Error("application reject failed");
        }
        const post = await this.postRepository.getPostById(application.postId);
        if(post == null){
            throw new Error("post not found");
        }

        // 캐시 무효화: 게시물 작성자의 게시물 목록 캐시를 삭제합니다.
        if (typeof post.author === 'object' && post.author !== null && 'userId' in post.author) {
            const authorId = post.author.userId;
            await redisClient.del(`userPosts:${authorId}`);
        }
        return [application, post];
    }

    async findApplicationsByUserId(userId: string): Promise<ApplicationModel[]> {
        return this.applicationRepository.findApplicationsByUserId(userId);
    }

}