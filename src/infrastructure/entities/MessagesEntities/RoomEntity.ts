import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, Relation, Unique } from "typeorm";
import { RoomMemberEntity } from "./RoomMemberEntity.js";
import { MessagesEntity } from "./MessageEntity.js";
import { BasePostEntity } from "../PostEntities/BasePostEntity.js";

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
    @ManyToOne(() => BasePostEntity, { onDelete: 'CASCADE' })
    post: Relation<BasePostEntity>;

    // 1:1 채팅의 경우 상대방(신청자) ID를 기록하여 구분
    @Column({ type: 'varchar', nullable: true })
    targetUserId: string;

    @Column({ type: 'int', nullable: true, name: 'last_message_id' })
    lastMessageId: number | null

    @Column({ type: 'varchar', nullable: true })
    lastMessageContent: string; // "안녕하세요" 등 마지막 내용 캐싱

    @Column({ type: 'timestamp', nullable: true })
    lastMessageAt: Date; // 목록 정렬용 시간 캐싱

    @OneToMany(() => RoomMemberEntity, (member) => member.room)
    members: Relation<RoomMemberEntity>[];

    @OneToMany(() => MessagesEntity, (message) => message.room)
    messages: Relation<MessagesEntity>[];

    @CreateDateColumn()
    createdAt: Date;
}