export class User {
    constructor(
        public userId: string | null,
        public nickName: string,
        public password: string,
        public email: string,
        public userType: string,
        public createAt: Date | null = null,
        public updateAt: Date | null = null
    ) {}
}