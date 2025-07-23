import { MessageModel } from "../domain/entities/MessageModel";
import { MessageRepositoryImpl } from "../infrastructure/repositories/MessageRepositoryImpl";

export class MessageUseCase {
    constructor(
        private messageRepo: MessageRepositoryImpl
    ){}

    async sendMessage(newMessage: MessageModel):Promise<MessageModel>{
        return this.messageRepo.createMessage(newMessage);
    }
    async updateReadAt(messageId:string, readAt:Date):Promise<[MessageModel | null, string]>{
        const message:MessageModel = await this.messageRepo.getMessageById(messageId);
        message.readAt = readAt;
        const updateResult = await this.messageRepo.updateMessage(message);
        return [updateResult, updateResult ? 'update successed' : 'update failed'];
    }
    async getSendMessageList(userId:string):Promise<MessageModel[]>{
        return this.messageRepo.getMessagesBySenderId(userId);
    }
    async getReceiveMessageList(userId:string):Promise<MessageModel[]>{
        return this.messageRepo.getMessagesByReceiverId(userId);
    }
    async deleteMessage(messageId: string, userId:string):Promise<MessageModel[]>{
        const message:MessageModel = await this.messageRepo.getMessageById(messageId);
        if(message.senderId === userId){
            message.deleteSender = true;
        }else {
            message.deleteReceiver = true;
        }

        const result: MessageModel = await this.messageRepo.updateMessage(message);

        return result.deleteSender ? this.messageRepo.getMessagesBySenderId(userId)
        : this.messageRepo.getMessagesByReceiverId(userId);
        
    }
}