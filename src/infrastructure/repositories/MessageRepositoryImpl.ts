import { AppDataSource } from "../../config/DataSource";
import { MessageModel } from "../../domain/entities/MessageModel";
import { IMessageRepository } from "../../domain/interface_repositories/IMessageRepository";
import { MessagesEntity } from "../entities/MessageEntity";
import { UserEntity } from "../entities/UserEntity";


export class MessageRepositoryImpl implements IMessageRepository {
    private messageAppData = AppDataSource.getRepository(MessagesEntity);
    private toDomainModelMessage(messageEntity:MessagesEntity):MessageModel{
        return new MessageModel(
            messageEntity.messageId,
            messageEntity.contents,
            messageEntity.createdAt,
            messageEntity.readAt,
            messageEntity.deleteSender,
            messageEntity.deleteReceiver,
            messageEntity.sender.userId,
            messageEntity.receiver.userId
        );
    };
    private toEntityMessage(messageModel: MessageModel):MessagesEntity{
        const entity = new MessagesEntity();

        entity.messageId = messageModel.id;
        entity.contents = messageModel.content;
        entity.sender = { userId : messageModel.senderId } as UserEntity;
        entity.receiver = { userId : messageModel.receiverId } as UserEntity;
        entity.createdAt = messageModel.createdAt || new Date();
        entity.readAt = messageModel.readAt || null;
        entity.deleteSender = messageModel.deleteSender || null;
        entity.deleteReceiver = messageModel.deleteReceiver || null;

        return entity;
    };

    createMessage(newMessage: MessageModel): Promise<MessageModel> {
        const message = this.toEntityMessage(newMessage);
        return this.messageAppData.save(message).then(message => {return this.toDomainModelMessage(message);});
    }
    async updateMessage(message: MessageModel): Promise<MessageModel | null> {
        const entity = this.toEntityMessage(message);
        await this.messageAppData.update(entity.messageId, entity);
        return this.messageAppData.findOne({
            where: {messageId : message.id},
            relations: ['sender', 'receiver']
        }).then(message => {
            if(!message){
                return null;
            }
            return this.toDomainModelMessage(message);
        });
    }

    getMessageById(messageId: string): Promise<MessageModel> {
        return this.messageAppData.findOne({ where: {messageId: messageId}, relations: ['sender, reciver']})
        .then(message => this.toDomainModelMessage(message));
    }
    getMessagesBySenderId(senderId: string): Promise<MessageModel[]> {
        return this.messageAppData.find({
            where: {
                sender: { userId : senderId },
                deleteSender: false
            },
            relations: ['sender', 'receiver']
        }).then(messages => messages.map(message => this.toDomainModelMessage(message)));
    }
    getMessagesByReceiverId(receiverId: string): Promise<MessageModel[]> {
        return this.messageAppData.find({
            where: {
                receiver: { userId : receiverId },
                deleteReceiver : false
            },
            relations: ['sender', 'receiver']
        }).then(messages => messages.map(message => this.toDomainModelMessage(message)));
    }
}