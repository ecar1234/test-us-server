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
exports.UserRepositoryImpl = void 0;
const DataSource_1 = require("../../config/DataSource");
const UserModel_1 = require("../../domain/entities/UserModel");
const UserEntity_1 = require("../entities/UserEntity");
class UserRepositoryImpl {
    constructor() {
        this.userRepository = DataSource_1.AppDataSource.getRepository(UserEntity_1.UserEntity);
    }
    toDomainUser(userEntity) {
        // console.log(userEntity);
        return new UserModel_1.UserModel(userEntity.userId, userEntity.email, userEntity.nickname, userEntity.password_hash, userEntity.type === UserEntity_1.UserType.INDIVIDUALS ? 'INDIVIDUALS' : 'COMPANIES', userEntity.status === UserEntity_1.UserStatus.ACTIVE ? 'ACTIVE' : 'INACTIVE', this.getUserRoleString(userEntity.role), userEntity.userName, userEntity.birth, userEntity.createdAt, userEntity.updatedAt, userEntity.posts && userEntity.posts.map(post => post.postId), userEntity.applications && userEntity.applications.map(application => application.appId));
    }
    toEntityUser(user) {
        const dbUser = this.userRepository.create(Object.assign(Object.assign(Object.assign(Object.assign({}, (user.userId && { userId: user.userId })), { email: user.email, password_hash: user.password, nickname: user.nickname, type: user.userType === 'INDIVIDUALS' ? UserEntity_1.UserType.INDIVIDUALS : UserEntity_1.UserType.COMPANIES, status: user.status === 'ACTIVE' ? UserEntity_1.UserStatus.ACTIVE : UserEntity_1.UserStatus.INACTIVE, role: this.getUserRole(user.role), userName: user.userName, birth: user.birth }), (user.posts && { posts: user.posts.map(post => ({ postId: post })) })), (user.applications && { applications: user.applications.map(application => ({ appId: application })) })));
        return dbUser;
    }
    getUserRole(role) {
        switch (role) {
            case 'PROGRAMMER':
                return UserEntity_1.UserRole.PROGRAMMER;
            case 'DESIGNER':
                return UserEntity_1.UserRole.DESIGNER;
            case 'PUBLISHER':
                return UserEntity_1.UserRole.PUBLISHER;
            case 'PLANNER':
                return UserEntity_1.UserRole.PLANNER;
            case 'MANAGER':
                return UserEntity_1.UserRole.MANAGER;
            case 'MARKETER':
                return UserEntity_1.UserRole.MARKETER;
            case 'ANALYST':
                return UserEntity_1.UserRole.ANALYST;
            case 'OPERATER':
                return UserEntity_1.UserRole.OPERATER;
            case 'PM':
                return UserEntity_1.UserRole.PM;
            case 'QA':
                return UserEntity_1.UserRole.QA;
            case 'CS':
                return UserEntity_1.UserRole.CS;
            default:
                throw new Error('Invalid role');
        }
    }
    getUserRoleString(role) {
        switch (role) {
            case UserEntity_1.UserRole.PROGRAMMER:
                return 'PROGRAMMER';
            case UserEntity_1.UserRole.DESIGNER:
                return 'DESIGNER';
            case UserEntity_1.UserRole.PUBLISHER:
                return 'PUBLISHER';
            case UserEntity_1.UserRole.PLANNER:
                return 'PLANNER';
            case UserEntity_1.UserRole.MANAGER:
                return 'MANAGER';
            case UserEntity_1.UserRole.MARKETER:
                return 'MARKETER';
            case 'ANALYST':
                return 'ANALYST';
            case UserEntity_1.UserRole.OPERATER:
                return 'OPERATER';
            case UserEntity_1.UserRole.PM:
                return 'PM';
            case UserEntity_1.UserRole.QA:
                return 'QA';
            case UserEntity_1.UserRole.CS:
                return 'CS';
            default:
                throw new Error('Invalid role');
        }
    }
    registerUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const dbUser = this.toEntityUser(user);
            const savedUser = yield this.userRepository.save(dbUser);
            const resultUser = this.toDomainUser(savedUser);
            return resultUser;
        });
    }
    deleteUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findOne({ where: { userId: userId } });
            if (!user) {
                throw new Error("User not found");
            }
            user.status = UserEntity_1.UserStatus.INACTIVE;
            yield this.userRepository.save(user);
            return true;
        });
    }
    updateUserInfo(user) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log("Impl : ", user);
            const userEntity = yield this.userRepository.findOne({ where: { userId: user.userId } });
            if (!userEntity) {
                throw new Error("User not found");
            }
            // DB에서 조회한 엔티티의 속성을 직접 수정합니다.
            userEntity.nickname = user.nickname;
            userEntity.type = user.userType === 'INDIVIDUALS' ? UserEntity_1.UserType.INDIVIDUALS : UserEntity_1.UserType.COMPANIES;
            userEntity.userName = user.userName;
            userEntity.birth = user.birth;
            // 수정된 엔티티를 저장합니다.
            const savedUser = yield this.userRepository.save(userEntity);
            return this.toDomainUser(savedUser);
        });
    }
    findUserById(userId) {
        return this.userRepository.findOne({ where: { userId } })
            .then(userEntity => userEntity ? this.toDomainUser(userEntity) : null);
    }
    findUserByEmail(email) {
        return this.userRepository.findOne({ where: { email } })
            .then(userEntity => userEntity ? this.toDomainUser(userEntity) : null);
    }
    findUserByNickname(nickname) {
        return this.userRepository.findOne({ where: { nickname } })
            .then(userEntity => userEntity ? this.toDomainUser(userEntity) : null);
    }
    findPostsByNickname(nickname) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findOne({
                where: { nickname: nickname },
                relations: ['posts']
            });
            if (!user) {
                throw new Error("User not found");
            }
            return this.toDomainUser(user);
        });
    }
    changePassword(userId, newPassword) {
        return this.userRepository.update({ userId }, { password_hash: newPassword })
            .then(result => result.affected !== 0);
    }
    findAllUsers() {
        return this.userRepository.find()
            .then(userEntities => userEntities.map(userEntity => this.toDomainUser(userEntity)));
    }
}
exports.UserRepositoryImpl = UserRepositoryImpl;
