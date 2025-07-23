import { MessageModel } from "../entities/MessageModel";

export interface IMessageRepository {
    createMessage(newMessage : MessageModel):Promise<MessageModel>;
    updateMessage(message: MessageModel):Promise<MessageModel | null>
    getMessageById(messageId: string): Promise<MessageModel>;
    getMessagesBySenderId(senderId: string): Promise<MessageModel[]>;
    getMessagesByReceiverId(receiverId: string): Promise<MessageModel[]>;
}