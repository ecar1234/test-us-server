import { UserModel } from "../entities/UserModel";

export interface IUserRepository {
    registerUser(user: UserModel): Promise<UserModel>;
    deleteUser(userId: string): Promise<boolean>;
    updateUserInfo(user: UserModel): Promise<UserModel>;
    findUserById(userId: string): Promise<UserModel | null>;
    findUserByEmail(email: string): Promise<UserModel | null>;
    findUserByNickname(nickname: string): Promise<UserModel | null>;
    changePassword(userId: string, newPassword: string): Promise<boolean>;
    findAllUsers(): Promise<UserModel[]>;
}