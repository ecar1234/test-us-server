import { Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import { ApplicationEntity } from "./ApplicationEntity.js";
import { MessagesEntity } from "./MessagesEntities/MessageEntity.js";
import { UserReviewEntity } from "./UserReviewEntiry.js";
import { BasePostEntity } from "./BasePostEntity.js";
import { FirebaseDeviceTokenEntity } from "./FirebaseDeviceTokenEntity.js";
import { RoomMemberEntity } from "./MessagesEntities/RoomMemberEntity.js";
import { PurchaseEntity } from "./PurchaseEntity.js";

export enum UserType {
    INDIVIDUALS = 'INDIVIDUALS',
    COMPANIES = 'COMPANIES',
    NORMAL = 'NORMAL'
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
    USER='USER',
}
export enum UserMethod {
    GOOGLE='GOOGLE',
    NAVER='NAVER',
    EMAIL='EMAIL',
}

@Entity('users')
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

    @OneToMany(() => UserReviewEntity, review => review.reviewer)
    givenReviews: UserReviewEntity[]

    @OneToMany(() => UserReviewEntity, review => review.reviewed)
    receivedReviews: UserReviewEntity[]

    @OneToMany(() => RoomMemberEntity, room => room.user)
    members: RoomMemberEntity[];

    @OneToMany(() => MessagesEntity, message => message.sender)
    sentMessages: MessagesEntity[];

    @OneToMany(() => FirebaseDeviceTokenEntity, token => token.user)
    deviceTokens: FirebaseDeviceTokenEntity[];

    @OneToMany(() => PurchaseEntity, purchase => purchase.user)
    purchases: PurchaseEntity[];

}