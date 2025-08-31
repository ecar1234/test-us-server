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
exports.MessageUseCase = void 0;
class MessageUseCase {
    constructor(messageRepo) {
        this.messageRepo = messageRepo;
    }
    sendMessage(newMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.messageRepo.createMessage(newMessage);
        });
    }
    updateReadAt(messageId, readAt) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = yield this.messageRepo.getMessageById(messageId);
            message.readAt = readAt;
            const updateResult = yield this.messageRepo.updateMessage(message);
            return [updateResult, updateResult ? 'update successed' : 'update failed'];
        });
    }
    getSendMessageList(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.messageRepo.getMessagesBySenderId(userId);
        });
    }
    getReceiveMessageList(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.messageRepo.getMessagesByReceiverId(userId);
        });
    }
    deleteMessage(messageId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = yield this.messageRepo.getMessageById(messageId);
            if (message.senderId === userId) {
                message.deleteSender = true;
            }
            else {
                message.deleteReceiver = true;
            }
            const result = yield this.messageRepo.updateMessage(message);
            return result.deleteSender ? this.messageRepo.getMessagesBySenderId(userId)
                : this.messageRepo.getMessagesByReceiverId(userId);
        });
    }
}
exports.MessageUseCase = MessageUseCase;
