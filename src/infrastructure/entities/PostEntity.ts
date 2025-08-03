import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserEntity } from "./UserEntity";
import { ApplicationEntity } from "./ApplicationEntity";

export enum PostStatusType {
    ACTIVE = 'active',
    END = 'end',
    EXPIRED = 'expired',
    DELETE = 'delete'
}

@Entity('Post')
export class PostEntity {
    @PrimaryGeneratedColumn('uuid')
    postId: string

    @ManyToOne(() => UserEntity, user => user.posts, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'authorId' })
    author: UserEntity

    @Column('varchar', { length: 30 })
    title: string

    @Column("varchar", { length: 100 })
    subtitle: string

    @Column({ type: 'simple-array', nullable: false })
    platform: string[]

    @Column('text')
    contents: string

    @Column({ type: 'enum', enum: PostStatusType, default: 'active' })
    status: PostStatusType

    @Column('int', { default: 7 })
    period: number

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @OneToMany(() => ApplicationEntity, application => application.post)
    applications: ApplicationEntity[]
}