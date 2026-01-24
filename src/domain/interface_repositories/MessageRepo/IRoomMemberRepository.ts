import { EntityManager } from "typeorm";

export interface IRoomMemberRepository {
    upsertMembers(roomId: number, members: string[], manager?: EntityManager): Promise<void>;
}