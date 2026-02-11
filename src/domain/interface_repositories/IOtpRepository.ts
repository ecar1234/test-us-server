
export interface IOtpRepository {
    saveOtp(email: string, code: string, expirySeconds: number): Promise<void>;
    getOtp(email: string): Promise<string | null>;
    deleteOtp(email: string): Promise<void>;
    increaseAttempts(email: string): Promise<void>;
    checkIpLimit(ip: string): Promise<boolean>;
    checkCooldown(email: string): Promise<boolean>;
}