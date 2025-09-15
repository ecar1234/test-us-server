import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { PostEntity } from "./PostEntity";

@Entity('Images')
export class ImagesEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    filename!: string

    @Column()
    originalname!: string

    @Column()
    mimetype!: string

    @Column()
    size: number

    @Column()
    url!: string

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @ManyToOne(() => PostEntity, post => post.images, { onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'postId' })
    post: PostEntity;
}