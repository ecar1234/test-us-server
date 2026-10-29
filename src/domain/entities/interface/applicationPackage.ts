import { ProjectRoleModel } from "../SideProject/ProjectRoleModel.js"

export interface AppRecruitInfo {
    postId: string,
    title?: string,
    thumbnailUrl?: string,
    isExpired?: boolean,
    category?: string
}

export interface AppSideInfo {
    postId: string,
    title?: string,
    platform: string,
    mobileOs: string | null,
    category: string,
    projectRoles: ProjectRoleModel[]
}