import { PromotionPostModel } from "../domain/entities/PromotionPostModel";
import { RecruitmentPostModel } from "../domain/entities/RecruitmentPostModel";
import { UserEntity } from "../infrastructure/entities/UserEntity";
import { PostRepositoryImpl } from "../infrastructure/repositories/PostRepositoryImpl";
import { PromotionPostRepositoryImpl } from "../infrastructure/repositories/PromotionPostRepositoryImpl";
import { RecruitmentPostRepositoryImpl } from "../infrastructure/repositories/RecruitmentPostRepositoryImpl";
import { ImagesRepositoryImpl } from "../infrastructure/repositories/ImagesRepositoryImpl";
import { ImagesModel } from "../domain/entities/ImagesModel";
import fs from "fs";
import path from "path";
import { URL } from "url";
import { Env } from "../config/env";

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

export class PostUseCase {
    constructor(
        private postRepo: PostRepositoryImpl,
        private recruitRepo: RecruitmentPostRepositoryImpl,
        private promotionRepo: PromotionPostRepositoryImpl,
        private imagesRepo: ImagesRepositoryImpl
    ) { }

    async getInitPosts(): Promise<[ (RecruitmentPostModel | PromotionPostModel | PromotionPostModel)[], RecruitmentPostModel[], PromotionPostModel[] ]> {
        const favoritePosts = await this.postRepo.getFavoritePosts();
        const recriutPosts = await this.recruitRepo.getPostsPaginations(1);
        const promotionPosts = await this.promotionRepo.getPostsPaginations(1);
        // const promotionPosts = await this.promotionRepo.getPostsPaginations(1);

        return [favoritePosts, recriutPosts, promotionPosts];
    }

    async getInitUserPosts(userId: string): Promise<[RecruitmentPostModel[], PromotionPostModel[]]> {
        const recruitPosts = await this.recruitRepo.getUserRecuritmentPosts(userId);
        const promotionPosts = await this.promotionRepo.getUserPromotionPosts(userId);
        console.log(recruitPosts);
        return [recruitPosts, promotionPosts];
    }
   // Recruitment
        async createRecruitPost(author: UserEntity, title: string, subtitle: string, platform: string[], contents: string, images: object[], status: string = 'active', period: number = 7): Promise<RecruitmentPostModel> {
        console.log(author.userId);
        const post = new RecruitmentPostModel(null, author.userId, title, subtitle, platform, contents, status, period, 0, images);
        return this.recruitRepo.createPost(post);
    }
    async updateRecruitPost(id: string, author: UserEntity, title: string, subtitle: string, platform: string[], contents: string, status: string = 'active', deleteImages: ImageToDelete[] = [], newImages: UploadedImageInfo[] = []): Promise<RecruitmentPostModel> {
        // 1. 텍스트 정보로 게시물 업데이트
        const postModel = new RecruitmentPostModel(id, author.userId, title, subtitle, platform, contents, status);
        const updatedPost = await this.recruitRepo.updatePost(postModel);

        // 2. 이미지 삭제 처리 (DB + File System)
        if (deleteImages && deleteImages.length > 0) {
            const imageIdsToDelete = deleteImages.map(img => img.id);
            const deleteResult = await this.imagesRepo.imagesDelete(imageIdsToDelete);

            if (deleteResult) {
                const deletePromises = deleteImages.map(async (image) => {
                    try {
                        const filename = path.basename(new URL(image.url).pathname);
                        const imagePath = path.join(Env.UPLOAD_URL, filename);
                        await fs.promises.unlink(imagePath);
                    } catch (error) {
                        if (error.code !== 'ENOENT') {
                            console.error(`Failed to delete image file: ${error.message}`);
                        }
                    }
                });
                await Promise.all(deletePromises);
            }
        }

        // 3. 새 이미지 추가
        if (newImages && newImages.length > 0) {
            const modelsToSave: ImagesModel[] = newImages.map(image => new ImagesModel(null, image.filename, image.originalname, image.mimetype, image.size, image.url, id, 'recruitment'));
            await this.imagesRepo.imagesRegister(modelsToSave, id, 'recruitment');
        }

        // 4. 최종 게시물 정보(이미지 포함) 반환
        return this.recruitRepo.getPostById(id);
    }
    async deleteRecruitPost(id: string): Promise<boolean> {
        const post = await this.recruitRepo.getPostById(id);
        if (!post) {
            return false; // Or throw an error
        }

        if (post.images && post.images.length > 0) {
            const imageIdsToDelete = post.images.map((img : {id: number, url: string}) => img.id);
            const deleteDbResult = await this.imagesRepo.imagesDelete(imageIdsToDelete);

            if (deleteDbResult) {
                const deleteFilePromises = post.images.map(async (image: {id: number, url: string}) => {
                    try {
                        const filename = path.basename(new URL(image.url).pathname);
                        const imagePath = path.join(Env.UPLOAD_URL, filename);
                        await fs.promises.unlink(imagePath);
                    } catch (error) {
                        if (error.code !== 'ENOENT') {
                            console.error(`Failed to delete image file: ${error.message}`);
                        }
                    }
                });
                await Promise.all(deleteFilePromises);
            }
        }
        return await this.recruitRepo.deletePost(id);
    }
    async getRecruitPostById(id: string): Promise<RecruitmentPostModel> {
        return this.recruitRepo.getPostById(id);
    }
    async getUserRecuritmentPosts(userId: string): Promise<RecruitmentPostModel[]> {
        // 이제 Repository에서 모든 변환을 처리하므로, UseCase는 간단히 데이터를 요청하기만 하면 됩니다.
        return this.recruitRepo.getUserRecuritmentPosts(userId);
    }
    async getRecruitPostByTitle(title: string): Promise<RecruitmentPostModel> {
        return this.recruitRepo.getPostByTitle(title);
    }
    async getRecruitPostPagination(page: number, size: number): Promise<RecruitmentPostModel[]> {

        const posts = await this.recruitRepo.getPostsPaginations(page, size);
        // console.log(posts);
        return posts;
    }
    async getRecruitPostsByAuthor(authorId: string): Promise<RecruitmentPostModel[]> {
        return this.recruitRepo.getPostsByAuthor(authorId);
    }
    // async getPostsByNickname(nickname: string): Promise<PostModel[]> {
    //    return this.postRepository.getPostsByNickname(nickname);
    // }

