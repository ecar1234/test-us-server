import { UserUseCase } from "../../app/user_use_case";
import e, { Request, Response } from "express";

export class UserController {
    constructor(private userUseCase: UserUseCase) {}

    async register(req: Request, res: Response): Promise<void> {
        try {
            const { email, nickname, password, userType } = req.body;
            const user = await this.userUseCase.registerUser(email, nickname, password, userType);
            res.status(201).json(user);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        try {
            const { email } = req.body;
            const [success, message] = await this.userUseCase.deleteUser(email);
            if (success) {
                res.status(200).json({ message });
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
                res.status(200).json({ message: "Login successful", user });
            } else {
                res.status(401).json({ error: "Invalid password" });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async update(req: Request, res: Response): Promise<void> {
        try {
            const { userId, email, nickname, userType } = req.body;
            
            const updatedUser = await this.userUseCase.updateUserInfo(email, nickname, userId, userType);

            res.status(200).json(updatedUser);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getUserById(req: Request, res: Response): Promise<void> {
        try {
            const { userId } = req.body;
            const user = await this.userUseCase.getUserById(userId);
            if (user) {
                res.status(200).json(user);
            } else {
                res.status(404).json({ error: "User not found" });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getUserByEmail(req: Request, res: Response): Promise<void> {
        try {
            const { email } = req.body;
            const user = await this.userUseCase.getUserByEmail(email);
            if (user) {
                res.status(200).json(user);
            } else {
                res.status(404).json({ error: "User not found" });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getUserByNickname(req: Request, res: Response): Promise<void> {
        try {
            const { nickname } = req.body;
            const user = await this.userUseCase.getUserByNickname(nickname);
            if (user) {
                res.status(200).json(user);
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
                res.status(200).json({ message: "Password changed successfully" });
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
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async isNicknameAvailable(req: Request, res: Response): Promise<void> {
        try {
            const { nickname } = req.body;
            const isAvailable = await this.userUseCase.isNicknameAvailable(nickname);
            res.status(200).json({ available: isAvailable });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async isEmailAvailable(req: Request, res: Response): Promise<void> {
        try {
            const { email } = req.body;
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