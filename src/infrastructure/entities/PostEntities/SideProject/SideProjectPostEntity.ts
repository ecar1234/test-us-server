import { ChildEntity, Column, OneToMany, Relation } from "typeorm";
import { BasePostEntity } from "../BasePostEntity.js";
import type { ProjectRoleEntity } from "./ProjectRoleEntity.js";
import type { ApplicationEntity } from "../../ApplicationEntity.js";


@ChildEntity('SIDE_PROJECT')
export class SideProjectPostEntity extends BasePostEntity {
    @Column('text', { nullable: false })
    sprintDutations: string;

    @Column({type: 'simple-array', nullable: true})
    referenceLink: string[];

    @OneToMany('ProjectRoleEntity', (role: ProjectRoleEntity) => role.post, { cascade: true })
    projectRoles: Relation<ProjectRoleEntity[]>

    @Column({type: 'datetime', nullable: true})
    expiredAt: Date

    @OneToMany('ApplicationEntity', (app: ApplicationEntity) => app.sidePost.applications)
    applications: ApplicationEntity[];
}