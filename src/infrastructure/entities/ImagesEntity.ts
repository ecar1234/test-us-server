import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('Images')
export class ImagesEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column('varchar')
    filename!: string

    @Column('varchar')
    originalname!: string

    @Column('varchar')
    mimetype!: string

    @Column('int')
    size: number

    @Column('varchar')
    url!: string

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @Column('varchar')
    postId: string;

    @Column('varchar')
    postType: string;
}