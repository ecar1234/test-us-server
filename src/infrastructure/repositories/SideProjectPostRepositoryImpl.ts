import { AppDataSource } from "../../config/DataSource.js";
import { ProjectRoleModel } from "../../domain/entities/SideProject/ProjectRoleModel.js";
import { SideProjectPostModel } from "../../domain/entities/SideProject/SideProjectPostModel.js";
import { ISideProjectPostRepository } from "../../domain/interface_repositories/ISideProjectPostRepository.js";
import { convertCategoryToString, convertStringToCategory, MOBILE_OS_STRING, POST_STATUS_TO_STRING, STRING_MOBILE_OS, STRING_TO_POST_STATUS } from "../../utils/convertUtil.js";
import { TResSideProjectApplications } from "../entities/package/SideProjectPackage.js";
import { BasePostStateType } from "../entities/PostEntities/BasePostEntity.js";
import { ProjectRoleEntity } from "../entities/PostEntities/SideProject/ProjectRoleEntity.js";
import { SideProjectPostEntity } from "../entities/PostEntities/SideProject/SideProjectPostEntity.js";


export class SideProjectPostRepositoryImpl implements ISideProjectPostRepository {

    private sideRepo = AppDataSource.getRepository(SideProjectPostEntity);

    private toEntity(model: SideProjectPostModel): SideProjectPostEntity {

        let authorRelation: { userId: string } | undefined = undefined;
        if (model.author) {
            if (typeof model.author === 'string') {
                authorRelation = { userId: model.author };
            } else if (typeof model.author === 'object' && model.author !== null && 'userId' in model.author && model.author.userId) {
                // post.author.userId가 falsy(undefined, null, 빈 문자열 등)가 아닌지 확인합니다.
                authorRelation = { userId: model.author.userId };
            } else {
                // author 객체는 있지만 userId가 유효하지 않은 경우에 대한 방어 코드
            }
        }

        const db: SideProjectPostEntity = this.sideRepo.create({
            ...(model.id && { postId: model.id }),
            ...(authorRelation && { author: authorRelation }),
            title: model.title,
            contents: model.contents,
            platform: model.platform,
            mobileOs: STRING_MOBILE_OS[model.mobileOs],
            category: convertStringToCategory(model.category),
            views: model.views,
            status: STRING_TO_POST_STATUS[model.status],
            period: model.period,
            sprintDutations: model.sprintDurations,
            referenceLink: model.referenceLink,
            projectRoles: model.projectRoles.map((role) => ({
                ...(role.id && {id: role.id}),
                roleName: role.roleName,
                requiredCount: role.requiredCount,
                currentCount: role.currentCount,
                isClosed: role.isClosed
            })),
            expiredAt: model.expiredAt,
        });
        return db;
    }
    private toModel(entity: SideProjectPostEntity): SideProjectPostModel {
        const projectRoles = entity.projectRoles.map((e) => {
            return new ProjectRoleModel({
                id: e.id,
                roleName: e.roleName,
                requiredCount: e.requiredCount,
                currentCount: e.currentCount,
                isClosed: e.isClosed
            });
        });
        return new SideProjectPostModel({
            id: entity.postId,
            author: entity.author,
            // postType: entity.,
            title: entity.title,
            contents: entity.contents,
            platform: entity.platform,
            mobileOs: MOBILE_OS_STRING[entity.mobileOs],
            category: convertCategoryToString(entity.category),
            views: entity.views,
            status: POST_STATUS_TO_STRING[entity.status],
            period: entity.period,
            sprintDurations: entity.sprintDutations,
            referenceLink: entity.referenceLink,
            projectRoles: projectRoles,
            // applications?: number[],
            expiredAt: entity.expiredAt,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt

        });
    }


    async upsert(post: SideProjectPostModel): Promise<SideProjectPostModel> {
        const entity = this.toEntity(post);
        const save = await this.sideRepo.save(entity);
        const result = this.toModel(save);
        return result;
    }

    async update(postId: string, state: string): Promise<SideProjectPostModel> {
        const findPost = await this.sideRepo.findOne({
            where: { postId: postId },
        });

        if (!findPost) {
            throw new Error('Side project post not found.');
        }

        const entityState = STRING_TO_POST_STATUS[state];

        findPost.status = entityState;
        const updatedEntity = await this.sideRepo.save(findPost);

        return this.toModel(updatedEntity);
    }

    async getProjectPostByPostId(postId: string): Promise<SideProjectPostModel> {
        const findPost = await this.sideRepo.findOne({
            where: { postId: postId },
            relations: {
                projectRoles: true,
                applications: true
            }
        });

        if (!findPost) {
            throw new Error('Side project post not fount');
        }
        return this.toModel(findPost);
    }

    async getProjectPostsByUserId(userId: string): Promise<SideProjectPostModel[]> {
        const findPosts = await this.sideRepo.find({
            where: { author: { userId: userId } },
            relations: {
                projectRoles: true,
                applications: true
            }
        });

        if (!findPosts) {
            return [];
        }
        return findPosts.map((post) => this.toModel(post));
    }

    async getProjectApplicantsByPostId(postId: string): Promise<number[]> {
        const findPost = await this.sideRepo.findOne({
            where:{postId: postId},
            relations: {
                projectRoles: true,
                applications: true
            }
        });
        if(!findPost){
            throw new Error(`[Side Project Repo] not found post: ${postId}`);
        }
        if(!findPost.applications){
            return [];
        }
        return findPost.applications.map((e) => e.appId);
    }
    // applicaion repo 로 이동
    // async getUserApplicationProjectPosts(userId: string): Promise<SideProjectPostModel[]> {
    //     throw new Error("Method not implemented.");
    // }

    async getPostsPagination(page: number): Promise<SideProjectPostModel[]> {
        throw new Error("Method not implemented.");
    }

}
