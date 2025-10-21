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

    // 다형성 관계를 위한 컬럼
    @Column({ nullable: true })
    postId: string;

    // 게시물의 종류를 식별하기 위한 컬럼 ('recruitment', 'promotion' 등)
    @Column({ nullable: true })
    postType: string;
}