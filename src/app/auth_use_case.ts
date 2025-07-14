import { AuthRepository } from "../infrastructure/repositories/auth_repo";
import { UserRepository } from "../infrastructure/repositories/user_repo";
import { User } from "../domain/entities/user";
import bcrypt from "bcrypt";


export class AuthUseCase {
    private authRepo: AuthRepository;
    private userRepo: UserRepository;

    constructor(authRepo: AuthRepository, userRepo: UserRepository) {
        this.authRepo = authRepo;
        this.userRepo = userRepo;
    }

    async signup(email: string, password: string): Promise<User | null> {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await this.authRepo.signup( email, hashedPassword);
        if (!user) {
            console.error("User registration failed");
            return null;
        }
        return user;
    
    }

    async signin(email: string, password: string): Promise<User | null> {
        const user = await this.userRepo.findUserByEmail(email);
        if (!user) {
            console.error("User not found");
            return null;
        }
        const isPasswordValid: boolean = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            console.error("Invalid password");
            return null;
        }
        return user; // Return the user if authentication is successful
        
    }

    async withdraw(email: string, password:string): Promise<boolean> {
        const user = await this.userRepo.findUserByEmail(email);
        if (!user) {
            console.error("User not found");
            return false;
        }
        const isPasswordValid: boolean = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            console.error("Invalid password");
            return false;
        }
        const result = await this.authRepo.withdraw(email);
        if (!result) {
            console.error("Failed to withdraw user");
            return false;
        }
        return result;
        
    }
}