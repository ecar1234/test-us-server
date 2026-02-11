import { redisOtp } from "../../../config/RedisConfig";
import { IOtpRepository } from "../../../domain/interface_repositories/IOtpRepository";

export class OtpRepositoryImpl implements IOtpRepository {
    private redis = redisOtp;

    private otpKey(email: string): string {
        return `otp:email:${email}`;
    }
    private cooldownKey(email: string): string {
        return `otp:cooldown:${email}`;
    }
    private attemptsKey(email: string): string {
        return `otp:attempts:${email}`;
    }
    private ipLimitKey(ip: string): string {
        return `otp:ip:${ip}`;
    }


    async saveOtp(email: string, code: string, expirySeconds: number): Promise<void> {
        await this.redis.set(this.otpKey(email), code, 'EX', expirySeconds);
        await this.redis.set(this.cooldownKey(email), 1, 'EX', 60);
        await this.redis.del(this.attemptsKey(email));
    }
    async getOtp(email: string): Promise<string | null> {
        return this.redis.get(this.otpKey(email));
    }
    async deleteOtp(email: string): Promise<void> {
        await this.redis.del(this.otpKey(email));
        await this.redis.del(this.cooldownKey(email));
        await this.redis.del(this.attemptsKey(email));
    }
    async increaseAttempts(email: string): Promise<void> {
       const count = await this.redis.incr(this.attemptsKey(email));
       if(count === 1) {
        await this.redis.expire(this.attemptsKey(email), 60);
       }
       if (count > 5) {
        throw new Error("Too many attempts. Please try again later.");
       }
    }
    async checkIpLimit(ip: string): Promise<boolean> {
        const count = await this.redis.incr(this.ipLimitKey(ip));
        if (count === 1) {
            this.redis.expire(this.ipLimitKey(ip), 60);
        }
        return count > 5;
    }
    async checkCooldown(email: string): Promise<boolean> {
        const exists = await this.redis.exists(this.cooldownKey(email));
        return exists === 1;
    }
    
}