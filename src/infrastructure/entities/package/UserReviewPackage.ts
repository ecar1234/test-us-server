import { UserReviewModel } from "../../../domain/entities/UserReviewModel.js";


export interface TResRecruitTesterReviewInfo {
    user: {
        userId: string;
        email: string;
        nickname: string;
        profileImg: object | null;
        userType: string;
        role: string;
    };
    review: UserReviewModel | null;
    appId: number;

}