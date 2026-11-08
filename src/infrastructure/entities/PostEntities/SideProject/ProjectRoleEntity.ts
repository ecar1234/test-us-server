import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn, Relation } from "typeorm";
import type { SideProjectPostEntity } from "./SideProjectPostEntity.js";


@Entity('project_role_entity')
export class ProjectRoleEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({type: 'varchar', length: 10})
    roleName: string;

    @Column({type: 'int', default: 0})
    requiredCount: number;

    @Column({type: 'int', default: 0})
    currentCount: number;

    @Column({type: 'boolean', default: false})
    isClosed: boolean;

    @ManyToOne('SideProjectPostEntity', {onDelete: 'CASCADE'})
    @JoinColumn({name: 'postId'})
    post: Relation<SideProjectPostEntity>;
} 