import { ApplicationModel } from "./ApplicationModel";

export class UserModel {
    constructor(
        public readonly userId: string | null,
        public email: string,
        public nickname: string,
        public password: string,
        public userType: string,
        public status: string = 'ACTIVE',
        public role: string,
        public userName: string,
        public birth: Date,
        public readonly createdAt: Date | null = null,
        public updatedAt: Date | null = null,
        public posts: string[] = [],
        public applications: ApplicationModel[] = [],
        // public sentMessages: string[] = [],
        // public receiveMessages: string[] = [],
    ) {}
}

export class TResUserAndReivews {
    constructor(
        public user: UserModel,
        public averageRating: number,
        public reviewCount: number
    ) { }
}