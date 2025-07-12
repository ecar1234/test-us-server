import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user_entity";

@Entity('Messages')
export class MessagesEntity {
    @PrimaryGeneratedColumn('uuid')
    message_id: string

    @Column('text')
    contents: string

    @CreateDateColumn()
    create_at: Date

    @Column({type: 'timestamp', nullable: true })
    read_at: Date | null

    @ManyToOne(() => UserEntity, user => user.sentMessages, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'sender_user_id' })
    sender: UserEntity

    @ManyToOne(() => UserEntity, user => user.reciveMessages, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'receiver_user_id' })
    receiver: UserEntity
}