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

    async getMessageByPostId(postId: string, targetId: string): Promise<MessageModel[]> {
        const messages = await this.roomRepo.getMessagesByPostId(postId, targetId);
        messages.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        return messages;
    }

    // message

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
           await this.roomRepo.updateLastMessage(room.id, message, manager);
           
           // 3. 나를 제외한 모든 멤버의 unreadCount + 1 증가
           await this.roomMemberRepo.incrementUnreadCount(room.id, senderId, manager);

           return message;
        });

    }
    async markAsRead(roomId: number, userId: string): Promise<void> {
        // 해당 방의 메시지들을 가져와서 가장 마지막 메시지 ID를 찾음
        const messages = await this.messageRepo.getMessagesByRoomId(roomId);
        if (messages && messages.length > 0) {
            const lastMessage = messages[messages.length - 1];
            await this.roomMemberRepo.updateLastRead(roomId, userId, lastMessage.id);
        }
    }
    async getMessageByRoomId(roomId: number): Promise<MessageModel[]> {
        const messages = await this.messageRepo.getMessagesByRoomId(roomId);
        messages.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        return messages;
    }
}