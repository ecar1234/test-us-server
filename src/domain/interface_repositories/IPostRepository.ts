import { PromotionPostModel } from "../entities/PromotionPostModel.js";
import { RecruitmentPostModel } from "../entities/RecruitmentPostModel.js";


export interface IPostRepository {
    getFavoritePosts(): Promise<(RecruitmentPostModel | PromotionPostModel)[]>
}