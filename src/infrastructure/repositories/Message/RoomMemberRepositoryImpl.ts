import { EntityManager, In } from "typeorm";
import { IRoomMemberRepository } from "../../../domain/interface_repositories/MessageRepo/IRoomMemberRepository";
import { AppDataSource } from "../../../config/DataSource";
import { RoomMemberEntity } from "../../entities/MessagesEntities/RoomMemberEntity";
import { RoomMemberModel } from "../../../domain/entities/MessagesModels/RoomMenberModel";
import { RoomEntity } from "../../entities/MessagesEntities/RoomEntity";
import { UserEntity, UserStatus } from "../../entities/UserEntity";
import { UserRepositoryImpl } from "../UserRepositoryImpl";
import { RoomRepositoryImpl } from "./RoomRepositoryImpl";
import { UserModel } from "../../../domain/entities/UserModel";
import { MessageModel } from "../../../domain/entities/MessagesModels/MessageModel";

export class RoomMemberRepositoryImpl implements IRoomMemberRepository {
    private memberData = AppDataSource.getRepository(RoomMemberEntity);

    public toDomain(entity: RoomMemberEntity): RoomMemberModel {

        const user = entity.user ? {
            userId: entity.user.userId,
            nickname: entity.user.nickname,
            profileImg: entity.user.image,
            status: entity.user.status === UserStatus.ACTIVE ? 'ACTIVE' : (UserStatus.INACTIVE ? 'INACTIVE' : 'DELETED'),
            email: entity.user.email,
            createdAt: entity.user.createdAt,
            updatedAt: entity.user.updatedAt
        } as UserModel : null;

        return new RoomMemberModel(
            {
                id: entity.id,
                userId: entity.userId,
                unreadCount: entity.unreadCount,
                lastReadMessageId: entity.lastReadMessageId,
                isActive: entity.isActive,
                roomId: entity.room.id,
                user: user,
               joinedAt: entity.joinedAt
            }
        );
    }

    async upsertMembers(roomId: number, userIds: string[], manager?: EntityManager): Promise<void> {
        const repo = manager ? manager.getRepository(RoomMemberEntity) : this.memberData;

        // 0. 입력받은 userIds 중복 제거 (동일한 ID가 두 번 들어오면 Insert 시 오류 발생)
        const uniqueUserIds = [...new Set(userIds)];

        // 1. 기존에 이미 방에 존재하는 멤버들을 한 번에 조회
        const existingMembers = await repo.find({
            where: {
                room: { id: roomId },
                userId: In(uniqueUserIds)
            }
        });

        const existingUserIds = existingMembers.map(m => m.userId);

        // 2. 새로 추가해야 할 유저 ID들 필터링
        const newUserIds = uniqueUserIds.filter(id => !existingUserIds.includes(id));

        // 3. 신규 멤버 엔티티 생성
        const newMembers = newUserIds.map(id => {
            const member = new RoomMemberEntity();
            member.room = { id: roomId } as RoomEntity; // 조회 없이 ID만 매핑 (성능 최적화)
            member.user = { userId: id } as UserEntity; // 조회 없이 ID만 매핑
            member.userId = id;
            member.unreadCount = 0;
            member.isActive = true; // 대화 시작 시 활성화
            return member;
        });

        // 4. 기존 멤버들은 다시 활성화 (나갔던 사람 복귀 처리)
        existingMembers.forEach(m => {
            m.isActive = true;
        });

        // 5. 합쳐서 한 번에 저장 (Bulk Save)
        const membersToSave = [...newMembers, ...existingMembers];
        if (membersToSave.length > 0) {
            await repo.save(membersToSave);
        }
    }

    // 메시지 전송 시: 보낸 사람을 제외한 나머지 멤버들의 unreadCount + 1
    async incrementUnreadCount(roomId: number, senderId: string, manager?: EntityManager): Promise<void> {
        const repo = manager ? manager.getRepository(RoomMemberEntity) : this.memberData;
        
        await repo.createQueryBuilder()
            .update(RoomMemberEntity)
            .set({ unreadCount: () => "unreadCount + 1" }) // DB 레벨에서 +1 연산
            .where("room = :roomId", { roomId })
            .andWhere("userId != :senderId", { senderId })
            .andWhere("isActive = :isActive", { isActive: true }) // 방에 참여 중인 사람만
            .execute();
    }

    // 방 입장/읽음 처리 시: unreadCount 초기화 및 마지막 읽은 메시지 ID 업데이트
    async updateLastRead(roomId: number, userId: string, messageId: number, manager?: EntityManager): Promise<void> {
        const repo = manager ? manager.getRepository(RoomMemberEntity) : this.memberData;
        await repo.update(
            { room: { id: roomId }, userId: userId },
            { unreadCount: 0, lastReadMessageId: messageId }
        );
    }

}