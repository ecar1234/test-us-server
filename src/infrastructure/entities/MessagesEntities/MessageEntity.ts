import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { UserEntity } from "../UserEntity";
import { RoomEntity } from "./RoomEntity";

@Entity('messages')
export class MessagesEntity {
   @PrimaryGeneratedColumn({ name: 'id' }) // 컬럼명을 'id'로 명시
   id: number;

   @Column('text')
   content: string;

   // 어느 방의 메시지인지 (인덱스 추가로 조회 성능 향상)
   @Index()
   @ManyToOne(() => RoomEntity, (chatRoom) => chatRoom.messages, { onDelete: 'CASCADE' })
   room: RoomEntity;

   // 보낸 사람
   @ManyToOne(() => UserEntity)
   sender: UserEntity;

   @CreateDateColumn()
   @Index() // 시간순 정렬을 위한 인덱스
   createdAt: Date;
}