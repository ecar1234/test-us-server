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
exports.ApplicationEntity = exports.ApplicationsPlatform = exports.ApplicationStatus = void 0;
const typeorm_1 = require("typeorm");
const PostEntity_1 = require("./PostEntity");
const UserEntity_1 = require("./UserEntity");
const ReviewEntiry_1 = require("./ReviewEntiry");
// 신청 상태를 정의하는 Enum
var ApplicationStatus;
(function (ApplicationStatus) {
    ApplicationStatus["PENDING"] = "pending";
    ApplicationStatus["ACCEPTED"] = "accepted";
    ApplicationStatus["REJECTED"] = "rejected";
    ApplicationStatus["CANCEL"] = "cancel";
})(ApplicationStatus || (exports.ApplicationStatus = ApplicationStatus = {}));
var ApplicationsPlatform;
(function (ApplicationsPlatform) {
    ApplicationsPlatform["WEB"] = "web";
    ApplicationsPlatform["IOS"] = "ios";
    ApplicationsPlatform["ANDROID"] = "android";
})(ApplicationsPlatform || (exports.ApplicationsPlatform = ApplicationsPlatform = {}));
let ApplicationEntity = class ApplicationEntity {
};
exports.ApplicationEntity = ApplicationEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment'),
    __metadata("design:type", Number)
], ApplicationEntity.prototype, "appId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ApplicationsPlatform, default: ApplicationsPlatform.WEB }),
    __metadata("design:type", String)
], ApplicationEntity.prototype, "platform", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ApplicationStatus,
        default: ApplicationStatus.PENDING,
    }),
    __metadata("design:type", String)
], ApplicationEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ApplicationEntity.prototype, "appliedAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], ApplicationEntity.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => PostEntity_1.PostEntity, post => post.applications, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'postId' }),
    __metadata("design:type", PostEntity_1.PostEntity
    // 신청 유저의 승인 상테
    )
], ApplicationEntity.prototype, "post", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => UserEntity_1.UserEntity, user => user.applications, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'appUserId' }),
    __metadata("design:type", UserEntity_1.UserEntity)
], ApplicationEntity.prototype, "applicant", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ReviewEntiry_1.ReviewEntity, review => review.application),
    __metadata("design:type", Array)
], ApplicationEntity.prototype, "reviews", void 0);
exports.ApplicationEntity = ApplicationEntity = __decorate([
    (0, typeorm_1.Entity)('Application'),
    (0, typeorm_1.Unique)(['post', 'applicant'])
], ApplicationEntity);
