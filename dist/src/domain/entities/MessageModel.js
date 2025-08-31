"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageModel = void 0;
class MessageModel {
    constructor(id, content, createdAt = new Date(), readAt, deleteSender, deleteReceiver = false, senderId, receiverId) {
        this.id = id;
        this.content = content;
        this.createdAt = createdAt;
        this.readAt = readAt;
        this.deleteSender = deleteSender;
        this.deleteReceiver = deleteReceiver;
        this.senderId = senderId;
        this.receiverId = receiverId;
    }
}
exports.MessageModel = MessageModel;
