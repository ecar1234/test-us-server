export class User {
    constructor(
        public userId: string | null,
        public nickName: string,
        public password: string,
        public email: string,
        public userType: string,
        public createdAt: Date | null = null,
        public updatedAt: Date | null = null
    ) {}
}