import { EntityManager } from "typeorm";
import { MessageModel } from "../../entities/MessagesModels/MessageModel";

export interface IMessageRepository {
    saveMessage(roomId: number, senderId: string, content: string, manager?: EntityManager): Promise<MessageModel>;
    getMessagesByRoonId(roomId: number): Promise<MessageModel[]>;
}