    // Promotion
    async createPromotionPost(author: UserEntity, title: string, subtitle: string, platform: string[], contents: string, images: object[], domain: string[], status: string = 'active', period: number = 7): Promise<PromotionPostModel> {
        const post = new PromotionPostModel(null, author.userId, title, subtitle, platform, contents, status, period, 0, images, domain);
        return this.promotionRepo.createPost(post);
    }
    async updatePromotionPost(id: string, author: UserEntity, title: string, subtitle: string, platform: string[], contents: string, domain: string[], status: string = 'active', deleteImages: ImageToDelete[] = [], newImages: UploadedImageInfo[] = []): Promise<PromotionPostModel> {
        // 1. 텍스트 정보로 게시물 업데이트
        const postModel = new PromotionPostModel(id, author.userId, title, subtitle, platform, contents, status, undefined, undefined, undefined, domain);
        await this.promotionRepo.updatePost(postModel);

        // 2. 이미지 삭제 처리 (DB + File System)
        if (deleteImages && deleteImages.length > 0) {
            const imageIdsToDelete = deleteImages.map(img => img.id);
            const deleteResult = await this.imagesRepo.imagesDelete(imageIdsToDelete);

            if (deleteResult) {
                const deletePromises = deleteImages.map(async (image) => {
                    try {
                        const filename = path.basename(new URL(image.url).pathname);
                        const imagePath = path.join(Env.UPLOAD_URL, filename);
                        await fs.promises.unlink(imagePath);
                    } catch (error) {
                        if (error.code !== 'ENOENT') {
                            console.error(`Failed to delete image file: ${error.message}`);
                        }
                    }
                });
                await Promise.all(deletePromises);
            }
        }

        // 3. 새 이미지 추가
        if (newImages && newImages.length > 0) {
            const modelsToSave: ImagesModel[] = newImages.map(image => new ImagesModel(null, image.filename, image.originalname, image.mimetype, image.size, image.url, id, 'promotion'));
            await this.imagesRepo.imagesRegister(modelsToSave, id, 'promotion');
        }

        // 4. 최종 게시물 정보(이미지 포함) 반환
        return this.promotionRepo.getPostById(id);
    }
    async deletePromotionPost(id: string): Promise<boolean> {
        const post = await this.promotionRepo.getPostById(id);
        if (!post) {
            return false;
        }

        if (post.images && post.images.length > 0) {
            const imageIdsToDelete = post.images.map((img : {id: number, url: string}) => img.id);
            const deleteDbResult = await this.imagesRepo.imagesDelete(imageIdsToDelete);

            if (deleteDbResult) {
                const deleteFilePromises = post.images.map(async (image: {id: number, url: string}) => {
                    try {
                        const filename = path.basename(new URL(image.url).pathname);
                        const imagePath = path.join(Env.UPLOAD_URL, filename);
                        await fs.promises.unlink(imagePath);
                    } catch (error) {
                        if (error.code !== 'ENOENT') {
                            console.error(`Failed to delete image file: ${error.message}`);
                        }
                    }
                });
                await Promise.all(deleteFilePromises);
            }
        }
        return await this.promotionRepo.deletePost(id);
    }
    async getPromotionPostById(id: string): Promise<PromotionPostModel> {
        return this.promotionRepo.getPostById(id);
    }
    async getUserPromotionPosts(userId: string): Promise<PromotionPostModel[]> {
        return this.promotionRepo.getUserPromotionPosts(userId);
    }
    async getPromotionPostByTitle(title: string): Promise<PromotionPostModel> {
        return this.promotionRepo.getPostByTitle(title);
    }
    async getPromotionPostPagination(page: number): Promise<PromotionPostModel[]> {
        return this.promotionRepo.getPostsPaginations(page);
    }
    async getPromotionPostsByAuthor(authorId: string): Promise<PromotionPostModel[]> {
        return this.promotionRepo.getPostsByAuthor(authorId);
    }
}