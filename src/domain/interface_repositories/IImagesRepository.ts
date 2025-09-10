import { ImagesModel } from "../entities/ImagesModel";

export interface IImagesRepository {
    imagesResistation(images: ImagesModel[]): Promise<ImagesModel[]>;
    imagesUpdate(images: ImagesModel[]): Promise<ImagesModel[]>;
    imagesDownload(id: number): Promise<ImagesModel>;
    imagesDelete(info: number[]): Promise<boolean>;
}