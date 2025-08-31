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
exports.MessageRepositoryImpl = void 0;
const DataSource_1 = require("../../config/DataSource");
const MessageModel_1 = require("../../domain/entities/MessageModel");
const MessageEntity_1 = require("../entities/MessageEntity");
class MessageRepositoryImpl {
    constructor() {
        this.messageAppData = DataSource_1.AppDataSource.getRepository(MessageEntity_1.MessagesEntity);
    }
    toDomainModelMessage(messageEntity) {
        return new MessageModel_1.MessageModel(messageEntity.messageId, messageEntity.contents, messageEntity.createdAt, messageEntity.readAt, messageEntity.deleteSender, messageEntity.deleteReceiver, messageEntity.sender.userId, messageEntity.receiver.userId);
    }
    ;
    toEntityMessage(messageModel) {
        const entity = new MessageEntity_1.MessagesEntity();
        entity.messageId = messageModel.id;
        entity.contents = messageModel.content;
        entity.sender = { userId: messageModel.senderId };
        entity.receiver = { userId: messageModel.receiverId };
        entity.createdAt = messageModel.createdAt || new Date();
        entity.readAt = messageModel.readAt || null;
        entity.deleteSender = messageModel.deleteSender || null;
        entity.deleteReceiver = messageModel.deleteReceiver || null;
        return entity;
    }
    ;
    createMessage(newMessage) {
        const message = this.toEntityMessage(newMessage);
        return this.messageAppData.save(message).then(message => { return this.toDomainModelMessage(message); });
    }
    updateMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const entity = this.toEntityMessage(message);
            yield this.messageAppData.update(entity.messageId, entity);
            return this.messageAppData.findOne({
                where: { messageId: message.id },
                relations: ['sender', 'receiver']
            }).then(message => {
                if (!message) {
                    return null;
                }
                return this.toDomainModelMessage(message);
            });
        });
    }
    getMessageById(messageId) {
        return this.messageAppData.findOne({ where: { messageId: messageId }, relations: ['sender, reciver'] })
            .then(message => this.toDomainModelMessage(message));
    }
    getMessagesBySenderId(senderId) {
        return this.messageAppData.find({
            where: {
                sender: { userId: senderId },
                deleteSender: false
            },
            relations: ['sender', 'receiver']
        }).then(messages => messages.map(message => this.toDomainModelMessage(message)));
    }
    getMessagesByReceiverId(receiverId) {
        return this.messageAppData.find({
            where: {
                receiver: { userId: receiverId },
                deleteReceiver: false
            },
            relations: ['sender', 'receiver']
        }).then(messages => messages.map(message => this.toDomainModelMessage(message)));
    }
}
exports.MessageRepositoryImpl = MessageRepositoryImpl;
