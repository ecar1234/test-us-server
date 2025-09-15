import { ImagesModel } from "../domain/entities/ImagesModel";
import { ImagesRepositoryImpl } from "../infrastructure/repositories/ImagesRepositoryImpl";
import fs from "fs";


export class ImagesUseCase {
    constructor(
        private imagesRepo: ImagesRepositoryImpl
    ){}

    async imagesResistation(images: object[], postId: string): Promise<ImagesModel[]>{
        const models: ImagesModel[] = images.map((image: any) => {
            return new ImagesModel( null, image.filename, image.originalname, image.mimetype, image.size, image.url, postId );
        });
        // console.log(models);
        return this.imagesRepo.imagesResistation(models);
    }
    
    async imagesUpdate(images: object[]): Promise<ImagesModel[]>{
        
        const models: ImagesModel[] = images.map((image: any) => {
            if(fs.existsSync(image.path)) fs.unlinkSync(image.path);
            return new ImagesModel( image.id, image.filename, image.originalname, image.mimetype, image.size, image.url, null );
        });
        return this.imagesRepo.imagesUpdate(models);
    }

    async imagesDownload(id: number): Promise<ImagesModel>{
        return this.imagesRepo.imagesDownload(id);
    }

    async imagesDelete(info: number[]): Promise<boolean>{
        return this.imagesRepo.imagesDelete(info);
    }
}