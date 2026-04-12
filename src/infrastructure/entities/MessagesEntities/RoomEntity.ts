import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, Unique } from "typeorm";
import { RoomMemberEntity } from "./RoomMemberEntity.js";
import { MessagesEntity } from "./MessageEntity.js";
import { BasePostEntity } from "../BasePostEntity.js";

export enum RoomType {
    DM = 'DM',
    GROUP = 'GROUP'
}

@Entity('rooms')
export class RoomEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'enum', enum: RoomType })
    type: RoomType;

    // 어떤 게시글에서 파생된 채팅방인지
    @ManyToOne(() => BasePostEntity, (post) => post.rooms)
    post: BasePostEntity;

    // 1:1 채팅의 경우 상대방(신청자) ID를 기록하여 구분
    @Column({ nullable: true })
    targetUserId: string;

    /**
     * [최적화] 목록 조회 시 Join을 방지하기 위한 필드
     */
    @OneToOne(() => MessagesEntity, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'last_message_id' }) // 컬럼명을 snake_case로 변경하여 일관성 유지
    lastMessage: MessagesEntity;

    @Column({ nullable: true })
    lastMessageContent: string; // "안녕하세요" 등 마지막 내용 캐싱

    @Column({ nullable: true })
    lastMessageAt: Date; // 목록 정렬용 시간 캐싱

    @OneToMany(() => RoomMemberEntity, (member) => member.room)
    members: RoomMemberEntity[];

    @OneToMany(() => MessagesEntity, (message) => message.room)
    messages: MessagesEntity[];

    @CreateDateColumn()
    createdAt: Date;
}