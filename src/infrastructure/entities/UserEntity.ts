import { Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import { ApplicationEntity } from "./ApplicationEntity";
import { MessagesEntity } from "./MessageEntity";
import { ReviewEntity } from "./ReviewEntiry";
import { BasePostEntity } from "./BasePostEntity";

export enum UserType {
    INDIVIDUALS = 'INDIVIDUALS',
    COMPANIES = 'COMPANIES',
}
export enum UserStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    DELETED = 'DELETED',
}
export enum UserRole {
    PROGRAMMER='PROGRAMMER',
    DESIGNER='DESIGNER',
    PUBLISHER='PUBLISHER',
    PLANNER='PLANNER',
    MANAGER='MANAGER',
    MARKETER='MARKETER',
    ANALYST='ANALYST',
    OPERATER='OPERATER',
    PM='PM',
    QA='QA',
    CS='CS',
    NORMAL='NORMAL',
}
export enum UserMethod {
    GOOGLE='GOOGLE',
    NAVER='NAVER',
    EMAIL='EMAIL',
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

    @Column({ type: 'date', nullable: true })
    birth: Date

    @Column({ type: 'enum', enum: UserType, default: UserType.INDIVIDUALS })
    type: UserType

    @Column({ type: 'enum', enum: UserRole, default: UserRole.PROGRAMMER })
    role: UserRole

    @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
    status: UserStatus

    @Column({ type: 'simple-json', nullable: true })
    image: { url: string; filename: string; originalname: string; mimetype: string; size: number; } | null;

    @Column({ type: 'enum', enum: UserMethod, default: UserMethod.EMAIL })
    method: UserMethod

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @OneToMany(() => BasePostEntity, post => post.author)
    posts: BasePostEntity[];

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