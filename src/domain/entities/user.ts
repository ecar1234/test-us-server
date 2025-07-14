export class User {
    constructor(
        public userId: string,
        public nickName: string,
        public password: string,
        public email: string,
        public userType: string,
        public createAt: Date,
        public updateAt: Date
    ) {}
}