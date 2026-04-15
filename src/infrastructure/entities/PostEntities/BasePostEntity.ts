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
} from "typeorm";
import { UserEntity } from "../UserEntity.js";
import { PostReviewEntity } from "../PostReviewEntity.js";
import { RoomEntity } from "../MessagesEntities/RoomEntity.js";



export enum BasePostStateType {
    ACTIVE = 'active',
    EXPIRED = 'expired',
    END = 'end',
    DELETE = 'delete'
}
export enum MobileOsType{
    ANDROID = 'android',
    IOS = 'ios',
}
export enum PostCategory {
    GAME = 'game',
    TRAVEL = 'travel',
    DEVELOPER_TOOL = 'developerTool',
    HEALTH = 'health',
    EDUCATION = 'education',
    FINANCE = 'finance',
    WEATHER = 'weather',
    NEWS = 'news',
    BOOKS = 'books',
    LIFE = 'life',
    BUSINESS = 'business',
    PHOTOGRAPHY = 'photography',
    SOCIAL = 'social',
    SPORTS = 'sports',
    SHOPPING = 'shopping',
    FOOD = 'food',
    UTILITY = 'utility',
    MEDICAL = 'medical',
    MAGAZINE = 'magazine',
    MUSIC = 'music',
    ENTERTAINMENT = 'entertainment',
    ETC = 'etc'
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

    @Column({ type: 'varchar', length: 10, nullable: false, default: 'mobile'})
    platform: string;

    @Column({type: 'enum', enum: MobileOsType, nullable: true})
    mobileOs: MobileOsType;

    @Column({type: 'enum', enum: PostCategory, default: 'etc'})
    category: PostCategory;

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

    @OneToMany(() => PostReviewEntity, review => review.post)
    receivedReviews: PostReviewEntity[]

    @OneToMany(() => RoomEntity, room => room.id)
    rooms: RoomEntity[]

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