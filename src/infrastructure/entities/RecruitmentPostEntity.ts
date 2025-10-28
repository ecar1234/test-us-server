import { Column, ChildEntity, OneToMany } from "typeorm";
import { ApplicationEntity } from "./ApplicationEntity";
import { BasePostEntity } from "./BasePostEntity";


@ChildEntity()
export class RecruitmentPostEntity extends BasePostEntity {

    @OneToMany(() => ApplicationEntity, application => application.post)
    applications: ApplicationEntity[];
}