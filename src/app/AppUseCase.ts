import { ApplicationModel } from "../domain/entities/ApplicationModel";
import { PostModel } from "../domain/entities/PostModel";
import { ApplicationRepositoryImpl } from "../infrastructure/repositories/ApplicationRepositoryImpl";

export class AppUseCase {
    constructor(private applicationRepository: ApplicationRepositoryImpl) {}

    async createApplication(userId: string, postId: string, platform: string, status: string = 'pending'): Promise<ApplicationModel> {
        const application = new ApplicationModel(null, platform, status, null, null, postId, userId);
        return this.applicationRepository.create(application);
    }

    async updateApplication(postId: string, userId: string, platform: string, status: string): Promise<ApplicationModel> {
        const application = new ApplicationModel(null, platform, status, null, null, postId, userId);
        return this.applicationRepository.update(application);
    }

    async deleteApplication(id: string): Promise<boolean> {
        return this.applicationRepository.delete(id);
    }

    async acceptUser(userId: string, postId: string): Promise<ApplicationModel> {
        return this.applicationRepository.acceptUser(userId, postId);
    }

    async rejectUser(userId: string, postId: string): Promise<ApplicationModel> {
        return this.applicationRepository.rejectUser(userId, postId);
    }
}