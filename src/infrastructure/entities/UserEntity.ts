import { Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import { PostEntity } from "./PostEntity";
import { ApplicationEntity } from "./ApplicationEntity";
import { MessagesEntity } from "./MessageEntity";
import { ReviewEntity } from "./ReviewEntiry";

export enum UserType {
    INDVIDUALS = 'INDVIDUALS',
    COMPANIES = 'COMPANIES',
}
export enum UserStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    DELETED = 'DELETED',
}

@Entity('User')
@Unique(['email', 'nickname'])
export class UserEntity {
    @PrimaryGeneratedColumn("uuid")
    userId: string

    @Column('varchar', { length: 50 })
    email: string

    @Column('varchar', { length: 60 })
    password_hash: string

    @Column('varchar', { length: 20 })
    nickname: string

    @Column('varchar', { length: 20 , nullable: true })
    userName: string

    @Column({ type: 'datetime', nullable: true })
    birth: Date

    @Column({ type: 'enum', enum: UserType, default: UserType.INDVIDUALS })
    type: UserType

    @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
    status: UserStatus

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @OneToMany(() => PostEntity, post => post.author)
    posts: PostEntity[]

    @OneToMany(() => ApplicationEntity, app => app.applicant)
    applications: ApplicationEntity[]

    @OneToMany(() => MessagesEntity, message => message.sender)
    sentMessages: MessagesEntity[]

    @OneToMany(() => MessagesEntity, message => message.receiver)
    receiveMessages: MessagesEntity[]

    @OneToMany(() => ReviewEntity, review => review.reviewer)
    givenReviews: ReviewEntity[]

    @OneToMany(() => ReviewEntity, review => review.reviewed)
    receivedReviews: ReviewEntity[]
}