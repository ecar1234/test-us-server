import { PromotionPostModel } from "../entities/PromotionPostModel";
import { RecruitmentPostModel } from "../entities/RecruitmentPostModel";


export interface IPostRepository {
    getFavoritePosts(): Promise<(RecruitmentPostModel | PromotionPostModel)[]>
}