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
exports.ReviewEntity = exports.ReviewType = void 0;
const typeorm_1 = require("typeorm");
const ApplicationEntity_1 = require("./ApplicationEntity");
const UserEntity_1 = require("./UserEntity");
// 리뷰 유형을 정의하는 Enum
var ReviewType;
(function (ReviewType) {
    ReviewType["PRODUCT_RATING"] = "PRODUCT_RATING";
    ReviewType["PARTICIPANT_ATTITUDE_RATING"] = "PARTICIPANT_ATTITUDE_RATING";
})(ReviewType || (exports.ReviewType = ReviewType = {}));
let ReviewEntity = class ReviewEntity {
};
exports.ReviewEntity = ReviewEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ReviewEntity.prototype, "reviewId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], ReviewEntity.prototype, "rating", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], ReviewEntity.prototype, "comment", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ReviewType,
    }),
    __metadata("design:type", String)
], ReviewEntity.prototype, "reviewType", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ReviewEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ApplicationEntity_1.ApplicationEntity, application => application.reviews, { onDelete: 'CASCADE' }) // Application 삭제 시 관련 Review도 삭제 (옵션)
    ,
    (0, typeorm_1.JoinColumn)({ name: 'appId' }) // reviews 테이블에 'application_id' 컬럼 생성 및 외래 키로 사용
    ,
    __metadata("design:type", ApplicationEntity_1.ApplicationEntity)
], ReviewEntity.prototype, "application", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => UserEntity_1.UserEntity, user => user.givenReviews, { onDelete: 'CASCADE' }) // User 삭제 시 관련 Review도 삭제 (옵션)
    ,
    (0, typeorm_1.JoinColumn)({ name: 'reviewerUserId' }) // reviews 테이블에 'reviewer_user_id' 컬럼 생성 및 외래 키로 사용
    ,
    __metadata("design:type", UserEntity_1.UserEntity)
], ReviewEntity.prototype, "reviewer", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => UserEntity_1.UserEntity, user => user.receivedReviews, { onDelete: 'CASCADE' }) // User 삭제 시 관련 Review도 삭제 (옵션)
    ,
    (0, typeorm_1.JoinColumn)({ name: 'reviewedUserId' }) // reviews 테이블에 'reviewed_user_id' 컬럼 생성 및 외래 키로 사용
    ,
    __metadata("design:type", UserEntity_1.UserEntity)
], ReviewEntity.prototype, "reviewed", void 0);
exports.ReviewEntity = ReviewEntity = __decorate([
    (0, typeorm_1.Entity)('Review'),
    (0, typeorm_1.Unique)(['application', 'reviewer', 'reviewed'])
], ReviewEntity);
