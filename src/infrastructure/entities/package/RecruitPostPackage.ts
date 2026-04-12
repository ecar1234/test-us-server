
export interface TResRecruitApplicationUserInfo {
    user: {
        userId: string;
        email: string;
        nickname: string;
        profileImg: object | null;
        status: string;
        userType: string;
        role: string;
        createdAt: Date;
        updatedAt: Date;
    };
    application: {
        id: number;
        platform: string;
        mobileOs: string | null;
        status: string;
        appliedAt: Date;
        updatedAt: Date;
        postId: string;
    };
}