import path from "path";
import fs from "fs"
import { PromotionPostModel } from "../../domain/entities/PromotionPostModel.js";
import { UserEntity } from "../../infrastructure/entities/UserEntity.js";
import { PromotionPostRepositoryImpl } from "../../infrastructure/repositories/PromotionPostRepositoryImpl.js";
import { ImageToDelete, UploadedImageInfo } from "../../domain/entities/interface/PostType.js";
import { Env } from "../../config/env.js";



export class PromotionPostUseCase {
    constructor(private promotionRepo: PromotionPostRepositoryImpl) { }

    // async getPostById(id: string): Promise<any> {
    //     return this.repository.getPostById(id);
    // }

    async createPromotionPost(author: UserEntity, title: string, subtitle: string, platform: string, mobileOs: string, category: string, contents: string, images: object[], domain: string, status: string = 'active', period: number = 7): Promise<PromotionPostModel> {
        const post = new PromotionPostModel({
            id: null,
            author: author,
            title: title,
            subtitle: subtitle,
            platform: platform,
            mobileOs: mobileOs,
            category: category,
            contents: contents,
            status: status,
            period: period,
            images: images,
            domain: domain
        });
        return this.promotionRepo.createPost(post);
    }
    async updatePromotionPost(id: string, author: UserEntity, title: string, subtitle: string, platform: string, mobileOs: string, category: string, contents: string, domain: string, status: string = 'active', deleteImages: ImageToDelete[] = [], newImages: UploadedImageInfo[] = []): Promise<PromotionPostModel> {
        // 1. 기존 게시물 정보 가져오기
        const existingPost = await this.promotionRepo.getPostById(id);
        if (!existingPost) {
            throw new Error("Post not found");
        }
        const isProd = process.env.NODE_ENV === "prod";
        const envPath = isProd ? process.env.MAIN_UPLOAD_URL : process.env.UPLOAD_URL;
        // 2. 이미지 파일 삭제 처리
        if (deleteImages && deleteImages.length > 0) {
            const deletePromises = deleteImages.map(async (image) => {
                try {
                    const filename = path.basename(new URL(image.url).pathname);
                    const imagePath = path.join(envPath, filename);
                    await fs.promises.unlink(imagePath);
                } catch (error) {
                    if (error.code !== 'ENOENT') {
                        console.error(`Failed to delete image file: ${error.message}`);
                    }
                }
            });
            await Promise.all(deletePromises);
        }

        // 3. 이미지 목록 업데이트
        const remainingImageFilenames = new Set(deleteImages.map(img => img.filename));
        const remainingImages = (existingPost.images || []).filter((img: { filename: string }) => !remainingImageFilenames.has(img.filename));
        const finalImages = [...remainingImages, ...newImages];

        // 4. 게시물 모델 업데이트
        const postModel = new PromotionPostModel({
            id: id,
            author: author.userId,
            title: title,
            subtitle: subtitle,
            platform: platform,
            mobileOs: mobileOs,
            category: category,
            contents: contents,
            status: status,
            period: existingPost.period,
            images: finalImages,
            domain: domain
        });
        const updatedPost = await this.promotionRepo.updatePost(postModel);

        return updatedPost;
    }
    async deletePromotionPost(id: string): Promise<boolean> {
        const post = await this.promotionRepo.getPostById(id);
        if (!post) {
            return false;
        }

        if (post.images && post.images.length > 0) {
            const deleteFilePromises = post.images.map(async (image: { url: string }) => {
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
    async getPromotionPostPagination(page: number, size: number): Promise<[PromotionPostModel[], number, boolean]> {
        const posts = await this.promotionRepo.getPostsPaginations(page, size);
        if (!posts) {
            return [[] as PromotionPostModel[], page, true];
        }
        const isLast = page * size >= posts.length;

        return [posts, page, isLast];
    }
    async getPromotionPostsByAuthor(authorId: string): Promise<PromotionPostModel[]> {
        return this.promotionRepo.getPostsByAuthor(authorId);
    }

}