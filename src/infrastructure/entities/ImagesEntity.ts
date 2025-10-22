import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { BasePostEntity } from "./BasePostEntity";

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

    @ManyToOne(() => BasePostEntity, post => post.images, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'postId' })
    post: BasePostEntity;
}