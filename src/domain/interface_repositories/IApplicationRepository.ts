import { ApplicationModel } from "../entities/ApplicationModel";

export interface IApplicationRepository {
    create(application: ApplicationModel): Promise<ApplicationModel>;
    update(application: ApplicationModel): Promise<ApplicationModel>;
    cancel(id: number): Promise<ApplicationModel>;
    acceptUser(userId: string, postId: string): Promise<ApplicationModel>;
    rejectUser(userId: string, postId: string): Promise<ApplicationModel>;
    findApplicationsByUserId(userId: string): Promise<ApplicationModel[]>;
    getRecruitApplications(applicationIds: number[]): Promise<ApplicationModel[]>;
}