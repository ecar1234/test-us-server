import { Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryColumn, Unique, UpdateDateColumn } from "typeorm";
import { PostEntity } from "./post_entity";
import { ApplicationEntity } from "./application_entity";
import { MessagesEntity } from "./messagesEntity";
import { ReviewEntity } from "./review_entity";

export enum UserType {
    INDVIDUALS = 'INDVIDUALS',
    COMPANIES = 'COMPANIES',
}

@Entity('User')
@Unique(['email'])
export class UserEntity {
    @PrimaryColumn("uuid")
    userId: string

    @Column('varchar')
    userName: string

    @Column('varchar', { length: 50})
    email: string
    
    @Column('varchar', {length: 20})
    password_hash: string

    @Column({ type: 'enum', enum: UserType, default: UserType.INDVIDUALS })
    type: UserType

    @CreateDateColumn()
    createAt: Date

    @UpdateDateColumn()
    updateAt: Date

    @OneToMany(() => PostEntity, post => post.author)
    posts: PostEntity[]

    @OneToMany(() => ApplicationEntity, app => app.applicant)
    applications: ApplicationEntity[]

    @OneToMany(() => MessagesEntity, message => message.sender)
    sentMessages: MessagesEntity[]

    @OneToMany(() => MessagesEntity, message => message.receiver)
    reciveMessages: MessagesEntity[]

    @OneToMany(() => ReviewEntity, review => review.reviewer)
    givenReviews: ReviewEntity[]

    @OneToMany(() => ReviewEntity, review => review.reviewed)
    receivedReviews: ReviewEntity[]
}