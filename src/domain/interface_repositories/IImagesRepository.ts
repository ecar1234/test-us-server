import { ImagesModel } from "../entities/ImagesModel";

export interface IImagesRepository {
    imagesRegister(images: ImagesModel[], postId: string): Promise<ImagesModel[]>;
    imagesUpdate(images: ImagesModel[], postId: string): Promise<ImagesModel[]>;
    imagesDownload(id: number): Promise<ImagesModel>;
    imagesDelete(deleteImages: number[]): Promise<boolean>;
}