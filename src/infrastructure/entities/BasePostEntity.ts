import {
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    TableInheritance,
    Entity,
} from "typeorm";
import { UserEntity } from "./UserEntity";

export enum BasePostStateType {
    ACTIVE = 'active',
    EXPIRED = 'expired',
    END = 'end',
    DELETE = 'delete'
}

@Entity('base_post_entity')
@TableInheritance({ column: { type: "varchar", name: "postType" } })
export abstract class BasePostEntity {
    @PrimaryGeneratedColumn('uuid')
    postId: string;

    @Column()
    postType: string;

    @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'authorId' })
    author: UserEntity;

    @Column('varchar', { length: 30 })
    title: string;

    @Column("varchar", { length: 100 })
    subtitle: string;

    @Column({ type: 'simple-array', nullable: false })
    platform: string[];

    @Column('text')
    contents: string;

    @Column({ type: 'simple-json', nullable: true })
    images: { url: string; filename: string; originalname: string; mimetype: string; size: number; }[] | null;

    @Column({ type: 'int', default: 0 })
    views: number;

    @Column({ type: 'enum', enum: BasePostStateType, default: 'active' })
    status: BasePostStateType;

    @Column('int', { default: 7 })
    period: number

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}