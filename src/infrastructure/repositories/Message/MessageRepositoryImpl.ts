import { EntityManager } from "typeorm";
import { AppDataSource } from "../../../config/DataSource.js";
import { MessageModel } from "../../../domain/entities/MessagesModels/MessageModel.js";
import { IMessageRepository } from "../../../domain/interface_repositories/MessageRepo/IMessageRepository.js";
import { MessagesEntity } from "../../entities/MessagesEntities/MessageEntity.js";
import { UserEntity, UserStatus } from "../../entities/UserEntity.js";
import { RoomEntity } from "../../entities/MessagesEntities/RoomEntity.js";


export class MessageRepositoryImpl implements IMessageRepository {
    private messageAppData = AppDataSource.getRepository(MessagesEntity);
    public toDomainModelMessage(messageEntity:MessagesEntity):MessageModel{
        return new MessageModel({
            id: messageEntity.id,
            content: messageEntity.content,
            roomId: messageEntity.room.id,
            sender: messageEntity.sender ? {
                userId: messageEntity.sender.userId,
                nickname: messageEntity.sender.nickname,
                profileImg: messageEntity.sender.image,
                status: messageEntity.sender.status === UserStatus.ACTIVE ? 'ACTIVE' : (UserStatus.INACTIVE ? 'INACTIVE' : 'DELETED')
            } : { userId: '', nickname: '', profileImg: { url: '', filename: '', originalname: '', mimetype: '', size: 0 }, status: ''},
            createdAt: messageEntity.createdAt
        });
    };
    private toEntityMessage(messageModel: MessageModel):MessagesEntity{
        const entity = new MessagesEntity();
       if (messageModel.id) {
            entity.id = messageModel.id;
        }
        entity.content = messageModel.content;
        entity.createdAt = messageModel.createdAt;

        if (messageModel.roomId) {
            const room = new RoomEntity();
            room.id = messageModel.roomId;
            entity.room = room;
        }

        if (messageModel.sender) {
            const sender = new UserEntity();
            sender.userId = messageModel.sender.userId;
            entity.sender = sender;
        }
        return entity;
    };

   async saveMessage(roomId: number, senderId: string, content: string, manager?: EntityManager): Promise<MessageModel> {
        const messageRepo = manager ? manager.getRepository(MessagesEntity) : this.messageAppData;
        const message = new MessagesEntity();
        message.content = content;
        message.room = { id: roomId } as RoomEntity;
        message.sender = { userId: senderId } as UserEntity;
        await messageRepo.save(message);
        const savedMessage = await messageRepo.findOne({
            where: { id: message.id },
            relations: ['room', 'sender']
        });
        
        return this.toDomainModelMessage(savedMessage);
    }
    async getMessagesByRoomId(roomId: number): Promise<MessageModel[]> {
        const messages = await this.messageAppData.find({
            where: { room: {id: roomId} },
            relations: ['room', 'sender', 'room.members']
        });
        if(!messages){
            return [];
        }
        return messages.map(message => this.toDomainModelMessage(message));
    }
}