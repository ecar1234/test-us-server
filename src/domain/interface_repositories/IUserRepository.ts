import { UserModel } from "../entities/UserModel";

export interface IUserRepository {
    registerUser(user: UserModel): Promise<UserModel>;
    deleteUser(userId: string): Promise<boolean>;
    updateUserInfo(user: UserModel): Promise<UserModel>;
    findUserById(userId: string): Promise<UserModel | null>;
    findUsersByIds(ids: string[]): Promise<UserModel[]>;
    findUserByEmail(email: string): Promise<UserModel | null>;
    findUserByNickname(nickname: string): Promise<UserModel | null>;
    findPostsByNickname(nickname: string): Promise<UserModel>;
    updatePassword(userId: string, newPassword: string): Promise<boolean>;
    findAllUsers(): Promise<UserModel[]>;
}