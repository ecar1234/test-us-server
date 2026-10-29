import { TResSideProjectApplications } from "../../infrastructure/entities/package/SideProjectPackage.js";
import { SideProjectPostModel } from "../entities/SideProject/SideProjectPostModel.js";


export interface ISideProjectPostRepository {
    /** 생성, 변경 */
    upsert(post: SideProjectPostModel): Promise<SideProjectPostModel>;
    /** 상태 변경 */
    update(postId: string, state: string): Promise<SideProjectPostModel>;
    getProjectPostByPostId(postId: string):Promise<SideProjectPostModel>;
    getProjectPostsByUserId(userId: string):Promise<SideProjectPostModel[]>;
    getProjectApplicantsByPostId(postId: string):Promise<number[]>;
    // getUserApplicationProjectPosts(userId:string): Promise<SideProjectPostModel[]>;
    getPostsPagination(page:number):Promise<SideProjectPostModel[]>;
}