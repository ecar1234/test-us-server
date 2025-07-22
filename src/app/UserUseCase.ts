import { UserModel } from "../domain/entities/UserModel";
import { UserRepositoryImpl } from "../infrastructure/repositories/UserRepositoryImpl";
import bcrypt from "bcrypt";

export class UserUseCase {
    constructor(private userRepo: UserRepositoryImpl) {}

    async registerUser(email: string, nickname: string, password: string, userType: string): Promise<UserModel> {
        const passwordHash = await bcrypt.hash(password, 10);
        const user = new UserModel(null, email, nickname, passwordHash, userType);
        return this.userRepo.registerUser(user);
    }
    async deleteUser(email: string): Promise<[boolean, string]> {
        const user = await this.userRepo.findUserByEmail(email);
        if (!user) {
            return [false, "User not found"];
        }
        
        const isDeleted = await this.userRepo.deleteUser(user.userId);
        if (!isDeleted) {
            return [false, "Failed to delete user"];
        }
        return [true, "User deleted successfully"];
    }
    async updateUserInfo(userId: string, email: string, nickname: string, userType: string): Promise<UserModel> {
        const user = new UserModel(userId, email, nickname, "", userType);
        return this.userRepo.updateUserInfo(user);
    }
    async getUserById(userId: string): Promise<UserModel | null> {
        return this.userRepo.findUserById(userId);
    }
    async getUserByEmail(email: string): Promise<UserModel | null> {
        return this.userRepo.findUserByEmail(email);
    }
    async getUserByNickname(nickname: string): Promise<UserModel | null> {
        return this.userRepo.findUserByNickname(nickname);
    }
    async changePassword(userId: string, newPassword: string): Promise<boolean> {
        const passwordHash = await bcrypt.hash(newPassword, 10);
        return this.userRepo.changePassword(userId, passwordHash);
    }
    async getAllUsers(): Promise<UserModel[]> {
        return this.userRepo.findAllUsers();
    }
    async isNicknameAvailable(nickname: string): Promise<boolean> {
        const user = await this.userRepo.findUserByNickname(nickname);
        return user === null;
    }
    async isEmailAvailable(email: string): Promise<boolean> {
        const user = await this.userRepo.findUserByEmail(email);
        return user === null;
    }
    async isPasswordValid(userId: string, password: string): Promise<boolean> {
        const user = await this.userRepo.findUserById(userId);
        if (!user) {
            return false;
        }
        return await bcrypt.compare(password, user.password);
    }
}