import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { decodeToken, generateToken, verifyToken } from "../../utils/jwt.js";
import { AuthUseCase } from "../../app/AuthUseCase.js";
import { UserUseCase } from "../../app/UserUseCase.js";
import { OtpUseCase } from "../../app/OtpUseCase.js";

export class AuthConroller {
    constructor(private userUseCase: UserUseCase, private authUseCase: AuthUseCase, private otpUseCase: OtpUseCase) { }

    async register(req: Request, res: Response): Promise<void> {
        try {
            const { email, nickname, password, userType, role, userName, birth } = req.body;
            // console.log(`userType : ${userType} / role : ${role}`);
            const userValue = await this.authUseCase.registerUser(email, nickname, password, userType, role, userName, birth);
            if (userValue.status !== 'ACTIVE') {
                res.status(409).json({ status: 409, findUser: userValue });
                return;
            }
            res.status(200).json({
                status: 200, user: {
                    userId: userValue.userId,
                    email: userValue.email,
                    nickname: userValue.nickname,
                    userType: userValue.userType,
                    userName: userValue.userName,
                    birth: userValue.birth,
                    createdAt: userValue.createdAt
                }
            });
        } catch (error) {
            res.status(500).json({ status: 500, error: error.message });
        }
    }
    async authRegister(req: Request, res: Response): Promise<void> {
        try {
            const { email, nickname, profileImg, userType, role, method } = req.body;
            const user = await this.authUseCase.authUserRegister(email, nickname, profileImg.url, userType, role, method);
            const token = generateToken(user);

            res.status(200).json({ status: 200, user: user, token: token });
        } catch (error) {
            res.status(500).json({ status: 500, error: error.message });
        }
    }
    async delete(req: Request, res: Response): Promise<void> {
        try {
            const { userId } = req.body;
            const [success, message] = await this.authUseCase.deleteUser(userId);
            if (success) {
                res.status(200).json({ status: 200, success: success, message: message });
            } else {
                res.status(404).json({ status: 404, error: message });
            }
        } catch (error) {
            res.status(500).json({ status: 500, error: error.message });
        }
    }
    async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;
            const [user, message] = await this.authUseCase.login(email, password);
            if (!user) {
                if (message === "User not found") {
                    res.status(404).json({ status: 404, error: message });
                } else if (message === "Invalid password") {
                    res.status(401).json({ status: 401, error: message });
                }
                return;
            }
            const token = generateToken(user);
            res.status(200).json({ status: 200, user: user, token: token });

        } catch (error) {
            res.status(500).json({ status: 500, error: error.message });
        }
    }
    async autoLogin(req: Request, res: Response): Promise<void> {
        try {
            const user: JwtPayload | string = req.user;
            if (typeof user === 'string') {
                res.status(401).json({ status: 401, error: user });
                return;
            }
            const userId = user.userId;
            const userValue = await this.userUseCase.getUserById(userId);
            if (!userValue) {
                res.status(404).json({ status: 404, error: "User not found" });
                return;
            }
            res.status(200).json({ status: 200 });
        } catch (error) {
            res.status(500).json({ status: 500, error: error.message });
        }
    }
    async refreshToken(req: Request, res: Response): Promise<void> {
        const { token } = req.body;
        try {
            const decoded = verifyToken(token.split(' ')[1]);
            const user = await this.userUseCase.getUserById(decoded.userId);
            if (!user) {
                res.status(404).json({ error: "User not found" });
                return;
            }
            const newToken = generateToken(user);
            res.status(200).json({ status: 200, token: newToken });
        } catch (error) {
            if (error.message === 'jwt expired') {
                res.status(401).json({ status: 401, error: 'Token expired' });
            }
            res.status(401).json({ status: 401, error: error.message });
        }
    }
    async authLogin(req: Request, res: Response): Promise<void> {
        try {
            const { email } = req.body;
            const user = await this.userUseCase.getUserByEmail(email);
            const token = generateToken(user);
            res.status(200).json({ status: 200, user: user, token: token });

        } catch (error) {
            res.status(500).json({ status: 500, error: error.message });
        }
    }
    async updatePassword(req: Request, res: Response): Promise<void> {
        try {
            const { userId, newPassword } = req.body;

            const success = await this.authUseCase.updatePassword(userId, newPassword);
            if (success) {
                res.status(200).json({ status: 200, success: success, message: "Password changed successfully" });
            } else {
                res.status(400).json({ status: 400, error: "Failed to change password" });
            }
        } catch (error) {
            res.status(500).json({ status: 500, error: error.message });
        }
    }
    async changePassword(req: Request, res: Response): Promise<void> {
        try {
            const { email, newPassword } = req.body;
            const success = await this.authUseCase.changePassword(email, newPassword);
            if (success) {
                res.status(200).json({ status: 200 });
            } else {
                res.status(400).json({ status: 400 });
            }
        } catch (error) {
            res.status(500).json({ status: 500, error: error.message });
        }
    }


    async findEmail(req: Request, res: Response): Promise<void> {
        try {
            const { nickname } = req.body;
            const email = await this.authUseCase.findEmail(nickname);
            res.status(200).json({ status: 200, email: email });
        } catch (error) {
            res.status(500).json({ status: 400, error: error.message });
        }
    }
    async findPassword(req: Request, res: Response): Promise<void> {
        try {
            const { email } = req.body;
            const ip = req.ip;
            const code = await this.authUseCase.findPassword(email, ip);
            res.status(200).json({ status: 200, code: code });
        } catch (error) {
            res.status(500).json({ status: 500, error: error.message });
        }
    }
    async verifyOtp(req: Request, res: Response): Promise<void> {
        try {
            const { email, code } = req.body;
            const isValid = await this.otpUseCase.verifyOtp(email, code);
            if (isValid) {
                res.status(200).json({ status: 200 });
            } else {
                res.status(401).json({ status: 401 });
            }
        } catch (error) {
            res.status(500).json({ status: 500, error: error.message });
        }
    }
}