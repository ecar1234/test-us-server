import { IUserRepository } from "../../domain/interface_repositories/IUserRepository";

export class UserRepository implements IUserRepository {
    async updateUserInfo(userId: string, userName: string, email: string, userType: string): Promise<any>{}
}