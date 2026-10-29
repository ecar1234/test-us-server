import { CoffeeChatPostModel } from "../entities/CoffeeChatPostModel.js";


export interface ICoffeeChatPostRepository {
    /** 생성, 변경(업데이트/삭제) 모든 데이터 변경에 사용 */
    save(post: CoffeeChatPostModel): Promise<CoffeeChatPostModel>;
    getProjectPostByPostId(postId: string): Promise<CoffeeChatPostModel>;
    getProjectPostsByUserId(userId: string): Promise<CoffeeChatPostModel[]>;
    getProjectApplicantsByPostId(postId: string): Promise<number[]>;
    getPostsPagination(page: number): Promise<CoffeeChatPostModel[]>;
}