import { User } from "../entities/user";

export interface IUserRepository {
    registerUser(user: User, passwordHash: string): Promise<User>;
    deleteUser(userId: string): Promise<boolean>;
    updateUserInfo(user: User): Promise<User>;
    findUserById(userId: string): Promise<User | null>;
    findUserByEmail(email: string): Promise<User | null>;
    findUserByNickname(nickname: string): Promise<User | null>;
    changePassword(userId: string, newPassword: string): Promise<boolean>;
    findAllUsers(): Promise<User[]>;
}