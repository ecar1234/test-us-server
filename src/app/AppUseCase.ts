import { ApplicationModel } from "../domain/entities/ApplicationModel";
import { PostModel } from "../domain/entities/PostModel";
import { ApplicationRepositoryImpl } from "../infrastructure/repositories/ApplicationRepositoryImpl";

export class AppUseCase {
    constructor(private applicationRepository: ApplicationRepositoryImpl) {}

    async findApplicationsByPostId(postId: string): Promise<ApplicationModel[]> {
        return this.applicationRepository.findByPostId(postId);
    }

    async findApplicationsByUserId(userId: string): Promise<ApplicationModel[]> {
        return this.applicationRepository.findByUserId(userId);
    }

    async findByUserNickname(nickname: string): Promise<ApplicationModel[]> {
        return this.applicationRepository.findByUserNickname(nickname);
    }

    async findPostListByUserId(userId: string): Promise<PostModel[]> {
        return this.applicationRepository.findPostListByUserId(userId);
    }

    async countApplicantsByPostId(postId: string): Promise<number> {
        return this.applicationRepository.applicantCountByPostId(postId);
    }

    async createApplication(application: ApplicationModel): Promise<ApplicationModel> {
        return this.applicationRepository.create(application);
    }

    async updateApplication(application: ApplicationModel): Promise<ApplicationModel> {
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

    async countApplicationsByPostId(postId: string): Promise<number> {
        return this.applicationRepository.countByPostId(postId);
    }

    async findApplicationByPostAndUserAndStatus(postId: string, userId: string, status: string): Promise<ApplicationModel | null> {
        return this.applicationRepository.findByPostIdAndUserIdAndStatus(postId, userId, status);
    }

    async findApplicationsWithPagination(postId: string, page: number, limit: number): Promise<{ applications: ApplicationModel[]; total: number }> {
        return this.applicationRepository.findByPostIdWithPagination(postId, page, limit);
    }
}