import { ChildEntity, Column, OneToMany, Relation } from "typeorm";
import { BasePostEntity } from "../BasePostEntity.js";
import { ProjectRoleEntity } from "./ProjectRoleEntity.js";
import { ApplicationEntity } from "../../ApplicationEntity.js";


@ChildEntity('SIDE_PROJECT')
export class SideProjectPostEntity extends BasePostEntity {
    @Column('text', { nullable: false })
    sprintDutations: string;

    @Column()
    referenceLink: string[];

    @OneToMany(() => ProjectRoleEntity, (role) => role.post, { cascade: true })
    projectRoles: Relation<ProjectRoleEntity[]>

    @Column()
    expiredAt: Date

    @OneToMany(() => ApplicationEntity, application => application.recruitPost)
    applications: ApplicationEntity[];
}