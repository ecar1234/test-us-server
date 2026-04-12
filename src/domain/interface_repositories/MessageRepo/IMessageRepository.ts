import { EntityManager } from "typeorm";
import { MessageModel } from "../../entities/MessagesModels/MessageModel.js";

export interface IMessageRepository {
    saveMessage(roomId: number, senderId: string, content: string, manager?: EntityManager): Promise<MessageModel>;
    getMessagesByRoomId(roomId: number): Promise<MessageModel[]>;
}