import { Application } from "../domain/entities/application";
import { ApplicationRepo } from "../infrastructure/repositories/application_repo";

export class AppUseCase {
    constructor(private applicationRepository: ApplicationRepo) {}

    async findApplicationsByPostId(postId: string): Promise<Application[]> {
        return this.applicationRepository.findByPostId(postId);
    }

    async findApplicationsByUserId(userId: string): Promise<Application[]> {
        return this.applicationRepository.findByUserId(userId);
    }

    async countApplicantsByPostId(postId: string): Promise<number> {
        return this.applicationRepository.applicantCountByPostId(postId);
    }

    async createApplication(application: Application): Promise<Application> {
        return this.applicationRepository.create(application);
    }

    async updateApplication(application: Application): Promise<Application> {
        return this.applicationRepository.update(application);
    }

    async deleteApplication(id: string): Promise<boolean> {
        return this.applicationRepository.delete(id);
    }

    async acceptUser(userId: string, postId: string): Promise<Application> {
        return this.applicationRepository.acceptUser(userId, postId);
    }

    async rejectUser(userId: string, postId: string): Promise<Application> {
        return this.applicationRepository.rejectUser(userId, postId);
    }

    async countApplicationsByPostId(postId: string): Promise<number> {
        return this.applicationRepository.countByPostId(postId);
    }

    async findApplicationByPostAndUserAndStatus(postId: string, userId: string, status: string): Promise<Application | null> {
        return this.applicationRepository.findByPostIdAndUserIdAndStatus(postId, userId, status);
    }

    async findApplicationsWithPagination(postId: string, page: number, limit: number): Promise<{ applications: Application[]; total: number }> {
        return this.applicationRepository.findByPostIdWithPagination(postId, page, limit);
    }
}