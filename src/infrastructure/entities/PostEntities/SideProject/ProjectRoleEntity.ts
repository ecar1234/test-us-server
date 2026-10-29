import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn, Relation } from "typeorm";
import { SideProjectPostEntity } from "./SideProjectPostEntity.js";


@Entity('project_role_entity')
export class ProjectRoleEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    roleName: string;

    @Column({type: 'int', default: 0})
    requiredCount: number;

    @Column({type: 'int', default: 0})
    currentCount: number;

    @Column({type: 'boolean', default: false})
    isClosed: boolean;

    @ManyToOne(() => SideProjectPostEntity, (post) => post.projectRoles, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'postId'})
    post: Relation<SideProjectPostEntity>;
} 