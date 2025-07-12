import { UserRepository } from "../infrastructure/repositories/user_repo";

export class UserUseCase {
    constructor(private userRepo: UserRepository) {}

    async updateUserInfo(userId: string, userName: string, email: string, userType: string): Promise<any> {
        // 사용자 정보 업데이트 로직 구현
        // 예시로 단순히 입력된 정보를 반환
        return { userId, userName, email };
    }
    
}