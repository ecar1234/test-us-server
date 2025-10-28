import { Env } from "../config/env";
import { ImagesModel } from "../domain/entities/ImagesModel";
import { ImagesRepositoryImpl } from "../infrastructure/repositories/ImagesRepositoryImpl";
import fs from "fs";
import path from "path";
import { URL } from "url";
import { RecruitmentPostRepositoryImpl } from "../infrastructure/repositories/RecruitmentPostRepositoryImpl";
import { RecruitmentPostModel } from "../domain/entities/RecruitmentPostModel";
import { PromotionPostModel } from "../domain/entities/PromotionPostModel";
import { PromotionPostRepositoryImpl } from "../infrastructure/repositories/PromotionPostRepositoryImpl";

// 컨트롤러에서 전달되는 데이터의 타입을 명확하게 정의합니다.
interface UploadedImageInfo {
    filename: string;
    originalname: string;
    mimetype: string;
    size: number;
    url: string;
}

interface ImageToDelete {
    id: number;
    url: string;
}

type AnyPostModel = RecruitmentPostModel | PromotionPostModel;


export class ImagesUseCase {
    constructor(
        private imagesRepo: ImagesRepositoryImpl,
        private recruitmentRepo: RecruitmentPostRepositoryImpl,
        private promotionRepo: PromotionPostRepositoryImpl
    ) { }

    async imagesRegister(images: UploadedImageInfo[], postId: string, postType: string): Promise<ImagesModel[]> {
        const models: ImagesModel[] = images.map((image) => {
            return new ImagesModel(null, image.filename, image.originalname, image.mimetype, image.size, image.url, postId, postType);
        });
        
        return await this.imagesRepo.imagesRegister(models, postId, postType);
    }

    async imagesUpdate(deleteImages: ImageToDelete[], newImages: UploadedImageInfo[], postId: string, postType: string): Promise<AnyPostModel> {
        // Repository에는 삭제할 이미지의 ID만 필요합니다.

        if (deleteImages && deleteImages.length > 0) {
            const modelsToDelete = deleteImages.map(img => img.id);
            const deleteResult = this.imagesRepo.imagesDelete(modelsToDelete);

            if (deleteResult) {
                const deletePromises = deleteImages.map(async (image) => {
                    try {
                        // URL에서 파일명을 안전하게 추출합니다.
                        const filename = path.basename(new URL(image.url).pathname);
                        console.log('filename', filename);
                        const imagePath = path.join(Env.UPLOAD_URL, filename);
                        console.log('imagePath', imagePath);
                        await fs.promises.unlink(imagePath);
                    } catch (error) {
                        // 파일이 이미 없거나(ENOENT) 다른 오류 발생 시, 에러를 기록하되 전체 요청을 실패시키지는 않습니다.
                        if (error.code !== 'ENOENT') {
                            console.error(`Failed to delete image file with URL ${image.url}: ${error.message}`);
                        }
                    }
                });
                await Promise.all(deletePromises);
            }
        }
        if(newImages && newImages.length > 0){
            const modelsToSave: ImagesModel[] = newImages.map((image) => {
                return new ImagesModel(null, image.filename, image.originalname, image.mimetype, image.size, image.url, postId, postType);
            });
            await this.imagesRepo.imagesUpdate(modelsToSave, postId, postType);

        }
    
        switch (postType) {
            case 'recruitment':
                return await this.recruitmentRepo.getPostById(postId);
            case 'promotion':
                return await this.promotionRepo.getPostById(postId);
            default:
                throw new Error(`Unsupported postType: ${postType}`);
        }
    }

    async imagesDelete(deleteImages: ImageToDelete[]): Promise<boolean>{
        if (deleteImages && deleteImages.length > 0) {
            const modelsToDelete = deleteImages.map(img => img.id);
            const deleteResult = this.imagesRepo.imagesDelete(modelsToDelete);

            if (deleteResult) {
                const deletePromises = deleteImages.map(async (image) => {
                    try {
                        // URL에서 파일명을 안전하게 추출합니다.
                        const filename = path.basename(new URL(image.url).pathname);
                        console.log('filename', filename);
                        const imagePath = path.join(Env.UPLOAD_URL, filename);
                        console.log('imagePath', imagePath);
                        await fs.promises.unlink(imagePath);
                    } catch (error) {
                        // 파일이 이미 없거나(ENOENT) 다른 오류 발생 시, 에러를 기록하되 전체 요청을 실패시키지는 않습니다.
                        if (error.code !== 'ENOENT') {
                            console.error(`Failed to delete image file with URL ${image.url}: ${error.message}`);
                        }
                    }
                });
                await Promise.all(deletePromises);

                return true;
            }else {
                return false;
            }
        }else{
            return false;
        }
    }
}