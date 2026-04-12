import { IOtpRepository } from "../domain/interface_repositories/IOtpRepository.js";
import { MailService } from "../service/otp/MailService.js";
import { OtpSevice } from "../service/otp/OtpService.js";

export class OtpUseCase {
    constructor(
        private otpRepository: IOtpRepository,
        private mailService: MailService,
        private otpService: OtpSevice
    ) {}

    async sendOtp(email: string, ip: string): Promise<void> {
        const isIpLimited = await this.otpRepository.checkIpLimit(ip);
        if (isIpLimited) {
            throw new Error("IP limit exceeded. Please try again later.");
        }

        const isCooldown = await this.otpRepository.checkCooldown(email);
        if (isCooldown) {
            throw new Error("Please wait before requesting a new OTP.");
        }

        const code = this.otpService.generateCide();
        const expirySeconds = 300; // 5 minutes

        await this.otpRepository.saveOtp(email, code, expirySeconds);
        await this.mailService.sendOtpMail(email, code);
    }

    async verifyOtp(email: string, code: string): Promise<boolean> {
        const savedOtp = await this.otpRepository.getOtp(email);

        if (!savedOtp) {
            throw new Error("OTP expired or not found.");
        }

        if (savedOtp !== code) {
            await this.otpRepository.increaseAttempts(email);
            return false;
        }

        await this.otpRepository.deleteOtp(email);
        return true;
    }

}