import { PostModel } from "../domain/entities/PostModel";
import { UserModel } from "../domain/entities/UserModel";
import { PostEntity } from "../infrastructure/entities/PostEntity";
import { PostRepositoryImpl } from "../infrastructure/repositories/PostRepositoryImpl";
import { UserRepositoryImpl } from "../infrastructure/repositories/UserRepositoryImpl";
import bcrypt from "bcrypt";

export class UserUseCase {
    constructor(private userRepo: UserRepositoryImpl, private postRepo: PostRepositoryImpl) { }

    async registerUser(email: string, nickname: string, password: string, userType: string, userName: string, birth: Date): Promise<UserModel> {
        const passwordHash = await bcrypt.hash(password, 10);
        const user = new UserModel(null, email, nickname, passwordHash, userType, null, userName, birth);
        return this.userRepo.registerUser(user);
    }
    async deleteUser(userId: string): Promise<[boolean, string]> {
        // console.log(userId);
        // const user = await this.userRepo.findUserByEmail(userId);
        // if (!user) {
        //     return [false, "User not found"];
        // }

        const isDeleted = await this.userRepo.deleteUser(userId);
        if (!isDeleted) {
            return [false, "Failed to delete user"];
        }
        return [true, "User deleted successfully"];
    }
    async updateUserInfo(userId: string, nickname: string, userType: string, userName: string, birth: Date): Promise<UserModel> {
        // console.log("use case : ", birth);
        const user = new UserModel(userId, null, nickname, null, userType, null, userName, birth);
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
    async getPostsByNickname(nickname: string): Promise<PostModel[]> {
        // 1. 닉네임으로 사용자 정보를 조회하여 userId를 얻습니다.
        const user = await this.userRepo.findUserByNickname(nickname);

        // 2. 사용자가 존재하지 않으면 빈 배열을 반환합니다.
        if (!user || !user.userId) {
            return [];
        }

        // 3. 얻은 userId를 사용하여 PostRepository를 통해 해당 사용자의 모든 게시물을 한 번의 쿼리로 효율적으로 조회합니다.
        return this.postRepo.getPostsByAuthor(user.userId);
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