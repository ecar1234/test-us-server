import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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

    @Column()
    postId: string;

    @Column()
    postType: string;
}