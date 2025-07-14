import { User } from "../entities/user";

export interface IUserRepository {
    updateUserInfo(changedUserInfo : User): Promise<User>;
    findUserById(userId: string): Promise<User | null>;
    findUserByEmail(email: string): Promise<User | null>;
    findUserByNickname(nicname: string): Promise<User | null>;
    findAllUsers(): Promise<User[]>;
}