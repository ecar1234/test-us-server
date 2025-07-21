import { IApplicationRepository } from "../../domain/interface_repositories/IApplicationRepository";
import { ApplicationEntity, ApplicationsPlatform, ApplicationStatus } from "../entities/application_entity";
import { AppDataSource } from "../../config/data_source";
import { Application } from "../../domain/entities/application";
import { PostEntity } from "../entities/post_entity";
import { UserEntity } from "../entities/user_entity";

export class ApplicationRepo implements IApplicationRepository {
    private applicationRepository = AppDataSource.getRepository(ApplicationEntity);

    private toDomainApplication(applicationEntity: ApplicationEntity): Application {
        return new Application(
            applicationEntity.appId,
            applicationEntity.platform,
            applicationEntity.status,
            applicationEntity.appliedAt,
            applicationEntity.updatedAt,
            applicationEntity.post.postId,
            applicationEntity.applicant.userId
        );
    }
    private toEntityApplication(application: Application): ApplicationEntity {
        const entity = new ApplicationEntity();
        const platform = application.platform == 'web' ? ApplicationsPlatform.WEB 
        : (application.platform == 'ios' ? ApplicationsPlatform.IOS : ApplicationsPlatform.ANDROID);
        const status = application.status == 'pending' ? ApplicationStatus.PENDING 
        : (application.status == 'accepted' ? ApplicationStatus.ACCEPTED : ApplicationStatus.REJECTED);

        entity.appId = application.id;
        entity.platform = platform; 
        entity.status = status;
        entity.appliedAt = application.appliedAt || new Date();
        entity.updatedAt = application.updatedAt || null;
        entity.post = { postId: application.postId } as PostEntity;
        entity.applicant = { userId: application.applicantId } as UserEntity;
        return entity;
    }

    public async findByPostId(postId: string): Promise<Application[]> {
        return this.applicationRepository.find({
            where: { post: { postId } },
            relations: ['applicant', 'post', 'reviews']
        }).then(applications => applications.map(this.toDomainApplication.bind(this)));
    }
    public async findByUserId(userId: string): Promise<Application[]> {
        return this.applicationRepository.find({
            where: { applicant: { userId } },
            relations: ['applicant', 'post', 'reviews']
        }).then(applications => applications.map(this.toDomainApplication.bind(this)));
    }
    public async findbyUserNickname(nickname: string): Promise<Application[]> {
        return this.applicationRepository.find({
            where: { applicant: { nickname } },
            relations: ['applicant', 'post', 'reviews']
        }).then(applications => applications.map(this.toDomainApplication.bind(this)));
    }
    public async applicantCountByPostId(postId: string): Promise<number> {
        return this.applicationRepository.count({
            where: { post: { postId } }
        });
    }
    public async create(application: Application): Promise<Application> {
        const entity = this.toEntityApplication(application);
        return this.applicationRepository.save(entity).then(savedEntity => {
            return this.toDomainApplication(savedEntity);
        });
    }
    public async update(application: Application): Promise<Application> {
        const entity = this.toEntityApplication(application);
        
        this.applicationRepository.update(entity.appId, entity);

        return this.applicationRepository.findOne({
            where: { appId: entity.appId },
            relations: ['applicant', 'post', 'reviews']
        }).then(updatedEntity => {
            if (!updatedEntity) {
                throw new Error(`Application with id ${entity.appId} not found`);
            }
            return this.toDomainApplication(updatedEntity);
        });
    }
    public async delete(id: string): Promise<boolean> {
        return this.applicationRepository.delete(id).then(result => {
            if (result.affected === 0) {
                throw new Error(`Application with id ${id} not found`);
            }
            return true;
        });
    }
    public async acceptUser(userId: string, postId: string): Promise<Application> {
        return this.applicationRepository.findOne({
            where: {
                applicant: { userId },
                post: { postId },
                status: ApplicationStatus.PENDING
            },
            relations: ['applicant', 'post', 'reviews']
        }).then(applicationEntity => {
            if (!applicationEntity) {
                throw new Error(`Application not found for user ${userId} and post ${postId}`);
            }
            applicationEntity.status = ApplicationStatus.ACCEPTED;
            return this.applicationRepository.save(applicationEntity).then(savedEntity => {
                return this.toDomainApplication(savedEntity);
            });
        });
    }
    public async rejectUser(userId: string, postId: string): Promise<Application> {
        return this.applicationRepository.findOne({
            where: {
                applicant: { userId },
                post: { postId },
                status: ApplicationStatus.PENDING
            },
            relations: ['applicant', 'post', 'reviews']
        }).then(applicationEntity => {
            if (!applicationEntity) {
                throw new Error(`Application not found for user ${userId} and post ${postId}`);
            }
            applicationEntity.status = ApplicationStatus.REJECTED;
            return this.applicationRepository.save(applicationEntity).then(savedEntity => {
                return this.toDomainApplication(savedEntity);
            });
        });
    }
    public async countByPostId(postId: string): Promise<number> {
        return this.applicationRepository.count({
            where: { post: { postId } }
        });
    }
    public async findByPostIdAndUserIdAndStatus(postId: string, userId: string, status: string): Promise<Application | null> {
        return this.applicationRepository.findOne({
            where: {
                post: { postId },
                applicant: { userId },
                status: status as ApplicationStatus
            },
            relations: ['applicant', 'post', 'reviews']
        }).then(applicationEntity => {
            if (!applicationEntity) {
                return null;
            }
            return this.toDomainApplication(applicationEntity);
        });
    }
    public async findByPostIdWithPagination(postId: string, page: number, limit: number): Promise<{ applications: Application[]; total: number; }> {
        return this.applicationRepository.findAndCount({
            where: { post: { postId } },
            relations: ['applicant', 'post', 'reviews'],
            skip: (page - 1) * limit,
            take: limit
        }).then(([applications, total]) => {
            return {
                applications: applications.map(this.toDomainApplication.bind(this)),
                total
            };
        });
    }

}