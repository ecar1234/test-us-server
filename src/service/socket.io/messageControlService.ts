import Redis from "ioredis";
import { FirebaseRepositoryImpl } from "../../infrastructure/repositories/FirebaseRepositoryImpl";
import { MessageModel } from "../../domain/entities/MessagesModels/MessageModel";
import { Server } from "socket.io";
import { sendNotificationToUser } from "../firebase/FcmService";
import { notificationHandler } from "./handlers/notificationHandler";

export class MessageControlService {
    constructor(
        private fmcRepo: FirebaseRepositoryImpl,
        private cacheClient: Redis,
        private io: Server
    ) { }

    async firstMessage(message: MessageModel, targetId: string): Promise<void> {
        const socketId = await this.cacheClient.get(`online${targetId}`);
        if (socketId) {
            this.io.to(`user_${targetId}`).emit("chat_message", message);
            this.io.to(`user_${message.sender.userId}`).emit("chat_mwssage", message);
            console.log('[Socket] delivery to only users');
        }
        else {
            this.io.to(`user_${message.sender.userId}`).emit("chat_mwssage", message);
            console.log('[Socket] first delivery to sender');
            const token = await this.fmcRepo.getMessingToken(targetId);
            if (token) {
                await notificationHandler(token, message);
            } else {
                console.log('[FCM] Token not found');
                return;
            }
        }
    }
    async messageDeilvery(message: MessageModel, targetId: string): Promise<void> {
        const socketId = await this.cacheClient.get(`online${targetId}`);
        
        this.io.to(`user_${message.sender.userId}`).emit("chat_message", message);
        console.log('[Socket] delivery to sender');
        
        if (socketId) {
            this.io.to(`user_${targetId}`).emit("chat_message", message);
            this.io.to(`room_${message.roomId}`).emit("chat_message", message);
            console.log('[Socket] delivery to target & room');
        }else {
            // this.io.to(`user_${message.sender.userId}`).emit("chat_message", message);
            const token = await this.fmcRepo.getMessingToken(targetId);
            if (token) {
                await notificationHandler(token, message);
                console.log('[FCM] sent notification');
            } else {
                console.log('[FCM] Token not found');
            }
        }
    }
}