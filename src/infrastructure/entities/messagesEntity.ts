import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user_entity";

@Entity('Messages')
export class MessagesEntity {
    @PrimaryGeneratedColumn('uuid')
    messageId: string

    @Column('text')
    contents: string

    @CreateDateColumn()
    createAt: Date

    @Column({type: 'timestamp', nullable: true })
    readAt: Date | null

    @ManyToOne(() => UserEntity, user => user.sentMessages, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'senderUserId' })
    sender: UserEntity

    @ManyToOne(() => UserEntity, user => user.receiveMessages, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'receiverUserId' })
    receiver: UserEntity
}