export class User {
    constructor(
        public user_name: string,
        public email: string,
        public password: string
    ) {}

    // 사용자 정보를 반환하는 메서드
    getUserInfo() {
        return {
            user_name: this.user_name,
            email: this.email
        };
    }

    // 비밀번호를 변경하는 메서드
    changePassword(newPassword: string) {
        this.password = newPassword;
    }
}