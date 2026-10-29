import { IApplicationRepository } from "../../domain/interface_repositories/IApplicationRepository.js";
import { ApplicationEntity, ApplicationsPlatform, ApplicationStatus } from "../entities/ApplicationEntity.js";
import { AppDataSource } from "../../config/DataSource.js";
import { ApplicationModel } from "../../domain/entities/ApplicationModel.js";
import { BasePostStateType, MobileOsType } from "..//entities/PostEntities/BasePostEntity.js";
import createError from "http-errors";
import { In } from "typeorm";
import { AppRecruitInfo, AppSideInfo } from "../../domain/entities/interface/applicationPackage.js";
import { APPLICATION_STATUS_TO_STRING, convertCategoryToString, convertMobileOsToString, convertStringToMobileOs, PLATFORM_TO_STRING, STRING_TO_APPLICATION_STATUS, STRING_TO_PLATFORM } from "../../utils/convertUtil.js";
import { RecruitmentPostEntity } from "../entities/PostEntities/RecruitmentPostEntity.js";
import { SideProjectPostEntity } from "../entities/PostEntities/SideProject/SideProjectPostEntity.js";
import { ProjectRoleModel } from "../../domain/entities/SideProject/ProjectRoleModel.js";

export class ApplicationRepositoryImpl implements IApplicationRepository {
    private applicationRepository = AppDataSource.getRepository(ApplicationEntity);
    private toRecruitPostModel(post:RecruitmentPostEntity): AppRecruitInfo{
        const postInfo: AppRecruitInfo = {
            postId: post.postId,
            title: post.title,
            thumbnailUrl: post.images[0].url,
            isExpired: post.status == BasePostStateType.ACTIVE,
            category: convertCategoryToString(post.category)
        }
        return postInfo;
    }
    private toSidePostModel(post:SideProjectPostEntity):AppSideInfo{
        const postInfo : AppSideInfo = {
            postId: post.postId,
            title: post.title,
            platform: post.platform,
            mobileOs: post.mobileOs,
            category: post.category,
            projectRoles: post.projectRoles.map((e) => new ProjectRoleModel({
                id: e.id,
                roleName: e.roleName,
                requiredCount: e.requiredCount,
                currentCount: e.currentCount,
                isClosed: e.isClosed
            }))
        }
        return postInfo;
    }
    public toApplicationModel(entity: ApplicationEntity): ApplicationModel {
        // applicant 객체가 존재하고 userId가 있는지 확인하는 방어 코드 추가
        let postInfo : AppRecruitInfo | AppSideInfo;
        if(entity.recruitPost){
            this.toRecruitPostModel(entity.recruitPost);
        }else {
            this.toSidePostModel(entity.sidePost);
        }
        return new ApplicationModel(
            {
                id: entity.appId,
                platform: PLATFORM_TO_STRING[entity.platform ],
                mobileOs: convertMobileOsToString(entity.mobileOs),
                status: APPLICATION_STATUS_TO_STRING[entity.status],
                appliedAt: entity.appliedAt,
                updatedAt: entity.updatedAt,
                postInfo: postInfo,
                applicantId: entity.applicant?.userId
            }
        );
    }
    private toEntity(model: ApplicationModel): ApplicationEntity {
        return this.applicationRepository.create({
            ...(model.id && { appId: model.id }),
            platform: STRING_TO_PLATFORM[model.platform],
            mobileOs: convertStringToMobileOs(model.mobileOs),
            status: STRING_TO_APPLICATION_STATUS[model.status],
        //    ...('thumbnailUrl' in model.postInfo && {recruitPost: { postId: model.postInfo.postId }}),
            // applicant: { userId: model.applicantId },
        });
    }


    public async create(application: ApplicationModel): Promise<ApplicationModel> {
        const entity = await this.applicationRepository.findOne({
            where: {
                recruitPost: { postId: application.postInfo.postId },
                applicant: { userId: application.applicantId }
            },
            relations: ['post', 'applicant']
        });
        if (entity) {
            throw createError(409, "Application already exists");
        }
        const appEntity = this.toEntity(application);
        const savedEntity = await this.applicationRepository.save(appEntity);

        // 저장 후 관계가 포함된 완전한 엔티티를 다시 조회합니다.
        const newApp = await this.applicationRepository.findOne({
            where: { appId: savedEntity.appId },
            relations: ['post', 'applicant']
        });
        return this.toApplicationModel(newApp);
    }

    public async update(application: ApplicationModel): Promise<ApplicationModel> {
        // const status = application.status === 'pending' ? ApplicationStatus.PENDING :
        //     (application.status === 'accepted' ? ApplicationStatus.ACCEPTED :
        //         (application.status === 'rejected' ? ApplicationStatus.REJECTED : ApplicationStatus.CANCEL));

        // await this.applicationRepository.update(application.id, {
        //     status: status
        // });
        const appEntity = this.toEntity(application);
        await this.applicationRepository.save(appEntity);

        const result = await this.applicationRepository.findOne({
            where: { appId: application.id },
            relations: ['post', 'applicant']
        });
        return this.toApplicationModel(result!);
    }

    public async cancel(id: number): Promise<ApplicationModel> {
        const findApp = await this.applicationRepository.findOne({
            where: { appId: id },
            relations: ['post', 'applicant']
        });
        if (!findApp) {
            throw new Error("Application not found");
        }
        findApp.status = ApplicationStatus.CANCEL;
        await this.applicationRepository.save(findApp);
        return this.toApplicationModel(findApp);
    }
    public async acceptUser(userId: string, postId: string): Promise<ApplicationModel> {
        const application = await this.applicationRepository.findOne({
            where: {
                applicant: { userId },
                recruitPost: { postId },
            },
            relations: ['applicant', 'post']
        });

        if (!application) {
            throw new Error('Application not found');
        }
        if (application.status === ApplicationStatus.ACCEPTED) {
            return this.toApplicationModel(application);
            // throw new Error('Application already accepted');
        }
        application.status = ApplicationStatus.ACCEPTED;
        await this.applicationRepository.save(application);
        return this.toApplicationModel(application);
    }
    public async rejectUser(userId: string, postId: string): Promise<ApplicationModel> {
        const application = await this.applicationRepository.findOne({
            where: {
                applicant: { userId },
                recruitPost: { postId },
            },
            relations: ['applicant', 'post']
        });

        if (!application) {
            throw new Error(`Application not found for user ${userId} and post ${postId}`);
        }

        application.status = ApplicationStatus.REJECTED;
        await this.applicationRepository.save(application);
        return this.toApplicationModel(application);
    }

    public async findApplicationsByUserId(userId: string): Promise<ApplicationModel[]> {
        const applicationEntities = await this.applicationRepository.find({
            where: { applicant: { userId: userId } },
            relations: ['applicant', 'post']
        });
        if (!applicationEntities) {
            throw new Error("Application not found");
        }
        // console.log(applicationEntities);
        return applicationEntities.map(entity => this.toApplicationModel(entity));

    }

    public async getPostApplicantsInfo(applicationIds: number[]): Promise<ApplicationModel[]> {
        const applicants = await this.applicationRepository.find({
            where: { appId: In(applicationIds) },
            relations: ['applicant', 'post']
        });
        return applicants.map(entity => this.toApplicationModel(entity));
    }
    // public async getRecruitApplications(applicationIds: number[]): Promise<ApplicationModel[]> {
    //     const applications = await this.applicationRepository.find({
    //         where: { appId: In(applicationIds) },
    //         relations: ['applicant', 'post', 'reviews']
    //     });
    //     return applications.map(entity => this.toApplicationModel(entity));
    // }
}