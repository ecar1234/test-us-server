"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
class UserModel {
    constructor(userId, email, nickname, password, userType, status = 'ACTIVE', role, userName, birth, createdAt = null, updatedAt = null, posts = [], applications = []) {
        this.userId = userId;
        this.email = email;
        this.nickname = nickname;
        this.password = password;
        this.userType = userType;
        this.status = status;
        this.role = role;
        this.userName = userName;
        this.birth = birth;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.posts = posts;
        this.applications = applications;
    }
}
exports.UserModel = UserModel;
