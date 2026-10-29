

export interface IProjectRoleRepository {
    addRoleCount(roleId:number):Promise<void>;
    substractRoleCount(roleId:number):Promise<void>;
}