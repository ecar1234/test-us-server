import { EntityManager } from "typeorm";
import { RoomModel } from "../../entities/MessagesModels/RoomModel.js";

export interface IRoomRepository {
    createRoom(postId: string, targetId: string, manager?: EntityManager): Promise<RoomModel>;
    deleteRoom(roomId: number): Promise<void>;
    getRoomById(roomId: number): Promise<RoomModel>;
    getRoomsByUserId(userId: string): Promise<RoomModel[]>;
    getRoomInfoByPostId(postId: string, targetId: string): Promise<RoomModel>;
} 