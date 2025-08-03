import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { UserEntity } from "./UserEntity";

@Entity('Messages')
@Unique(['messageId'])
export class MessagesEntity {
    @PrimaryGeneratedColumn('uuid')
    messageId: string

    @Column('text')
    contents: string

    @CreateDateColumn()
    createdAt: Date

    @Column({type: 'timestamp', nullable: true })
    readAt: Date | null

    @Column('boolean', {default : false})
    deleteSender : boolean

    @Column('boolean', {default : false})
    deleteReceiver: boolean

    @ManyToOne(() => UserEntity, user => user.sentMessages, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'senderUserId' })
    sender: UserEntity

    @ManyToOne(() => UserEntity, user => user.receiveMessages, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'receiverUserId' })
    receiver: UserEntity
}