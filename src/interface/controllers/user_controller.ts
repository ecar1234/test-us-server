import { UserUseCase } from "../../app/user_use_case";

export class UserController {
    constructor(private userUseCase: UserUseCase) {}

    async update(req: any, res: any): Promise<void> {
        try {
            const { userId, userName, email, userType } = req.body;
            const result = await this.userUseCase.updateUserInfo(userId, userName, email, userType);
            res.status(200).json({ message: "User updated successfully", data: result });
        } catch (error) {
            res.status(500).json({ message: "Error updating user", error: error.message });
        }
    }
    async getUserById(req: any, res: any): Promise<void> {
        try {
            const userId = req.params.id;
            const user = await this.userUseCase.getUserById(userId);
            if (!user) {
                res.status(404).json({ message: "User not found" });
                return;
            }
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ message: "Error fetching user", error: error.message });
        }
    }
    async getAllUsers(req: any, res: any): Promise<void> {
        try {
            const users = await this.userUseCase.getAllUsers();
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ message: "Error fetching users", error: error.message });
        }
    }
    async changePassword(req: any, res: any): Promise<void> {
        try {
            const { userId, oldPassword, newPassword } = req.body;
            const result = await this.userUseCase.changePassword(userId, oldPassword, newPassword);
            res.status(200).json({ message: "Password changed successfully", data: result });
        } catch (error) {
            res.status(500).json({ message: "Error changing password", error: error.message });
        }
    }
    async getUserByEmail(req: any, res: any): Promise<void> {
        try {
            const email = req.params.email;
            const user = await this.userUseCase.getUserByEmail(email);
            if (!user) {
                res.status(404).json({ message: "User not found" });
                return;
            }
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ message: "Error fetching user", error: error.message });
        }
    }
    async getUserByNickname(req: any, res: any): Promise<void> {
        try {
            const nickname = req.params.nickname;
            const user = await this.userUseCase.getUserByNickname(nickname);
            if (!user) {
                res.status(404).json({ message: "User not found" });
                return;
            }
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ message: "Error fetching user", error: error.message });
        }
    }
}