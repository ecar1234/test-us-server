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
exports.MessagesEntity = void 0;
const typeorm_1 = require("typeorm");
const UserEntity_1 = require("./UserEntity");
let MessagesEntity = class MessagesEntity {
};
exports.MessagesEntity = MessagesEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], MessagesEntity.prototype, "messageId", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], MessagesEntity.prototype, "contents", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], MessagesEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], MessagesEntity.prototype, "readAt", void 0);
__decorate([
    (0, typeorm_1.Column)('boolean', { default: false }),
    __metadata("design:type", Boolean)
], MessagesEntity.prototype, "deleteSender", void 0);
__decorate([
    (0, typeorm_1.Column)('boolean', { default: false }),
    __metadata("design:type", Boolean)
], MessagesEntity.prototype, "deleteReceiver", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => UserEntity_1.UserEntity, user => user.sentMessages, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'senderUserId' }),
    __metadata("design:type", UserEntity_1.UserEntity)
], MessagesEntity.prototype, "sender", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => UserEntity_1.UserEntity, user => user.receiveMessages, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'receiverUserId' }),
    __metadata("design:type", UserEntity_1.UserEntity)
], MessagesEntity.prototype, "receiver", void 0);
exports.MessagesEntity = MessagesEntity = __decorate([
    (0, typeorm_1.Entity)('Messages'),
    (0, typeorm_1.Unique)(['messageId'])
], MessagesEntity);
