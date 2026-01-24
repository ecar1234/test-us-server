import { EntityManager } from "typeorm";
import { RoomType } from "../../../infrastructure/entities/MessagesEntities/RoomEntity";
import { RoomModel } from "../../entities/MessagesModels/RoomModel";

export interface IRoomRepository {
    createRoom(postId: string, targetId: string, manager?: EntityManager): Promise<RoomModel>;
    deleteRoom(roomId: number): Promise<void>;
    getRoomById(roomId: number): Promise<RoomModel>;
    getRoomsByUserId(userId: string): Promise<RoomModel[]>;
} 