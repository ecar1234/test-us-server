import { Column, ChildEntity, OneToMany } from "typeorm";
import { ApplicationEntity } from "./ApplicationEntity.js";
import { BasePostEntity } from "./BasePostEntity.js";


@ChildEntity()
export class RecruitmentPostEntity extends BasePostEntity {

    @OneToMany(() => ApplicationEntity, application => application.post)
    applications: ApplicationEntity[];
}