import {
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    TableInheritance,
    Entity,
    OneToMany,
    AfterLoad,
    Relation,
} from "typeorm";
import { UserEntity } from "../UserEntity.js";
import { RoomEntity } from "../MessagesEntities/RoomEntity.js";
import { BasePostStateType, MobileOsType, PostCategory } from "../../enums/PostEnums.js";


@Entity('base_post_entity')
@TableInheritance({ column: { type: "varchar", name: "postType" } })
export abstract class BasePostEntity {
    @PrimaryGeneratedColumn('uuid')
    postId: string;

    @Column('varchar', { length: 30 })
    title: string;

    @Column("varchar", { length: 100 })
    subtitle: string;

    @Column('text')
    contents: string;

    @Column({ type: 'varchar', length: 10, nullable: true, default: 'mobile' })
    platform: string;

    @Column({ type: 'enum', enum: MobileOsType, nullable: true })
    mobileOs: MobileOsType;

    @Column({ type: 'enum', enum: PostCategory, nullable: true, default: 'etc' })
    category: PostCategory;

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

    // @OneToMany(() => PostReviewEntity, review => review.post)
    // receivedReviews: PostReviewEntity[]

    @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'authorId' })
    author: Relation<UserEntity>;

    @OneToMany(() => RoomEntity, room => room.post)
    rooms: Relation<RoomEntity>[]

    @AfterLoad()
    setDefaults() {
        if (!this.mobileOs) {
            this.mobileOs = null;
        }
        if (!this.images) {
            this.images = [];
        }
    }
}