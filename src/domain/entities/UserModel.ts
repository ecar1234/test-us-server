export class UserModel {
    constructor(
        public readonly userId: string | null,
        public email: string,
        public nickname: string,
        public password: string,
        public userType: string,
        public status: string = 'ACTIVE',
        public userName: string,
        public birth: Date,
        public readonly createdAt: Date | null = null,
        public updatedAt: Date | null = null,
        public posts: string[] = [],
        public applications: number[] = [],
        // public sentMessages: string[] = [],
        // public receiveMessages: string[] = [],
    ) {}
}