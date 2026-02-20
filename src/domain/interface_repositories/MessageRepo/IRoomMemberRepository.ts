import { EntityManager } from "typeorm";

export interface IRoomMemberRepository {
    upsertMembers(roomId: number, members: string[], manager?: EntityManager): Promise<void>;
    resetUnreadCount(roomId: number, userId: string): Promise<void>;
    removeMemberOnRoom(roomId: number, userId: string): Promise<boolean>;
}