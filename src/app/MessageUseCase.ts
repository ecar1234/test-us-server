import { MessageModel } from "../domain/entities/MessagesModels/MessageModel.js";
import { RoomModel } from "../domain/entities/MessagesModels/RoomModel.js";
import { MessageRepositoryImpl } from "../infrastructure/repositories/Message/MessageRepositoryImpl.js";
import { RoomMemberRepositoryImpl } from "../infrastructure/repositories/Message/RoomMemberRepositoryImpl.js";
import { RoomRepositoryImpl } from "../infrastructure/repositories/Message/RoomRepositoryImpl.js";
import { TypeOrmUnitOfWork } from "../infrastructure/repositories/Message/UnitOfWorkImpl.js";

export class MessageUseCase {
    constructor(
        private messageRepo: MessageRepositoryImpl,
        private roomRepo: RoomRepositoryImpl,
        private roomMemberRepo: RoomMemberRepositoryImpl,
        private unitOfWork: TypeOrmUnitOfWork
    ) { }

    // room 
    async getRoomList(userId: string): Promise<RoomModel[]> {
        const rooms = await this.roomRepo.getRoomsByUserId(userId);
        if (!rooms) {
            return [];
        }

        const validRooms = rooms.filter(room => {
            const isMember = room.members.some(member => member.userId === userId);
            return isMember;
        });

        return validRooms;
    }

    async getRoomById(roomId: number): Promise<RoomModel> {
        const room = await this.roomRepo.getRoomById(Number(roomId));
        return room;
    }


    async getMessageByPostId(postId: string, targetId: string): Promise<MessageModel[] | null> {
        try {
            const room = await this.roomRepo.getRoomInfoByPostId(postId, targetId);
            if (!room) {
                return [];
            }
            const messages = await this.messageRepo.getMessagesByRoomId(room.id);
            const sender = room.members.filter((member) => member.user.userId !== targetId);
            if (sender.length > 0) {
                await this.markAsRead(room.id, sender[0].userId);
                await this.roomMemberRepo.updateLastRead(room.id, sender[0].userId, messages[messages.length - 1].id);
            }else {
                return null;
            }

            return messages;
        } catch (error) {
            console.log('[MessageUseCase] getMessageByPostId: ', error);
            throw error;
        }
    }

    // member

    async resetUnreadCount(roomId: number, userId: string): Promise<RoomModel> {
        // 1. 별도의 조회 없이 바로 업데이트 (효율성)
        await this.roomMemberRepo.resetUnreadCount(roomId, userId);
        // 2. 업데이트된 방 정보를 조회하여 리턴
        return await this.getRoomById(roomId);
    }
    async removeMemberOnRoom(roomId: number, userId: string): Promise<RoomModel | null> {
        try {
            const res = await this.roomMemberRepo.removeMemberOnRoom(roomId, userId);
            if (!res) {
                throw new Error('Failed to remove member from room');
            }
            const room = await this.getRoomById(roomId);
            if (room.members.length === 0) {
                await this.roomRepo.deleteRoom(roomId);
                return null;
            }
            return room;
        } catch (error) {
            console.log('[MessageUseCase] removeMemberOnRoom: ', error);
            throw new Error('Failed to remove member from room');
        }

    }


    // message

    async sendMessage(roomId: number | null, postId: string, senderId: string, targetId: string, content: string): Promise<MessageModel> {
        return this.unitOfWork.runInTransaction(async (manager) => {
            let room;
            try {
                if (roomId) {
                    room = await this.roomRepo.getRoomById(roomId);
                }
                if (!room) {
                    room = await this.roomRepo.createRoom(postId, targetId, manager);
                    await this.roomMemberRepo.upsertMembers(room.id, [senderId, targetId], manager);
                }
            } catch (error) {
                console.error('[MessageUseCase] Failed to find or create room:', error);
                throw error;
            }

            let message: MessageModel;
            try {
                message = await this.messageRepo.saveMessage(room.id, senderId, content, manager);
            } catch (error) {
                // 주로 여기서 messageId AUTO_INCREMENT 누락으로 인한 에러가 발생합니다.
                console.error('[MessageUseCase] Failed to save message (Check DB AUTO_INCREMENT):', error);
                throw error;
            }

            try {
                await this.roomRepo.updateLastMessage(room.id, message, manager);

                // 3. 나를 제외한 모든 멤버의 unreadCount + 1 증가
                await this.roomMemberRepo.incrementUnreadCount(room.id, senderId, manager);
            } catch (error) {
                console.error('[MessageUseCase] Failed to update room stats:', error);
                throw error;
            }

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
    async getMessageByRoomId(roomId: number, userId: string): Promise<MessageModel[]> {
        const messages = await this.messageRepo.getMessagesByRoomId(roomId);
        const room = await this.getRoomById(roomId);
        if (room) {
            await this.roomMemberRepo.updateLastRead(room.id, userId, messages[messages.length - 1].id);
            await this.markAsRead(room.id, userId);
        }

        return messages;
    }
}