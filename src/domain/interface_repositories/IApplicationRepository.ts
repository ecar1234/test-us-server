import { ApplicationModel } from "../entities/ApplicationModel";
import { PostModel } from "../entities/PostModel";

export interface IApplicationRepository {
    findByPostId(postId: string): Promise<ApplicationModel[]>;
    findByUserId(userId: string): Promise<ApplicationModel[]>;
    findByUserNickname(nickname: string): Promise<ApplicationModel[]>;
    findPostListByUserId(userId: string): Promise<PostModel[]>;
    create(application: ApplicationModel): Promise<ApplicationModel>;
    update(application: ApplicationModel): Promise<ApplicationModel>;
    delete(id: string): Promise<boolean>;
    acceptUser(userId: string, postId: string): Promise<ApplicationModel>;
    rejectUser(userId: string, postId: string): Promise<ApplicationModel>;
    countByPostId(postId: string): Promise<number>;
    findByPostIdAndUserIdAndStatus(postId: string, userId: string, status: string): Promise<ApplicationModel | null>;
    
    findByPostIdWithPagination(
        postId: string,
        page: number,
        limit: number
    ): Promise<{ applications: ApplicationModel[]; total: number }>;
}