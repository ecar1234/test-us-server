export class UserModel {
    constructor(
        public readonly userId: string | null,
        public nickName: string,
        public password: string,
        public email: string,
        public userType: string,
        public readonly createdAt: Date | null = null,
        public updatedAt: Date | null = null
    ) {}
}