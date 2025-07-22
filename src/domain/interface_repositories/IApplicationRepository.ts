import { Application } from "../entities/application";
import { Post } from "../entities/post";

export interface IApplicationRepository {
    findByPostId(postId: string): Promise<Application[]>;
    findByUserId(userId: string): Promise<Application[]>;
    findByUserNickname(nickname: string): Promise<Application[]>;
    findPostListByUserId(userId: string): Promise<Post[]>;
    create(application: Application): Promise<Application>;
    update(application: Application): Promise<Application>;
    delete(id: string): Promise<boolean>;
    acceptUser(userId: string, postId: string): Promise<Application>;
    rejectUser(userId: string, postId: string): Promise<Application>;
    countByPostId(postId: string): Promise<number>;
    findByPostIdAndUserIdAndStatus(postId: string, userId: string, status: string): Promise<Application | null>;
    
    findByPostIdWithPagination(
        postId: string,
        page: number,
        limit: number
    ): Promise<{ applications: Application[]; total: number }>;
}