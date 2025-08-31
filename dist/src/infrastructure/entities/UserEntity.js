"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserEntity = exports.UserRole = exports.UserStatus = exports.UserType = void 0;
const typeorm_1 = require("typeorm");
const PostEntity_1 = require("./PostEntity");
const ApplicationEntity_1 = require("./ApplicationEntity");
const MessageEntity_1 = require("./MessageEntity");
const ReviewEntiry_1 = require("./ReviewEntiry");
var UserType;
(function (UserType) {
    UserType["INDIVIDUALS"] = "INDIVIDUALS";
    UserType["COMPANIES"] = "COMPANIES";
})(UserType || (exports.UserType = UserType = {}));
var UserStatus;
(function (UserStatus) {
    UserStatus["ACTIVE"] = "ACTIVE";
    UserStatus["INACTIVE"] = "INACTIVE";
    UserStatus["DELETED"] = "DELETED";
})(UserStatus || (exports.UserStatus = UserStatus = {}));
var UserRole;
(function (UserRole) {
    UserRole["PROGRAMMER"] = "PROGRAMMER";
    UserRole["DESIGNER"] = "DESIGNER";
    UserRole["PUBLISHER"] = "PUBLISHER";
    UserRole["PLANNER"] = "PLANNER";
    UserRole["MANAGER"] = "MANAGER";
    UserRole["MARKETER"] = "MARKETER";
    UserRole["ANALYST"] = "ANALYST";
    UserRole["OPERATER"] = "OPERATER";
    UserRole["PM"] = "PM";
    UserRole["QA"] = "QA";
    UserRole["CS"] = "CS";
})(UserRole || (exports.UserRole = UserRole = {}));
let UserEntity = class UserEntity {
};
exports.UserEntity = UserEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], UserEntity.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { length: 50 }),
    __metadata("design:type", String)
], UserEntity.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { length: 60 }),
    __metadata("design:type", String)
], UserEntity.prototype, "password_hash", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { length: 20 }),
    __metadata("design:type", String)
], UserEntity.prototype, "nickname", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { length: 20, nullable: true }),
    __metadata("design:type", String)
], UserEntity.prototype, "userName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], UserEntity.prototype, "birth", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: UserType, default: UserType.INDIVIDUALS }),
    __metadata("design:type", String)
], UserEntity.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: UserRole, default: UserRole.PROGRAMMER }),
    __metadata("design:type", String)
], UserEntity.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE }),
    __metadata("design:type", String)
], UserEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], UserEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], UserEntity.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => PostEntity_1.PostEntity, post => post.author),
    __metadata("design:type", Array)
], UserEntity.prototype, "posts", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ApplicationEntity_1.ApplicationEntity, app => app.applicant),
    __metadata("design:type", Array)
], UserEntity.prototype, "applications", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => MessageEntity_1.MessagesEntity, message => message.sender),
    __metadata("design:type", Array)
], UserEntity.prototype, "sentMessages", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => MessageEntity_1.MessagesEntity, message => message.receiver),
    __metadata("design:type", Array)
], UserEntity.prototype, "receiveMessages", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ReviewEntiry_1.ReviewEntity, review => review.reviewer),
    __metadata("design:type", Array)
], UserEntity.prototype, "givenReviews", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ReviewEntiry_1.ReviewEntity, review => review.reviewed),
    __metadata("design:type", Array)
], UserEntity.prototype, "receivedReviews", void 0);
exports.UserEntity = UserEntity = __decorate([
    (0, typeorm_1.Entity)('User'),
    (0, typeorm_1.Unique)(['email', 'nickname'])
], UserEntity);
