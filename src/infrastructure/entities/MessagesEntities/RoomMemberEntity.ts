import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { RoomEntity } from "./RoomEntity";
import { UserEntity } from "../UserEntity";

@Entity('room_members')
@Unique(['userId'])
export class RoomMemberEntity {
    @PrimaryGeneratedColumn()
    id: number;

    // 관계 유지: 유저 정보(닉네임, 프로필 등) 조회용
    @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
    user: UserEntity;

    @Column()
    userId: string; // ID만 따로 쓸 수 있도록 노출

    @ManyToOne(() => RoomEntity, (chatRoom) => chatRoom.members, { onDelete: 'CASCADE' })
    room: RoomEntity;

    /**
     * [성능] 안 읽은 메시지 수 관리
     */
    @Column({ default: 0 })
    unreadCount: number; // 새 메시지 시 +1, 방 입장 시 0으로 초기화

    @Column({ nullable: true })
    lastReadMessageId: number; // 유저가 마지막으로 읽은 메시지 추적

    @Column({ default: true })
    isActive: boolean; // 방 나감 여부 혹은 차단 여부

    @CreateDateColumn()
    joinedAt: Date;
}