import { AppDataSource } from "../../config/DataSource.js";
import { IProjectRoleRepository } from "../../domain/interface_repositories/IProjectRoleRepository.js";
import { ProjectRoleEntity } from "../entities/PostEntities/SideProject/ProjectRoleEntity.js";


export class ProjectRoleRepositoryImpl implements IProjectRoleRepository {

    private roleRepo = AppDataSource.getRepository(ProjectRoleEntity);

    async substractRoleCount(roleId: number): Promise<void> {
        try {
            const role = await this.roleRepo.findOne({
                where: { id: roleId }
            });
            if (!role) {
                throw new Error("[Project Role Repo] role not found by roleId");
            }
            if (role.currentCount === 0 || role.currentCount < 0) {
                throw new Error("[Project Role Repo] this order is impossible. because current count is 0");
            }
            role.currentCount--;
            if(role.currentCount < role.requiredCount && role.isClosed === true){
                role.isClosed = false;
            }
            const result = await this.roleRepo.save(role);
            return;
        } catch (error) {
            throw new Error("[Project Role Repo] substract count failed");
        }
    }
    async addRoleCount(roleId: number): Promise<void> {
        try {
            const role = await this.roleRepo.findOne({
                where: { id: roleId }
            });
            if (!role) {
                throw new Error("[Project Role Repo] role not found by roleId");
            }

            if (role.currentCount < role.requiredCount || role.currentCount >= 0) {
                role.currentCount++;
                if(role.currentCount === role.requiredCount){
                    role.isClosed = true;
                }
                const result = await this.roleRepo.save(role);
                return;
            } else {
                throw new Error("[Project Role Repo] too big current count more required count");
            }
        } catch (error) {
            throw new Error("[Project Role Repo] substract count failed");
        }
    }

}