import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserEntity } from "./user_entity";
import { ApplicationEntity } from "./application_entity";

export enum PostStatusType {
    ACTIVE = 'active',
    END = 'end',
    EXPIRED = 'expired',
}

@Entity('Post')
export class PostEntity {
    @PrimaryGeneratedColumn('uuid')
    postId: string

    @ManyToOne(() => UserEntity, user => user.posts, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'author_user_id' })
    author: UserEntity

    @Column('varchar', { length: 30 })
    title: string

    @Column("varchar", { length: 100 })
    subtitle: string

    @Column('text')
    contents: string

    @Column({ type: 'enum', enum: ['active', 'end', 'expired'], default: 'active' })
    status: PostStatusType

    @Column('int', { default: 7 })
    period: number

    @CreateDateColumn()
    createAt: Date

    @UpdateDateColumn()
    updateAt: Date

    @OneToMany(() => ApplicationEntity, application => application.post)
    applications: ApplicationEntity[]
}