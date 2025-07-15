import { AppDataSource } from "../../config/data_source";
import { User } from "../../domain/entities/user";
import { IUserRepository } from "../../domain/interface_repositories/IUserRepository";
import { UserEntity, UserType } from "../entities/user_entity";

export class UserRepository implements IUserRepository {
    registerUser(user: User, passwordHash: string): Promise<User> {
        throw new Error("Method not implemented.");
    }
    deleteUser(userId: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    updateUserInfo(user: User): Promise<User> {
        throw new Error("Method not implemented.");
    }
    findUserById(userId: string): Promise<User | null> {
        throw new Error("Method not implemented.");
    }
    findUserByEmail(email: string): Promise<User | null> {
        throw new Error("Method not implemented.");
    }
    findUserByNickname(nickname: string): Promise<User | null> {
        throw new Error("Method not implemented.");
    }
    changePassword(userId: string, newPassword: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    findAllUsers(): Promise<User[]> {
        throw new Error("Method not implemented.");
    }
   
}