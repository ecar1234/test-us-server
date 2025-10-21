import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserEntity } from "./UserEntity";
import { ApplicationEntity } from "./ApplicationEntity";
import { ImagesEntity } from "./ImagesEntity";

export enum RecruitmentPostStatusType {
    ACTIVE = 'active',
    END = 'end',
    EXPIRED = 'expired',
    DELETE = 'delete'
}

@Entity('RecruitmentPost')
export class RecruitmentPostEntity {
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

    @Column({ type: 'enum', enum: RecruitmentPostStatusType, default: 'active' })
    status: RecruitmentPostStatusType

    @Column('int', { default: 7 })
    period: number

    @Column({type: 'int', default: 0})
    views: number

    @CreateDateColumn()
    createdAt: Date
    
    @UpdateDateColumn()
    updatedAt: Date
    
    @OneToMany(() => ImagesEntity, image => image.post, { cascade: [ 'update', 'remove' ], eager: true, nullable: true })
    images: ImagesEntity[]

    @OneToMany(() => ApplicationEntity, application => application.post)
    applications: ApplicationEntity[]
}