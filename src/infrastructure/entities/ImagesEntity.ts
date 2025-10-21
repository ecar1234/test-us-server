import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { RecruitmentPostEntity } from "./RecruitmentPostEntity";

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

    @ManyToOne(() => RecruitmentPostEntity, post => post.images, { onDelete: 'CASCADE', nullable: true })
    @JoinColumn({ name: 'postId' })
    post: RecruitmentPostEntity;
}