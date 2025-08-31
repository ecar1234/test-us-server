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
exports.MessageController = void 0;
const MessageModel_1 = require("../../domain/entities/MessageModel");
class MessageController {
    constructor(messageUseCase) {
        this.messageUseCase = messageUseCase;
    }
    sendMessage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { content, senderId, receiverId } = req.body;
            const newMessage = new MessageModel_1.MessageModel(null, content, new Date(), null, false, false, senderId, receiverId);
            const result = yield this.messageUseCase.sendMessage(newMessage);
            res.status(200).json({ sendData: result });
        });
    }
    getMessage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { messageId, readAtDate } = req.body;
            const readAt = new Date(readAtDate);
            const result = yield this.messageUseCase.updateReadAt(messageId, readAt);
            res.status(result[0] ? 200 : 404).json({ result: result[0], message: result[1] });
        });
    }
    getAllSendMessage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const senderId = req.params.userId;
            const result = yield this.messageUseCase.getSendMessageList(senderId);
            res.status(200).json({ sendMessageList: result });
        });
    }
    getAllReceiveMessage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const receiverId = req.params.userId;
            const result = yield this.messageUseCase.getReceiveMessageList(receiverId);
            res.status(200).json({ receiveMessageList: result });
        });
    }
    deleteMessage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { messageId, userId } = req.body;
            const result = yield this.messageUseCase.deleteMessage(messageId, userId);
            res.status(200).json({ messageList: result });
        });
    }
}
exports.MessageController = MessageController;
