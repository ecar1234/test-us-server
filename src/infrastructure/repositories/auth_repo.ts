import IAuthRepository from "../../domain/interface_repositories/IAuthRepository";
import { AppDataSource } from "../../config/data_source";
import { User } from "../../domain/entities/user";
import { UserEntity } from "../entities/user_entity";
import bcrypt from "bcrypt";


export class AuthRepository implements IAuthRepository {
    async signup(email: string, password: string): Promise<User> {
        const newUser = new UserEntity();
        newUser.email = email;
        newUser.password_hash = password;

        const userRepository = AppDataSource.getRepository(UserEntity);
        try {
            const savedUser = await userRepository.save(newUser);
            return new User(
                savedUser.userId,
                savedUser.email,
                savedUser.password_hash,
                savedUser.nickname,
                savedUser.type,
                savedUser.createAt,
                savedUser.updateAt
            );
        } catch (error) {
            console.error("Error saving user:", error);
            throw new Error("User registration failed");
        }
    }

    async withdraw(email: string): Promise<boolean> {
        const userRepository = AppDataSource.getRepository(UserEntity);
        const result = await userRepository.delete({ email });

        if (result.affected && result.affected > 0) {
            return true; // User successfully deleted
        } else {
            return false; // User not found or deletion failed
        }
       
    }
}