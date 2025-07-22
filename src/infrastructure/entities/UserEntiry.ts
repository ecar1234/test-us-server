import { Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryColumn, Unique, UpdateDateColumn } from "typeorm";
import { PostEntity } from "./PostEntity";
import { ApplicationEntity } from "./ApplicationEntity";
import { MessagesEntity } from "./MessageEntity";
import { ReviewEntity } from "./ReviewEntiry";

export enum UserType {
    INDVIDUALS = 'INDVIDUALS',
    COMPANIES = 'COMPANIES',
}

@Entity('User')
@Unique(['email', 'nickname'])
export class UserEntity {
    @PrimaryColumn("uuid")
    userId: string

    @Column('varchar', { length: 50})
    email: string
    
    @Column('varchar', {length: 20})
    password_hash: string

    @Column('varchar', { length: 20 })
    nickname: string

    @Column({ type: 'enum', enum: UserType, default: UserType.INDVIDUALS })
    type: UserType

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