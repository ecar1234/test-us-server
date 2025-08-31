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
exports.PostEntity = exports.PostStatusType = void 0;
const typeorm_1 = require("typeorm");
const UserEntity_1 = require("./UserEntity");
const ApplicationEntity_1 = require("./ApplicationEntity");
var PostStatusType;
(function (PostStatusType) {
    PostStatusType["ACTIVE"] = "active";
    PostStatusType["END"] = "end";
    PostStatusType["EXPIRED"] = "expired";
    PostStatusType["DELETE"] = "delete";
})(PostStatusType || (exports.PostStatusType = PostStatusType = {}));
let PostEntity = class PostEntity {
};
exports.PostEntity = PostEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], PostEntity.prototype, "postId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => UserEntity_1.UserEntity, user => user.posts, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'authorId' }),
    __metadata("design:type", UserEntity_1.UserEntity)
], PostEntity.prototype, "author", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { length: 30 }),
    __metadata("design:type", String)
], PostEntity.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { length: 100 }),
    __metadata("design:type", String)
], PostEntity.prototype, "subtitle", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'simple-array', nullable: false }),
    __metadata("design:type", Array)
], PostEntity.prototype, "platform", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], PostEntity.prototype, "contents", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: PostStatusType, default: 'active' }),
    __metadata("design:type", String)
], PostEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { default: 7 }),
    __metadata("design:type", Number)
], PostEntity.prototype, "period", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], PostEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], PostEntity.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ApplicationEntity_1.ApplicationEntity, application => application.post),
    __metadata("design:type", Array)
], PostEntity.prototype, "applications", void 0);
exports.PostEntity = PostEntity = __decorate([
    (0, typeorm_1.Entity)('Post')
], PostEntity);
