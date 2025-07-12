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
}