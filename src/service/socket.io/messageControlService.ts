import Redis from "ioredis";
import { FirebaseRepositoryImpl } from "../../infrastructure/repositories/FirebaseRepositoryImpl";
import { MessageModel } from "../../domain/entities/MessagesModels/MessageModel";
import { Server } from "socket.io";
import { notificationHandler } from "../firebase/notificationHandler";

export class MessageControlService {
    constructor(
        private fmcRepo: FirebaseRepositoryImpl,
        private cacheClient: Redis,
        private io: Server
    ) { }

    async firstMessage(message: MessageModel, targetId: string): Promise<void> {
        try {
            // const socketId = await this.cacheClient.get(`online${targetId}`);
            this.io.to(`user_${targetId}`).emit("chat_message", message);
            // this.io.to(`user_${message.sender.userId}`).emit("chat_mwssage", message);
            // console.log('[Socket] delivery to only users');
            // this.io.to(`user_${message.sender.userId}`).emit("chat_mwssage", message);
            console.log('[Socket] first delivery to sender');

            const token = await this.fmcRepo.getMessingToken(targetId);
            if (token) {
                await notificationHandler(token, message);
            } else {
                console.log('[FCM] Token not found');
                return;
            }
            // if (socketId) {
            // }
            // else {
            // }
        } catch (error) {
            console.log(error);
            return;
        }
    }
    async messageDeilvery(message: MessageModel, targetId: string): Promise<void> {
        const socketId = await this.cacheClient.get(`online${targetId}`);

        this.io.to(`user_${message.sender.userId}`).emit("chat_message", message);
        this.io.to(`room_${message.roomId}`).emit("chat_message", message);
        console.log('[Socket] delivery to sender');

        if (socketId) {
            this.io.to(`user_${targetId}`).emit("chat_message", message);
            console.log('[Socket] delivery to target & room');
        } else {
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