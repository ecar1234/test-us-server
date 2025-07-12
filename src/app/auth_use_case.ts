import { AuthRepository } from "../infrastructure/repositories/auth_repo";


export class AuthUseCase {
    private authRepo: AuthRepository;

    constructor(authRepo: AuthRepository) {
        this.authRepo = authRepo;
    }

    async signup(user_name: string, email: string, password: string, userType: string): Promise<any> {
        // 회원가입 로직 구현
        return { message: "회원가입 성공" };
    }

    async signin(email: string, password: string): Promise<any> {
        // 로그인 로직 구현
        return { message: "로그인 성공" };
    }

    async withdraw(email: string): Promise<any> {
        // 회원 탈퇴 로직 구현
        return { message: "회원 탈퇴 성공" };
    }
}