import { EntityManager } from "typeorm";
import { AppDataSource } from "../../../config/DataSource";
import { RoomModel } from "../../../domain/entities/MessagesModels/RoomModel";
import { IRoomRepository } from "../../../domain/interface_repositories/MessageRepo/IRoomRepository";
import { RoomEntity, RoomType } from "../../entities/MessagesEntities/RoomEntity";
import { BasePostEntity } from "../../entities/BasePostEntity";
import { ImagesModel } from "../../../domain/entities/ImagesModel";

export class RoomRepositoryImpl implements IRoomRepository {
    
    private roomData = AppDataSource.getRepository(RoomEntity);

    private toDomain(entity: RoomEntity): RoomModel {
        const postImage: ImagesModel[] = entity.post.images.map(image => {
            return new ImagesModel(
                null,
                image.filename,
                image.originalname,
                image.mimetype,
                image.size,
                image.url,
                null,
                null
            );
        }
        );

        return new RoomModel({
            id: entity.id,
            type: entity.type,
            post: entity.post ? {
                postId: String(entity.post.postId),
                images: postImage,
                title: entity.post.title
            } : { postId: '', images: [], title: '' },
            targetUserId: entity.targetUserId,
            lastMessage: null as any,
            lastMessageContent: entity.lastMessageContent,
            lastMessageAt: entity.lastMessageAt,
            members: [],
            messages: [],
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
    async deleteRoom(roomId: number): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async getRoomById(roomId: number): Promise<RoomModel> {
        throw new Error("Method not implemented.");
    }
    async getRoomsByUserId(userId: string): Promise<RoomModel[]> {
        const rooms = await this.roomData.find({
            where: { post: { author: { userId: userId }}},
            relations: ['post']
        });
        return rooms.map(room => this.toDomain(room));
    }

}