import { AppDataSource } from "../../config/DataSource";
import { ImagesModel } from "../../domain/entities/ImagesModel";
import { IImagesRepository } from "../../domain/interface_repositories/IImagesRepository";
import { ImagesEntity } from "../entities/ImagesEntity";
import { PostEntity } from "../entities/PostEntity";


export class ImagesRepositoryImpl implements IImagesRepository {
    private imageRepo = AppDataSource.getRepository(ImagesEntity);

    private toDomainModel(entity: ImagesEntity) {
        return new ImagesModel(
            entity.id,
            entity.filename,
            entity.originalname,
            entity.mimetype,
            entity.size,
            entity.url,
            entity.post.postId,
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
        entity.post = { postId: model.postId } as PostEntity;

        return entity;
    }

    async imagesResistation(images: ImagesModel[]): Promise<ImagesModel[]> {
        const entities = images.map(image => this.toEntityModel(image));
        return await this.imageRepo.save(entities).then(entities => entities.map(entity => this.toDomainModel(entity)));
    }
    async imagesUpdate(images: ImagesModel[]): Promise<ImagesModel[]> {
        const entities = images.map(image => this.toEntityModel(image));
        await this.imageRepo.save(entities);
        return entities.map(entity => this.toDomainModel(entity));
    }
    async imagesDownload(id: number): Promise<ImagesModel> {
        throw new Error("Method not implemented.");
    }
    async imagesDelete(info: number[]): Promise<boolean> {
        try {
            await this.imageRepo.delete(info);
            return true;
        } catch (e) {
            throw new Error(e.toString());
        }
    }
}