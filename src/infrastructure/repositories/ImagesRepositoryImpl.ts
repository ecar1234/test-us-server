import { In } from "typeorm";
import { AppDataSource } from "../../config/DataSource";
import { PromotionPostEntity } from "../entities/PromotionPostEntity";
import { ImagesModel } from "../../domain/entities/ImagesModel";
import { IImagesRepository } from "../../domain/interface_repositories/IImagesRepository";
import { ImagesEntity } from "../entities/ImagesEntity";
import { RecruitmentPostEntity } from "../entities/RecruitmentPostEntity";


export class ImagesRepositoryImpl implements IImagesRepository {
    private imageRepo = AppDataSource.getRepository(ImagesEntity);

    private toDomainModel(entity: ImagesEntity, postId?: string): ImagesModel {
        const entityPostId = postId ?? entity.postId;
        if (!entityPostId) {
            // 이 경우는 로직상 발생해서는 안 되지만, 안전을 위해 에러 처리를 추가합니다.
            throw new Error("Image entity is missing postId.");
        }
        return new ImagesModel(
            entity.id,
            entity.filename,
            entity.originalname,
            entity.mimetype,
            entity.size,
            entity.url,
            entityPostId,
            entity.postType,
            entity.createdAt,
            entity.updatedAt
        );
    }
    private toEntityModel(model: ImagesModel) {
        const entity = new ImagesEntity();
        // 'id'는 자동 생성되므로, 업데이트 시에만 값을 설정합니다.
        if (model.id) {
            entity.id = model.id;
        }
        entity.filename = model.filename;
        entity.originalname = model.originalname;
        entity.mimetype = model.mimetype;
        entity.size = model.size;
        entity.url = model.url;
        entity.postId = model.postId;
        entity.postType = model.postType;

        return entity;
    }

    async imagesRegister(images: ImagesModel[], postId: string, postType: string): Promise<ImagesModel[]> {
        if (images.length === 0) {
            return [];
        }

        return await this.imageRepo.manager.transaction(async (transactionalEntityManager) => {
            // 새로운 이미지 엔티티 생성
            const newImageEntities = images.map(image => this.toEntityModel({ ...image, postId, postType }));

            // 새 이미지들을 데이터베이스에 저장
            const savedEntities = await transactionalEntityManager.save(ImagesEntity, newImageEntities);

            return savedEntities.map(entity => this.toDomainModel(entity));
        });
    }

    async imagesUpdate(images: ImagesModel[], postId: string, postType: string): Promise<ImagesModel[]> {
        return await this.imageRepo.manager.transaction(async (transactionalEntityManager) => {

            const imagesToSave = images.map(image => this.toEntityModel(image));
            await transactionalEntityManager.save(ImagesEntity, imagesToSave);

            const finalImages = await transactionalEntityManager.find(ImagesEntity, {
                where: { postId: postId, postType: postType },
            });

            return finalImages.map(entity => this.toDomainModel(entity));
        });

    }
    async imagesDownload(id: number): Promise<ImagesModel> {
        throw new Error("Method not implemented.");
    }
    async imagesDelete(deleteImages: number[]): Promise<boolean> {
        try {
            const res = await this.imageRepo.delete(deleteImages);
            if(res.affected === 0){
                return true;
            }else {
                return false;
            }
        } catch (e) {
            throw new Error(e.toString());
        }
    }
}