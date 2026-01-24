import { MessageModel } from "../domain/entities/MessagesModels/MessageModel";
import { RoomModel } from "../domain/entities/MessagesModels/RoomModel";
import { MessageRepositoryImpl } from "../infrastructure/repositories/Message/MessageRepositoryImpl";
import { RoomMemberRepositoryImpl } from "../infrastructure/repositories/Message/RoomMemberRepositoryImpl";
import { RoomRepositoryImpl } from "../infrastructure/repositories/Message/RoomRepositoryImpl";
import { TypeOrmUnitOfWork } from "../infrastructure/repositories/Message/UnitOfWorkImpl";

export class MessageUseCase {
    constructor(
        private messageRepo: MessageRepositoryImpl,
        private roomRepo: RoomRepositoryImpl,
        private roomMemberRepo: RoomMemberRepositoryImpl,
        private unitOfWork: TypeOrmUnitOfWork
    ){}

    // room 
    async getRoomList(userId: string): Promise<RoomModel[]> {
        const rooms = await this.roomRepo.getRoomsByUserId(userId);

        if(!rooms){
            return [];
        }

        return rooms;
    }

    async sendMessage(roomId: number | null, postId: string, senderId: string, targetId: string, content: string): Promise<MessageModel> {
        return this.unitOfWork.runInTransaction(async (manager) => {
           let room;
           if(roomId){
            room = await this.roomRepo.getRoomById(roomId);
           }
           if(!room){
            room = await this.roomRepo.createRoom(postId, targetId, manager);

            await this.roomMemberRepo.upsertMembers(room.id, [senderId, targetId], manager);
           }

           const message = await this.messageRepo.saveMessage(room.id, senderId, content, manager);
           return message;
        });

    }
    async markAsRead(roomId: number, userId: string): Promise<void> {

    }

}