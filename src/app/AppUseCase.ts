import { parse } from "path";
import { ApplicationModel } from "../domain/entities/ApplicationModel";
import { PostModel } from "../domain/entities/PostModel";
import { ApplicationRepositoryImpl } from "../infrastructure/repositories/ApplicationRepositoryImpl";
import { PostRepositoryImpl } from "../infrastructure/repositories/PostRepositoryImpl";

export class AppUseCase {
    constructor(private applicationRepository: ApplicationRepositoryImpl, private postRepository: PostRepositoryImpl) {}

    async createApplication(userId: string, postId: string, platform: string, status: string = 'pending'): Promise<[ApplicationModel, PostModel]> {
        const result: [ApplicationModel, PostModel] = [null, null];
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

    async updateApplication(id: string, postId: string, userId: string, platform: string, status: string): Promise<[ApplicationModel, PostModel]> {
        const result: [ApplicationModel, PostModel] = [null, null];
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

    async cancelApplication(id: string): Promise<[ApplicationModel, PostModel]> {
        const result: [ApplicationModel, PostModel] = [null, null];
        const application = await this.applicationRepository.cancel( parseInt(id));
        if(application == null){
            throw new Error("application cancel failed");
        }
        const post = await this.postRepository.getPostById(application.postId);
        if(post != null){
            result[0] = application;
            result[1] = post;
        }
        // console.log(result);
        return result
    }

    async acceptUser(userId: string, postId: string): Promise<[ApplicationModel, PostModel]> {
        const application = await this.applicationRepository.acceptUser(userId, postId);
        if(application == null){
            throw new Error("application accept failed");
        }
        const post = await this.postRepository.getPostById(application.postId);
        if(post == null){
            throw new Error("post not found");
        }
        return [application, post];
        
    }

    async rejectUser(userId: string, postId: string): Promise<[ApplicationModel, PostModel]> {
        const  application = await this.applicationRepository.rejectUser(userId, postId);
        if(application == null){
            throw new Error("application reject failed");
        }
        const post = await this.postRepository.getPostById(application.postId);
        if(post == null){
            throw new Error("post not found");
        }
        return [application, post];
    }

    async findApplicationsByUserId(userId: string): Promise<ApplicationModel[]> {
        return this.applicationRepository.findApplicationsByUserId(userId);
    }

}