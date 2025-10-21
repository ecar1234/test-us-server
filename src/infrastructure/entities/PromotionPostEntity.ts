import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn, JoinColumn, OneToMany } from "typeorm";
import { UserEntity } from "./UserEntity";
import { ImagesEntity } from "./ImagesEntity";


export enum PromotionPostStatusType {
    ACTIVE = 'active',
    // END = 'end',
    EXPIRED = 'expired',
    DELETE = 'delete'
}JoinColumn

@Entity('PromotionPost')
export class PromotionPostEntity {
    @PrimaryGeneratedColumn('uuid')
    postId: string

    @Column('varchar', { length: 30 })
    title: string

    @Column("varchar", { length: 30 })
    subtitle: string

    @Column('text')
    contents: string

    @Column({ type: 'simple-array', nullable: false })
    platform: string[]

    @Column({ type: 'enum', enum: PromotionPostStatusType, default: 'active' })
    status: PromotionPostStatusType

    @Column({ type: 'simple-array', nullable: false})
    domain: string[]

    @Column('int', { default: 7 })
    period: number

    @Column({type: 'int', default: 0})
    views: number

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @ManyToOne(() => UserEntity, user => user.promotionPosts, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'authorId' })
    author: UserEntity

    @OneToMany(() => ImagesEntity, image => image.postId, { cascade: [ 'insert', 'update', 'remove' ], eager: true, nullable: true })
    @JoinColumn([
        { name: 'postId', referencedColumnName: 'postId' }
    ])
    images: ImagesEntity[]

}