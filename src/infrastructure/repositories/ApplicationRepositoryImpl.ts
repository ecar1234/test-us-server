import { IApplicationRepository } from "../../domain/interface_repositories/IApplicationRepository";
import { ApplicationEntity, ApplicationsPlatform, ApplicationStatus } from "../entities/ApplicationEntity";
import { AppDataSource } from "../../config/DataSource";
import { ApplicationModel } from "../../domain/entities/ApplicationModel";
import { PostEntity } from "../entities/PostEntity";
import { UserEntity } from "../entities/UserEntiry";
import { PostModel } from "../../domain/entities/PostModel";

export class ApplicationRepositoryImpl implements IApplicationRepository {
    private applicationRepository = AppDataSource.getRepository(ApplicationEntity);

    private toDomainApplication(applicationEntity: ApplicationEntity): ApplicationModel {
        return new ApplicationModel(
            applicationEntity.appId,
            applicationEntity.platform,
            applicationEntity.status,
            applicationEntity.appliedAt,
            applicationEntity.updatedAt,
            applicationEntity.post.postId,
            applicationEntity.applicant.userId
        );
    }
    private toEntityApplication(application: ApplicationModel): ApplicationEntity {
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

    public async findByPostId(postId: string): Promise<ApplicationModel[]> {
        return this.applicationRepository.find({
            where: { post: { postId } },
            relations: ['applicant', 'post', 'reviews']
        }).then(applications => applications.map(this.toDomainApplication.bind(this)));
    }
    public async findByUserId(userId: string): Promise<ApplicationModel[]> {
        return this.applicationRepository.find({
            where: { applicant: { userId } },
            relations: ['applicant', 'post', 'reviews']
        }).then(applications => applications.map(this.toDomainApplication.bind(this)));
    }
    async findPostListByUserId(userId: string): Promise<PostModel[]> {
        return this.applicationRepository.find({
            where: { applicant: { userId } },
            relations: ['post']
        }).then(applications => {
            return applications.map(app => {
                const post = app.post;
                return new PostModel(
                    post.postId,
                    post.author.userId,
                    post.title,
                    post.subtitle,
                    post.contents,
                    post.status,
                    post.period,
                    post.createdAt,
                    post.updatedAt
                );
            });
        });
    }
    public async findByUserNickname(nickname: string): Promise<ApplicationModel[]> {
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
    public async create(application: ApplicationModel): Promise<ApplicationModel> {
        const entity = this.toEntityApplication(application);
        return this.applicationRepository.save(entity).then(savedEntity => {
            return this.toDomainApplication(savedEntity);
        });
    }
    public async update(application: ApplicationModel): Promise<ApplicationModel> {
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
    public async acceptUser(userId: string, postId: string): Promise<ApplicationModel> {
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
    public async rejectUser(userId: string, postId: string): Promise<ApplicationModel> {
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
    public async findByPostIdAndUserIdAndStatus(postId: string, userId: string, status: string): Promise<ApplicationModel | null> {
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
    public async findByPostIdWithPagination(postId: string, page: number, limit: number): Promise<{ applications: ApplicationModel[]; total: number; }> {
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