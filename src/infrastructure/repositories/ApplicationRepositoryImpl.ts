import { IApplicationRepository } from "../../domain/interface_repositories/IApplicationRepository";
import { ApplicationEntity, ApplicationsPlatform, ApplicationStatus } from "../entities/ApplicationEntity";
import { AppDataSource } from "../../config/DataSource";
import { ApplicationModel } from "../../domain/entities/ApplicationModel";
import createError from "http-errors";

export class ApplicationRepositoryImpl implements IApplicationRepository {
    private applicationRepository = AppDataSource.getRepository(ApplicationEntity);

    private toDomainApplication(applicationEntity: ApplicationEntity): ApplicationModel {
        return new ApplicationModel(
            applicationEntity.appId,
            applicationEntity.platform === ApplicationsPlatform.WEB ? 'web' : (applicationEntity.platform === ApplicationsPlatform.IOS ? 'ios' : 'android'),
            applicationEntity.status === ApplicationStatus.PENDING ? 'pending' :
                (applicationEntity.status === ApplicationStatus.ACCEPTED ? 'accepted' :
                    (applicationEntity.status === ApplicationStatus.REJECTED ? 'rejected' : 'cancel')),
            applicationEntity.appliedAt,
            applicationEntity.updatedAt,
            applicationEntity.post.postId,
            applicationEntity.applicant.userId
        );
    }
    private toEntityApplication(application: ApplicationModel): ApplicationEntity {
        return this.applicationRepository.create({
            ...(application.id && { appId: application.id }),
            platform: application.platform === 'web' ? ApplicationsPlatform.WEB : (application.platform === 'ios' ? ApplicationsPlatform.IOS : ApplicationsPlatform.ANDROID),
            status: application.status === 'pending' ? ApplicationStatus.PENDING :
                (application.status === 'accepted' ? ApplicationStatus.ACCEPTED :
                    (ApplicationStatus.REJECTED ? ApplicationStatus.REJECTED : ApplicationStatus.CANCEL)),
            post: { postId: application.postId },
            applicant: { userId: application.applicantId },
        });
    }


    public async create(application: ApplicationModel): Promise<ApplicationModel> {
        const entity = await this.applicationRepository.findOne({ where: { post: { postId: application.postId }, applicant: { userId: application.applicantId } }, relations: ['post', 'applicant'] });
        if (entity) {
            throw createError(409, "Application already exists");
        }
        const appEntity = this.toEntityApplication(application);
        const savedEntity = await this.applicationRepository.save(appEntity);
        // console.log(savedEntity);
        return this.toDomainApplication(savedEntity);
    }

    public async update(application: ApplicationModel): Promise<ApplicationModel> {
        const entity = this.toEntityApplication(application);
        const result = await this.applicationRepository.save(entity);

        await this.applicationRepository.save(result);
        console.log('result', result)
        return this.toDomainApplication(result);
    }

    public async cancel(id: number): Promise<ApplicationModel> {
        const findApp = await this.applicationRepository.findOne({ where: { appId: id }, relations: ['post', 'applicant'] });
        if (!findApp) {
            throw new Error("Application not found");
        }
        findApp.status = ApplicationStatus.CANCEL;
        await this.applicationRepository.save(findApp);
        return this.toDomainApplication(findApp);
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

    public async findApplicationsByUserId(userId: string): Promise<ApplicationModel[]> {
        const applicationEntities = await this.applicationRepository.find({
            where: { applicant: { userId } },
            relations: ['applicant', 'post', 'reviews']
        });
        return applicationEntities.map(entity => this.toDomainApplication(entity));

    }
}