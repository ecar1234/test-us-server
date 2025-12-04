import { IApplicationRepository } from "../../domain/interface_repositories/IApplicationRepository";
import { ApplicationEntity, ApplicationsPlatform, ApplicationStatus } from "../entities/ApplicationEntity";
import { AppDataSource } from "../../config/DataSource";
import { ApplicationModel } from "../../domain/entities/ApplicationModel";
import createError from "http-errors";
import { In } from "typeorm";

export class ApplicationRepositoryImpl implements IApplicationRepository {
    private applicationRepository = AppDataSource.getRepository(ApplicationEntity);

    public toDomainApplication(applicationEntity: ApplicationEntity): ApplicationModel {
        // applicant 객체가 존재하고 userId가 있는지 확인하는 방어 코드 추가
        return new ApplicationModel(
            applicationEntity.appId,
            applicationEntity.platform === ApplicationsPlatform.WEB ? 'web' : (applicationEntity.platform === ApplicationsPlatform.IOS ? 'ios' : 'android'),
            applicationEntity.status === ApplicationStatus.PENDING ? 'pending' :
                (applicationEntity.status === ApplicationStatus.ACCEPTED ? 'accepted' :
                    (applicationEntity.status === ApplicationStatus.REJECTED ? 'rejected' : 'cancel')),
            applicationEntity.appliedAt,
            applicationEntity.updatedAt,
            applicationEntity.post?.postId,
            applicationEntity.applicant?.userId
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

        // 저장 후 관계가 포함된 완전한 엔티티를 다시 조회합니다.
        const newApp = await this.applicationRepository.findOne({
            where: { appId: savedEntity.appId },
            relations: ['post', 'applicant']
        });
        return this.toDomainApplication(newApp);
    }

    public async update(application: ApplicationModel): Promise<ApplicationModel> {
        const status = application.status === 'pending' ? ApplicationStatus.PENDING :
            (application.status === 'accepted' ? ApplicationStatus.ACCEPTED :
                (application.status === 'rejected' ? ApplicationStatus.REJECTED : ApplicationStatus.CANCEL));
        
        await this.applicationRepository.update(application.id, {
            status: status
        });
    
        const result = await this.applicationRepository.findOne({
            where: { appId: application.id },
            relations: ['post', 'applicant']
        });
        return this.toDomainApplication(result!);
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
        const application = await this.applicationRepository.findOne({
            where: {
                applicant: { userId },
                post: { postId },
            },
            relations: ['applicant', 'post', 'reviews']
        });

        if(!application){
            throw new Error('Application not found');
        }
        if(application.status === ApplicationStatus.ACCEPTED){
            return this.toDomainApplication(application);
            // throw new Error('Application already accepted');
        }
        application.status = ApplicationStatus.ACCEPTED;
        await this.applicationRepository.save(application);
        return this.toDomainApplication(application);
    }
    public async rejectUser(userId: string, postId: string): Promise<ApplicationModel> {
        const application = await this.applicationRepository.findOne({
            where: {
                applicant: { userId },
                post: { postId },
            },
            relations: ['applicant', 'post', 'reviews']
        });

        if(!application){
            throw new Error(`Application not found for user ${userId} and post ${postId}`);
        }

        application.status = ApplicationStatus.REJECTED;
        await this.applicationRepository.save(application);
        return this.toDomainApplication(application);
    }

    public async findApplicationsByUserId(userId: string): Promise<ApplicationModel[]> {
        const applicationEntities = await this.applicationRepository.find({
            where: { applicant: { userId: userId} },
            relations: ['applicant', 'post', 'reviews']
        });
        if(!applicationEntities){
            throw new Error("Application not found");
        }
        // console.log(applicationEntities);
        return applicationEntities.map(entity => this.toDomainApplication(entity));

    }

    public async getPostApplicantsInfo(applicationIds: number[]): Promise<ApplicationModel[]> {
        const applicants = await this.applicationRepository.find({
            where: { appId: In(applicationIds) },
            relations: ['applicant', 'post', 'reviews']
        });
        return applicants.map(entity => this.toDomainApplication(entity));
    }
}