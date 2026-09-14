import { UserModel } from "../../../domain/entities/UserModel.js";
import { UserReviewModel } from "../../../domain/entities/UserReviewModel.js";


export interface TResRecruitTesterReviewInfo {
    user: UserModel
    review: UserReviewModel | null;
    appId: number;

}