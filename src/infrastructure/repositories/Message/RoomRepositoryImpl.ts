import { EntityManager } from "typeorm";
import { AppDataSource } from "../../../config/DataSource";
import { RoomModel } from "../../../domain/entities/MessagesModels/RoomModel";
import { IRoomRepository } from "../../../domain/interface_repositories/MessageRepo/IRoomRepository";
import { RoomEntity, RoomType } from "../../entities/MessagesEntities/RoomEntity";
import { BasePostEntity } from "../../entities/BasePostEntity";
import { ImagesModel } from "../../../domain/entities/ImagesModel";
import { RoomMemberRepositoryImpl } from "./RoomMemberRepositoryImpl";
import { MessageRepositoryImpl } from "./MessageRepositoryImpl";
import { MessageModel } from "../../../domain/entities/MessagesModels/MessageModel";
import { MessagesEntity } from "../../entities/MessagesEntities/MessageEntity";

export class RoomRepositoryImpl implements IRoomRepository {

    private memberRepo: RoomMemberRepositoryImpl;
    private messageRepo: MessageRepositoryImpl;
    constructor() {
        this.memberRepo = new RoomMemberRepositoryImpl,
            this.messageRepo = new MessageRepositoryImpl
    }

    private roomData = AppDataSource.getRepository(RoomEntity);

    private toDomain(entity: RoomEntity): RoomModel {
        const lastMessage = entity.lastMessage ? this.messageRepo.toDomainModelMessage(entity.lastMessage) : null;
        const messages = entity.messages ? entity.messages.map(message => this.messageRepo.toDomainModelMessage(message)) : [];
        const members = entity.members ? entity.members.map(member => this.memberRepo.toDomain(member)) : [];
        return new RoomModel({
            id: entity.id,
            type: entity.type,
            post: entity.post ? {
                id: entity.post.postId,
                images: entity.post.images,
                title: entity.post.title
            } : { id: '', images: [], title: '' },
            targetUserId: entity.targetUserId,
            lastMessage: lastMessage,
            lastMessageContent: entity.lastMessageContent,
            lastMessageAt: entity.lastMessageAt,
            members: members,
            messages: messages,
            createdAt: entity.createdAt
        });
    }

    async createRoom(postId: string, targetId: string, manager?: EntityManager): Promise<RoomModel> {
        const roomRepo = manager ? manager.getRepository(RoomEntity) : this.roomData;

        const room = new RoomEntity();
        room.type = RoomType.DM;
        room.post = { postId: postId } as BasePostEntity;
        room.targetUserId = targetId;

        await roomRepo.save(room);
        return this.toDomain(room);
    }

    async updateLastMessage(roomId: number, message: MessageModel, manager?: EntityManager): Promise<void> {
        const roomData = manager ? manager.getRepository(RoomEntity) : this.roomData;
        const room = await roomData.findOne({
            where: { id: roomId },
            relations: ['messages']
        });

        room.lastMessage = {id : message.id} as MessagesEntity;
        room.lastMessageContent = message.content;
        room.lastMessageAt = message.createdAt;

        await roomData.save(room);
    }
    async deleteRoom(roomId: number): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async getRoomById(roomId: number): Promise<RoomModel> {
        const room = await this.roomData.findOne({
            where: { id: roomId },
            relations: ['post', 'members', 'members.user', 'members.room', 'messages', 'messages.sender', 'messages.room']
        });
        if (!room) {
            return null;
        }
        return this.toDomain(room);
    }
    async getRoomsByUserId(userId: string): Promise<RoomModel[]> {
        const rooms = await this.roomData.find({
            where: { targetUserId: userId },
            relations: ['post', 'members', 'members.user', 'members.room', 'messages', 'messages.sender', 'messages.room']
        });
        return rooms.map(room => this.toDomain(room));
    }
    async getMessagesByPostId(postId: string, targetId: string): Promise<MessageModel[]> {
        const room = await this.roomData.findOne({
            where: { post: { postId: postId }, targetUserId: targetId },
            relations: ['messages', 'messages.sender', 'messages.room']
        });
        if (!room) {
            return [];
        }
        const messages = room.messages;
        return messages.map(message => this.messageRepo.toDomainModelMessage(message));
    }

}