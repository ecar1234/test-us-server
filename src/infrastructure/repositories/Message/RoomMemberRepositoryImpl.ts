import { EntityManager, In } from "typeorm";
import { IRoomMemberRepository } from "../../../domain/interface_repositories/MessageRepo/IRoomMemberRepository";
import { AppDataSource } from "../../../config/DataSource";
import { RoomMemberEntity } from "../../entities/MessagesEntities/RoomMemberEntity";
import { RoomMemberModel } from "../../../domain/entities/MessagesModels/RoomMenberModel";
import { RoomEntity } from "../../entities/MessagesEntities/RoomEntity";
import { UserEntity } from "../../entities/UserEntity";

export class RoomMemberRepositoryImpl implements IRoomMemberRepository {
    private memberData = AppDataSource.getRepository(RoomMemberEntity);

    async upsertMembers(roomId: number, userIds: string[], manager?: EntityManager): Promise<void> {
        const repo = manager ? manager.getRepository(RoomMemberEntity) : this.memberData;

        // 1. 기존에 이미 방에 존재하는 멤버들을 한 번에 조회
        const existingMembers = await repo.find({
            where: {
                room: { id: roomId },
                userId: In(userIds)
            }
        });

        const existingUserIds = existingMembers.map(m => m.userId);

        // 2. 새로 추가해야 할 유저 ID들 필터링
        const newUserIds = userIds.filter(id => !existingUserIds.includes(id));

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
        await repo.save([...newMembers, ...existingMembers]);
    }

}