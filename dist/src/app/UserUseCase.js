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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserUseCase = void 0;
const UserModel_1 = require("../domain/entities/UserModel");
const bcrypt_1 = __importDefault(require("bcrypt"));
class UserUseCase {
    constructor(userRepo, postRepo) {
        this.userRepo = userRepo;
        this.postRepo = postRepo;
    }
    registerUser(email, nickname, password, userType, role, userName, birth) {
        return __awaiter(this, void 0, void 0, function* () {
            const findUser = yield this.userRepo.findUserByEmail(email);
            if (findUser) {
                return [findUser, 409];
            }
            const passwordHash = yield bcrypt_1.default.hash(password, 10);
            const user = new UserModel_1.UserModel(null, email, nickname, passwordHash, userType, null, role, userName, birth);
            return [yield this.userRepo.registerUser(user), 200];
        });
    }
    deleteUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log(userId);
            // const user = await this.userRepo.findUserByEmail(userId);
            // if (!user) {
            //     return [false, "User not found"];
            // }
            const isDeleted = yield this.userRepo.deleteUser(userId);
            if (!isDeleted) {
                return [false, "Failed to delete user"];
            }
            return [true, "User deleted successfully"];
        });
    }
    updateUserInfo(userId, nickname, userType, role, userName, birth) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log("use case : ", birth);
            const user = new UserModel_1.UserModel(userId, null, nickname, null, userType, null, role, userName, birth);
            return this.userRepo.updateUserInfo(user);
        });
    }
    getUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.userRepo.findUserById(userId);
        });
    }
    getUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.userRepo.findUserByEmail(email);
        });
    }
    getUserByNickname(nickname) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.userRepo.findUserByNickname(nickname);
        });
    }
    getPostsByNickname(nickname) {
        return __awaiter(this, void 0, void 0, function* () {
            // 1. 닉네임으로 사용자 정보를 조회하여 userId를 얻습니다.
            const user = yield this.userRepo.findUserByNickname(nickname);
            // 2. 사용자가 존재하지 않으면 빈 배열을 반환합니다.
            if (!user || !user.userId) {
                return [];
            }
            // 3. 얻은 userId를 사용하여 PostRepository를 통해 해당 사용자의 모든 게시물을 한 번의 쿼리로 효율적으로 조회합니다.
            return this.postRepo.getPostsByAuthor(user.userId);
        });
    }
    changePassword(userId, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const passwordHash = yield bcrypt_1.default.hash(newPassword, 10);
            return this.userRepo.changePassword(userId, passwordHash);
        });
    }
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.userRepo.findAllUsers();
        });
    }
    isNicknameAvailable(nickname) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepo.findUserByNickname(nickname);
            return user === null;
        });
    }
    isEmailAvailable(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepo.findUserByEmail(email);
            return user === null;
        });
    }
    isPasswordValid(userId, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepo.findUserById(userId);
            if (!user) {
                return false;
            }
            return yield bcrypt_1.default.compare(password, user.password);
        });
    }
}
exports.UserUseCase = UserUseCase;
