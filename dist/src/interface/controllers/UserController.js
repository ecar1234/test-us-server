"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const jwt_1 = require("../../utils/jwt");
class UserController {
    constructor(userUseCase) {
        this.userUseCase = userUseCase;
    }
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, nickname, password, userType, role, userName, birth } = req.body;
                // console.log(`userType : ${userType} / role : ${role}`);
                const userValue = yield this.userUseCase.registerUser(email, nickname, password, userType, role, userName, birth);
                if (userValue[1] === 409) {
                    res.status(409).json({ status: 409, findUser: userValue[0] });
                    return;
                }
                const user = userValue[0];
                res.status(200).json({ status: 200, user: { userId: user.userId, email: user.email, nickname: user.nickname, userType: user.userType, userName: user.userName, birth: user.birth, createdAt: user.createdAt } });
            }
            catch (error) {
                res.status(500).json({ status: 500, error: error.message });
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.body;
                const [success, message] = yield this.userUseCase.deleteUser(userId);
                if (success) {
                    res.status(200).json({ status: 200, success: success, message: message });
                }
                else {
                    res.status(404).json({ status: 404, error: message });
                }
            }
            catch (error) {
                res.status(500).json({ status: 500, error: error.message });
            }
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const user = yield this.userUseCase.getUserByEmail(email);
                if (!user) {
                    res.status(404).json({ error: "User not found" });
                    return;
                }
                const isValid = yield this.userUseCase.isPasswordValid(user.userId, password);
                // console.log(isValid);
                if (isValid) {
                    const token = (0, jwt_1.generateToken)(user);
                    res.status(200).json({ status: 200, token: token, user: user });
                }
                else {
                    res.status(401).json({ status: 401, error: "Invalid password" });
                }
            }
            catch (error) {
                res.status(500).json({ status: 500, error: error.message });
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, nickname, userType, role, userName, birth } = req.body;
                // console.log("controller : ", birth);
                // const birthDate =  new Date(birth);
                const updatedUser = yield this.userUseCase.updateUserInfo(userId, nickname, userType, role, userName, birth);
                res.status(200).json({
                    status: 200,
                    user: {
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
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    getUserById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.id;
                const user = yield this.userUseCase.getUserById(userId);
                if (user) {
                    res.status(200).json({ status: 200, user: { userId: user.userId, email: user.email, nickname: user.nickname, userType: user.userType, status: user.status, userName: user.userName, birth: user.birth, createdAt: user.createdAt, updatedAt: user.updatedAt } });
                }
                else {
                    res.status(404).json({ status: 404, error: "User not found" });
                }
            }
            catch (error) {
                res.status(500).json({ status: 500, error: error.message });
            }
        });
    }
    getUserByEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const email = req.params.email;
                const user = yield this.userUseCase.getUserByEmail(email);
                if (user) {
                    res.status(200).json({ status: 200, user: { userId: user.userId, email: user.email, nickname: user.nickname, userType: user.userType, status: user.status, userName: user.userName, birth: user.birth, createdAt: user.createdAt, updatedAt: user.updatedAt } });
                }
                else {
                    res.status(404).json({ status: 404, error: "User not found" });
                }
            }
            catch (error) {
                res.status(500).json({ status: 500, error: error.message });
            }
        });
    }
    getUserByNickname(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const nickname = req.params.nickname;
                const user = yield this.userUseCase.getUserByNickname(nickname);
                if (user) {
                    res.status(200).json({ status: 200, user: { userId: user.userId, email: user.email, nickname: user.nickname, userType: user.userType, status: user.status, userName: user.userName, birth: user.birth, createdAt: user.createdAt, updatedAt: user.updatedAt } });
                }
                else {
                    res.status(404).json({ status: 404, error: "User not found" });
                }
            }
            catch (error) {
                res.status(500).json({ status: 500, error: error.message });
            }
        });
    }
    getPostsByNickname(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const nickname = req.params.nickname;
                const posts = yield this.userUseCase.getPostsByNickname(nickname);
                res.status(200).json({ status: 200, posts: posts });
            }
            catch (error) {
                res.status(500).json({ status: 500, error: error.message });
            }
        });
    }
    changePassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, newPassword } = req.body;
                const success = yield this.userUseCase.changePassword(userId, newPassword);
                if (success) {
                    res.status(200).json({ status: 200, success: success, message: "Password changed successfully" });
                }
                else {
                    res.status(400).json({ status: 400, error: "Failed to change password" });
                }
            }
            catch (error) {
                res.status(500).json({ status: 500, error: error.message });
            }
        });
    }
    getAllUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield this.userUseCase.getAllUsers();
                res.status(200).json({ status: 200, users: users });
            }
            catch (error) {
                res.status(500).json({ status: 500, error: error.message });
            }
        });
    }
    isNicknameAvailable(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const nickname = req.params.nickname;
                const isAvailable = yield this.userUseCase.isNicknameAvailable(nickname);
                res.status(200).json({ status: 200, available: isAvailable });
            }
            catch (error) {
                res.status(500).json({ status: 500, error: error.message });
            }
        });
    }
    isEmailAvailable(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const email = req.params.email;
                const isAvailable = yield this.userUseCase.isEmailAvailable(email);
                res.status(200).json({ status: 200, available: isAvailable });
            }
            catch (error) {
                res.status(500).json({ status: 500, error: error.message });
            }
        });
    }
    isPasswordValid(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, password } = req.body;
                const isValid = yield this.userUseCase.isPasswordValid(userId, password);
                res.status(200).json({ status: 200, valid: isValid });
            }
            catch (error) {
                res.status(500).json({ status: 500, error: error.message });
            }
        });
    }
}
exports.UserController = UserController;
