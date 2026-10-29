import { SideProjectPostModel } from "../../domain/entities/SideProject/SideProjectPostModel.js";
import { UserModel } from "../../domain/entities/UserModel.js";
import { TResSideProjectApplications } from "../../infrastructure/entities/package/SideProjectPackage.js";
import { ApplicationRepositoryImpl } from "../../infrastructure/repositories/ApplicationRepositoryImpl.js";
import { SideProjectPostRepositoryImpl } from "../../infrastructure/repositories/SideProjectPostRepositoryImpl.js";
import { UserRepositoryImpl } from "../../infrastructure/repositories/UserRepositoryImpl.js";


export class SideProjectUseCase {
    constructor(
        private sideRepo: SideProjectPostRepositoryImpl,
        private userRepo: UserRepositoryImpl,
        private appRepo: ApplicationRepositoryImpl
    ) { }

    /** create, update */
    async upsertSideProjectPost(post: SideProjectPostModel): Promise<SideProjectPostModel> {
        const result = await this.sideRepo.upsert(post);
        return result;
    }

    /** end, expired, delete */
    async updateSideProjectPost(postId: string, state: string): Promise<SideProjectPostModel>{
        const result = await this.sideRepo.update(postId, state);
        return result;
    }

    async getSideProjectPostByPostId(postId: string): Promise<SideProjectPostModel> {
        const result = await this.sideRepo.getProjectPostByPostId(postId);
        return result;
    }

    /** 나의 포스트 목록 가져오기 */
    async getSideProjectPostsByUserId(userId: string): Promise<SideProjectPostModel[]> {
        const result = await this.sideRepo.getProjectPostsByUserId(userId);
        return result ? result : [];
    }

    /** title로 포스트 가져오기 */
    // async getSideProjectPostByTitle(title: string): Promise<SideProjectPostModel> {
    //     return SideProjectPostModel;
    // }

    /** 포스트 목록 가져오기 */
    async getSideProjectPostPagination(pageCount: number): Promise<SideProjectPostModel[]> {
        const result = await this.sideRepo.getPostsPagination(pageCount);
        return result ? result : [];
    }

    /** 나의 포스트에 신청한 유저 목록 가져오기 */
    
    async getSideProjectAppUsers(postId: string): Promise<TResSideProjectApplications[]> {
        const result = await this.sideRepo.getProjectApplicantsByPostId(postId);
        if(!result){
            return [];
        }

        return [];
    }

    /** 내가 신청한 포스트 목록 가져오기 */
    // async getUserApplicationSideProjectPosts(userId: string): Promise<SideProjectPostModel[]> {
    //     const result = await this.appRepo.
    //     return result ? result : [];
    // }
}