import { Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryColumn, Unique, UpdateDateColumn } from "typeorm";
import { PostEntity } from "./post_entity";
import { ApplicationEntity } from "./application_entity";
import { MessagesEntity } from "./messagesEntity";
import { ReviewEntity } from "./review_entity";


@Entity('User')
@Unique(['email'])
export class UserEntity {
    @PrimaryColumn("uuid")
    user_id: string

    @Column('varchar')
    user_naem: string

    @Column('varchar', { length: 50})
    email: string
    
    @Column('varchar', {length: 20})
    password_hash: string

    @CreateDateColumn()
    create_at: Date

    @UpdateDateColumn()
    update_at: Date

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