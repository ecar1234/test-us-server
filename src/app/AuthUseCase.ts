import { UserModel } from "../domain/entities/UserModel.js";
import { UserRepositoryImpl } from "../infrastructure/repositories/UserRepositoryImpl.js";
import { OtpRepositoryImpl } from "../infrastructure/repositories/Otp/OtpRedisRepositoryImpl.js";
import { MailService } from "../service/otp/MailService.js";
import { OtpSevice } from "../service/otp/OtpService.js";
import { UserStatus } from "../infrastructure/entities/UserEntity.js";
import bcrypt from "bcrypt";
import { v4 as uuidV4 } from "uuid";

interface UploadedImageInfo {
    filename: string;
    originalname: string;
    mimetype: string;
    size: number;
    url: string;
}

export class AuthUseCase {

    constructor(
        private userRepo: UserRepositoryImpl,
        private otpRepo: OtpRepositoryImpl,
        private mailService: MailService,
        private otpService: OtpSevice
    ) { }

    async registerUser(email: string, nickname: string, password: string, userType: string, role: string, userName: string, birth: Date, profileImg?: UploadedImageInfo, method: string = 'EMAIL'): Promise<UserModel> {
        const findUser = await this.userRepo.findUserByEmail(email);
        if (findUser) {
            return findUser;
        }
        const passwordHash = await bcrypt.hash(password, 10);
        const userInfo = new UserModel(null, email, nickname, passwordHash, userType, UserStatus.ACTIVE, role, userName, birth, profileImg, method);
        const newUser = await this.userRepo.registerUser(userInfo);
        return newUser;
    }
    async authUserRegister(email: string, nickname: string, profileUrl: string, userType: string, role: string, method: string): Promise<UserModel> {
        const user = new UserModel(
            null,
            email,
            nickname ?? `User${uuidV4()}`,
            'authUserRegister',
            userType,
            UserStatus.ACTIVE,
            role,
            null,
            null,
            { url: profileUrl, filename: null, originalname: null, mimetype: null, size: null },
            method
        );
        return await this.userRepo.registerUser(user);
    }
    async login(email: string, password: string): Promise<[UserModel | null, string]> {
        const user = await this.userRepo.findUserByEmail(email);
        if (user.status !== 'ACTIVE') {
            return [null, "User not found"];
        }
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return [null, "Invalid password"];
        }
        return [user, "Login successful"];
    }
    async deleteUser(userId: string): Promise<[boolean, string]> {
        const isDeleted = await this.userRepo.deleteUser(userId);
        if (!isDeleted) {
            return [false, "Failed to delete user"];
        }
        return [true, "User deleted successfully"];
    }
    async updatePassword(userId: string, newPassword: string): Promise<boolean> {
        const passwordHash = await bcrypt.hash(newPassword, 10);
        return this.userRepo.updatePassword(userId, passwordHash);
    }
    async changePassword(email: string, newPassword: string): Promise<boolean> { 
        try {
            const user = await this.userRepo.findUserByEmail(email);
            if (!user) {
                throw new Error("User not found");
            }
            const passwordHash = await bcrypt.hash(newPassword, 10);
            await this.userRepo.updatePassword(user.userId, passwordHash);
            return true;
        } catch (error) {
            return false;
        }
    }

    async findEmail(nickname: string): Promise<string> {
        const user = await this.userRepo.findUserByNickname(nickname);
        if (!user) {
            throw new Error("User not found");
        }
        return user.email;
    }
    async findPassword(email: string, ip: string): Promise<string> {

        await this.otpRepo.checkIpLimit(ip);

        const user = await this.userRepo.findUserByEmail(email);
        if (!user) {
            throw new Error("User not found");
        }
        const code = this.otpService.generateCide();
        const expirySeconds = 300; // 5 minutes

        await this.otpRepo.saveOtp(email, code, expirySeconds);
        try {
            await this.mailService.sendOtpMail(email, code);
        } catch (error) {
            await this.otpRepo.deleteOtp(email);
            throw new Error("Failed to send email");
        }
        return code;
    }
}