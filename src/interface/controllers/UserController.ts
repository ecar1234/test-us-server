import { UserUseCase } from "../../app/UserUseCase";
import e, { Request, Response } from "express";

export class UserController {
    constructor(private userUseCase: UserUseCase) { }

    async register(req: Request, res: Response): Promise<void> {
        try {
            const { email, nickname, password, userType, userName, birth } = req.body;
            console.log(userType);
            const user = await this.userUseCase.registerUser(email, nickname, password, userType, userName, birth);
            res.status(201).json({ user: { userId: user.userId, email: user.email, nickname: user.nickname, userType: user.userType, userName: user.userName, birth: user.birth, createdAt: user.createdAt } });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        try {
            const { userId } = req.body;
            const [success, message] = await this.userUseCase.deleteUser(userId);
            if (success) {
                res.status(200).json({ succes: success, message: message });
            } else {
                res.status(404).json({ error: message });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;
            const user = await this.userUseCase.getUserByEmail(email);
            if (!user) {
                res.status(404).json({ error: "User not found" });
                return;
            }
            const isValid = await this.userUseCase.isPasswordValid(user.userId, password);
            if (isValid) {
                res.status(200).json({ user: user, message: "Login successful" });
            } else {
                res.status(401).json({ error: "Invalid password" });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async update(req: Request, res: Response): Promise<void> {
        try {
            const { userId, nickname, userType, userName, birth } = req.body;
            // console.log("controller : ", birth);
            // const birthDate =  new Date(birth);
            const updatedUser = await this.userUseCase.updateUserInfo(userId, nickname, userType, userName, birth);
    
            res.status(200).json({
                user:
                {
                    userId: updatedUser.userId,
                    email: updatedUser.email,
                    nickname: updatedUser.nickname,
                    userType: updatedUser.userType,
                    userName: updatedUser.userName,
                    birth: updatedUser.birth,
                    status: updatedUser.status,
                    updatadAt: updatedUser.updatedAt
                }
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getUserById(req: Request, res: Response): Promise<void> {
        try {
            const userId: string = req.params.id;
            const user = await this.userUseCase.getUserById(userId);
            if (user) {
                res.status(200).json({ user: { userId: user.userId, email: user.email, nickname: user.nickname, userType: user.userType, status: user.status, userName: user.userName, birth: user.birth, createAt: user.createdAt, updatadAt: user.updatedAt } });
            } else {
                res.status(404).json({ error: "User not found" });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getUserByEmail(req: Request, res: Response): Promise<void> {
        try {
            const email: string = req.params.email;
            const user = await this.userUseCase.getUserByEmail(email);
            if (user) {
                res.status(200).json({ user: { userId: user.userId, email: user.email, nickname: user.nickname, userType: user.userType, status: user.status, userName: user.userName, birth: user.birth, createAt: user.createdAt, updatadAt: user.updatedAt } });
            } else {
                res.status(404).json({ error: "User not found" });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getUserByNickname(req: Request, res: Response): Promise<void> {
        try {
            const nickname: string = req.params.nickname;
            const user = await this.userUseCase.getUserByNickname(nickname);
            if (user) {
                res.status(200).json({ user: { userId: user.userId, email: user.email, nickname: user.nickname, userType: user.userType, status: user.status, userName: user.userName, birth: user.birth, createAt: user.createdAt, updatadAt: user.updatedAt } });
            } else {
                res.status(404).json({ error: "User not found" });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async changePassword(req: Request, res: Response): Promise<void> {
        try {
            const { userId, newPassword } = req.body;
            const success = await this.userUseCase.changePassword(userId, newPassword);
            if (success) {
                res.status(200).json({ success: success, message: "Password changed successfully" });
            } else {
                res.status(400).json({ error: "Failed to change password" });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getAllUsers(req: Request, res: Response): Promise<void> {
        try {
            const users = await this.userUseCase.getAllUsers();
            res.status(200).json({ users: users });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async isNicknameAvailable(req: Request, res: Response): Promise<void> {
        try {
            const nickname: string = req.params.nickname;
            const isAvailable = await this.userUseCase.isNicknameAvailable(nickname);
            res.status(200).json({ available: isAvailable });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async isEmailAvailable(req: Request, res: Response): Promise<void> {
        try {
            const email: string = req.params.email;
            const isAvailable = await this.userUseCase.isEmailAvailable(email);
            res.status(200).json({ available: isAvailable });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async isPasswordValid(req: Request, res: Response): Promise<void> {
        try {
            const { userId, password } = req.body;
            const isValid = await this.userUseCase.isPasswordValid(userId, password);
            res.status(200).json({ valid: isValid });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}