import { UserUseCase } from "../../app/UserUseCase";
import { Request, Response } from "express";
import { generateToken } from "../../utils/jwt";

export class UserController {
    constructor(private userUseCase: UserUseCase) { }

    async register(req: Request, res: Response): Promise<void> {
        try {
            const { email, nickname, password, userType, role, userName, birth } = req.body;
            // console.log(`userType : ${userType} / role : ${role}`);
            const userValue = await this.userUseCase.registerUser(email, nickname, password, userType, role, userName, birth);
            if (userValue[1] === 409) {
                res.status(409).json({ status: 409, findUser: userValue[0] });
                return;
            }
            const user = userValue[0];
            res.status(200).json({ status: 200, user: { userId: user.userId, email: user.email, nickname: user.nickname, userType: user.userType, userName: user.userName, birth: user.birth, createdAt: user.createdAt } });
        } catch (error) {
            res.status(500).json({ status: 500, error: error.message });
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        try {
            const { userId } = req.body;
            const [success, message] = await this.userUseCase.deleteUser(userId);
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
            const user = await this.userUseCase.getUserByEmail(email);
            if (!user) {
                res.status(404).json({ error: "User not found" });
                return;
            }
            const isValid = await this.userUseCase.isPasswordValid(user.userId, password);
            // console.log(isValid);
            if (isValid) {
                const token = generateToken(user);
                res.status(200).json({ status: 200, token: token, user: user });
            } else {
                res.status(401).json({ status: 401, error: "Invalid password" });
            }
        } catch (error) {
            res.status(500).json({ status: 500, error: error.message });
        }
    }

    async update(req: Request, res: Response): Promise<void> {
        try {
            const { userId, nickname, userType, role, userName, birth } = req.body;
            // console.log("controller : ", birth);
            // const birthDate =  new Date(birth);
            const updatedUser = await this.userUseCase.updateUserInfo(userId, nickname, userType, role, userName, birth);

            res.status(200).json({
                status: 200,
                user:
                {
                    userId: updatedUser.userId,
                    email: updatedUser.email,
                    nickname: updatedUser.nickname,
                    userType: updatedUser.userType,
                    userName: updatedUser.userName,
                    birth: updatedUser.birth,
                    status: updatedUser.status,
                    updatedAt: updatedUser.updatedAt
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
                res.status(200).json({ status: 200, user: { userId: user.userId, email: user.email, nickname: user.nickname, userType: user.userType, status: user.status, userName: user.userName, birth: user.birth, createdAt: user.createdAt, updatedAt: user.updatedAt } });
            } else {
                res.status(404).json({ status: 404, error: "User not found" });
            }
        } catch (error) {
            res.status(500).json({ status: 500, error: error.message });
        }
    }

    async getUsersByIds(req: Request, res: Response): Promise<void> {
        try {
            const { ids } = req.body;
            const data = await this.userUseCase.getUsersByIds(ids);
            // console.log('controller : ', users);
            res.status(200).json({ status: 200, users: data});
        } catch (error) {
            res.status(500).json({ status: 500, error: error.message });
        }

    }

    async getUserByEmail(req: Request, res: Response): Promise<void> {
        try {
            const email: string = req.params.email;
            const user = await this.userUseCase.getUserByEmail(email);
            if (user) {
                res.status(200).json({ status: 200, user: { userId: user.userId, email: user.email, nickname: user.nickname, userType: user.userType, status: user.status, userName: user.userName, birth: user.birth, createdAt: user.createdAt, updatedAt: user.updatedAt } });
            } else {
                res.status(404).json({ status: 404, error: "User not found" });
            }
        } catch (error) {
            res.status(500).json({ status: 500, error: error.message });
        }
    }

    async getUserByNickname(req: Request, res: Response): Promise<void> {
        try {
            const nickname: string = req.params.nickname;
            const user = await this.userUseCase.getUserByNickname(nickname);
            if (user) {
                res.status(200).json({ status: 200, user: { userId: user.userId, email: user.email, nickname: user.nickname, userType: user.userType, status: user.status, userName: user.userName, birth: user.birth, createdAt: user.createdAt, updatedAt: user.updatedAt } });
            } else {
                res.status(404).json({ status: 404, error: "User not found" });
            }
        } catch (error) {
            res.status(500).json({ status: 500, error: error.message });
        }
    }

    async getPostsByNickname(req: Request, res: Response): Promise<void> {
        try {
            const nickname: string = req.params.nickname;
            const posts = await this.userUseCase.getPostsByNickname(nickname);

            res.status(200).json({ status: 200, posts: posts });

        } catch (error) {
            res.status(500).json({ status: 500, error: error.message });
        }

    }

    async changePassword(req: Request, res: Response): Promise<void> {
        try {
            const { userId, newPassword } = req.body;
            const success = await this.userUseCase.changePassword(userId, newPassword);
            if (success) {
                res.status(200).json({ status: 200, success: success, message: "Password changed successfully" });
            } else {
                res.status(400).json({ status: 400, error: "Failed to change password" });
            }
        } catch (error) {
            res.status(500).json({ status: 500, error: error.message });
        }
    }

    async getAllUsers(req: Request, res: Response): Promise<void> {
        try {
            const users = await this.userUseCase.getAllUsers();
            res.status(200).json({ status: 200, users: users });
        } catch (error) {
            res.status(500).json({ status: 500, error: error.message });
        }
    }
    async isNicknameAvailable(req: Request, res: Response): Promise<void> {
        try {
            const nickname: string = req.params.nickname;
            const isAvailable = await this.userUseCase.isNicknameAvailable(nickname);
            if(!isAvailable){
                res.status(200).json({ status: 200, available: isAvailable });
            }else{
                res.status(409).json({ status: 409, available: isAvailable });
            }
        } catch (error) {
            res.status(500).json({ status: 500, error: error.message });
        }
    }

    async isEmailAvailable(req: Request, res: Response): Promise<void> {
        try {
            const email: string = req.params.email;
            const isAvailable = await this.userUseCase.isEmailAvailable(email);
            res.status(200).json({ status: 200, available: isAvailable });
        } catch (error) {
            res.status(500).json({ status: 500, error: error.message });
        }
    }

    async isPasswordValid(req: Request, res: Response): Promise<void> {
        try {
            const { userId, password } = req.body;
            const isValid = await this.userUseCase.isPasswordValid(userId, password);
            res.status(200).json({ status: 200, valid: isValid });
        } catch (error) {
            res.status(500).json({ status: 500, error: error.message });
        }
    }
}