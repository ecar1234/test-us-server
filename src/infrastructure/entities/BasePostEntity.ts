import {
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    OneToMany,
    TableInheritance,
    Entity,
    ChildEntity,
} from "typeorm";
import { UserEntity } from "./UserEntity";
import { ImagesEntity } from "./ImagesEntity";

export enum BasePostStatusType {
    ACTIVE = 'active',
    EXPIRED = 'expired',
    DELETE = 'delete'
}

@Entity('base_post_entity')
@TableInheritance({ column: { type: "varchar", name: "postType" } })
export abstract class BasePostEntity {
    @PrimaryGeneratedColumn('uuid')
    postId: string;

    @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'authorId' })
    author: UserEntity;

    @Column('varchar', { length: 30 })
    title: string;

    @Column("varchar", { length: 100 })
    subtitle: string;

    @Column('text')
    contents: string;

    @Column({ type: 'int', default: 0 })
    views: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => ImagesEntity, image => image.post, { cascade: true, eager: true, nullable: true })
    images: ImagesEntity[];
}