import { ApplicationModel } from "../entities/ApplicationModel";
import { PostModel } from "../entities/PostModel";

export interface IApplicationRepository {
    create(application: ApplicationModel): Promise<ApplicationModel>;
    update(application: ApplicationModel): Promise<ApplicationModel>;
    delete(id: string): Promise<boolean>;
    acceptUser(userId: string, postId: string): Promise<ApplicationModel>;
    rejectUser(userId: string, postId: string): Promise<ApplicationModel>;
}