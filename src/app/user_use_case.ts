import { User } from "../domain/entities/user";
import { UserRepository } from "../infrastructure/repositories/user_repo";
import bcrypt from "bcrypt";

export class UserUseCase {
    constructor(private userRepo: UserRepository) {}

    async getUserById(userId: string): Promise<User | null> {
        return this.userRepo.findUserById(userId);
    }
    async getUserByEmail(email: string): Promise<User | null> {
        return this.userRepo.findUserByEmail(email);
    }
    async getAllUsers(): Promise<User[]> {
        return this.userRepo.findAllUsers();
    }
    async getUserByNickname(nickname: string): Promise<User | null> {
        return this.userRepo.findUserByNickname(nickname);
    }
    async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<boolean> {
        const user = await this.userRepo.findUserById(userId);
        if (!user) {
            throw new Error("User not found");
        }
        const isPasswordValid: boolean = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordValid) {
            throw new Error("Old password is incorrect");
        }
        // Hash the new password before saving
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        // Update the user's password
        user.password = hashedNewPassword; // Assuming User entity has a password field
        // Save the updated user
        const updatedUser = await this.userRepo.updateUserInfo(user);
        if (!updatedUser) {
            throw new Error("Failed to update password");
        }
        return true;
    }

    async updateUserInfo(userId: string, nickName: string, email: string, userType: string): Promise<User> {
        const user = await this.userRepo.findUserById(userId);
        if (!user) {
            throw new Error("User not found");
        }
        user.email = email;
        user.nickName = nickName;
        user.userType = userType;
        const updatedUser = await this.userRepo.updateUserInfo(user);
        if (!updatedUser) {
            throw new Error("Failed to update user information");
        }

        return updatedUser;
    }
    
}