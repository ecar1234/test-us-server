import { EntityManager } from "typeorm";
import { AppDataSource } from "../../../config/DataSource";
import { MessageModel } from "../../../domain/entities/MessagesModels/MessageModel";
import { IMessageRepository } from "../../../domain/interface_repositories/MessageRepo/IMessageRepository";
import { MessagesEntity } from "../../entities/MessagesEntities/MessageEntity";
import { UserEntity } from "../../entities/UserEntity";
import { RoomModel } from "../../../domain/entities/MessagesModels/RoomModel";
import { RoomMemberModel } from "../../../domain/entities/MessagesModels/RoomMenberModel";
import { RoomEntity } from "../../entities/MessagesEntities/RoomEntity";


export class MessageRepositoryImpl implements IMessageRepository {
   
    private messageAppData = AppDataSource.getRepository(MessagesEntity);
    private toDomainModelMessage(messageEntity:MessagesEntity):MessageModel{
         const room = messageEntity.room ? new RoomModel({
            id: messageEntity.room.id,
            type: messageEntity.room.type,
            post: messageEntity.room.post ? {
                postId: String(messageEntity.room.post.postId),
                images: [],
                title: messageEntity.room.post.title
            } : { postId: '', images: [], title: '' },
            targetUserId: messageEntity.room.targetUserId,
            lastMessage: null as any,
            lastMessageContent: messageEntity.room.lastMessageContent,
            lastMessageAt: messageEntity.room.lastMessageAt,
            members: [],
            messages: [],
            createdAt: messageEntity.room.createdAt
        }) : null as any;

        return new MessageModel({
            id: messageEntity.id,
            content: messageEntity.content,
            room: room,
            sender: messageEntity.sender ? {
                userId: messageEntity.sender.userId,
                nickname: messageEntity.sender.nickname,
                profileImg: messageEntity.sender.image
            } : { userId: '', nickname: '', profileImg: { url: '', filename: '', originalname: '', mimetype: '', size: 0 } },
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

        if (messageModel.room) {
            const room = new RoomEntity();
            room.id = messageModel.room.id;
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
        return this.toDomainModelMessage(message);
    }
    async getMessagesByRoonId(roomId: number): Promise<MessageModel[]> {
        const messages = await this.messageAppData.find({
            where: { room: {id: roomId} },
            relations: ['room']
        });
        return messages.map(message => this.toDomainModelMessage(message));
    }
}