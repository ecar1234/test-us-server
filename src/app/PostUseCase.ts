import { PromotionPostModel } from "../domain/entities/PromotionPostModel";
import { RecruitmentPostModel } from "../domain/entities/RecruitmentPostModel";
import { UserEntity } from "../infrastructure/entities/UserEntity";
import { PostRepositoryImpl } from "../infrastructure/repositories/PostRepositoryImpl";
import { PromotionPostRepositoryImpl } from "../infrastructure/repositories/PromotionPostRepositoryImpl";
import { RecruitmentPostRepositoryImpl } from "../infrastructure/repositories/RecruitmentPostRepositoryImpl";
import fs from "fs";
import path from "path";
import { URL } from "url";
import { Env } from "../config/env";
import { FirebaseRepositoryImpl } from "../infrastructure/repositories/FirebaseRepositoryImpl";
import { FCMPayload } from "../interface/interfaces/types";
import { sendNotificationToMultiUser } from "../service/firebase/FcmService";

interface UploadedImageInfo {
    filename: string;
    originalname: string;
    mimetype: string;
    size: number;
    url: string;
}

interface ImageToDelete {
    filename: string;
    url: string;
}

export class PostUseCase {
    constructor(
        private postRepo: PostRepositoryImpl,
        private recruitRepo: RecruitmentPostRepositoryImpl,
        private promotionRepo: PromotionPostRepositoryImpl,
        private fireRepository: FirebaseRepositoryImpl
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
        // console.log(recruitPosts);
        return [recruitPosts, promotionPosts];
    }
   // Recruitment
        async createRecruitPost(author: UserEntity, title: string, subtitle: string, platform: string, mobileOs: string[], category: string, contents: string, images: UploadedImageInfo[], status: string = 'active', period: number = 7): Promise<RecruitmentPostModel> {
        const post = new RecruitmentPostModel(null, author.userId, title, subtitle, platform, mobileOs, category, contents, status, period, 0, images);
        return this.recruitRepo.createPost(post);
    }
    async updateRecruitPost(id: string, author: UserEntity, title: string, subtitle: string, platform: string, mobileOs: string[], category: string, contents: string, status: string = 'active', deleteImages: ImageToDelete[] = [], newImages: UploadedImageInfo[] = []): Promise<RecruitmentPostModel> {
        // 1. 기존 게시물 정보 가져오기
        const existingPost = await this.recruitRepo.getPostById(id);
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
        const postModel = new RecruitmentPostModel(id, author.userId, title, subtitle, platform, mobileOs, category, contents, status, undefined, undefined, finalImages);
        const updatedPost = await this.recruitRepo.updatePost(postModel);

        return updatedPost;
    }
    async endRecruitPost(id: string): Promise<RecruitmentPostModel> {
        // Use a method that fetches the post regardless of its current status.
        const post = await this.recruitRepo.findPostAndStatus(id, 'end');
        if (!post) {
            throw new Error("Post not found");
        }

        const message: FCMPayload = {
            tokens: await this.fireRepository.getMessingTokens(post.applications.map(app => app.user.id)),
            notification: {
                title: 'TESTUS',
                body:`${post.title}의 테스트가 종료되었습니다. 리뷰 관리에서 피드백을 남겨주세요.`
            },
            data: {
                type:'recruit',
                postTitle: post.title,
            }
        }
        const result = await sendNotificationToMultiUser(message);
        if(result.length > 0){
            await this.fireRepository.revmoeMessingTokens(result);
        }
        
        return this.recruitRepo.updatePost(post);
    }
    async deleteRecruitPost(id: string): Promise<boolean> {
        const post = await this.recruitRepo.getPostById(id);
        if (!post) {
            return false; // Or throw an error
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

    async getAppRecruitPosts(ids: string[]): Promise<RecruitmentPostModel[]> {
        return this.recruitRepo.getAppRecruitPosts(ids);
    }
    // async getPostsByNickname(nickname: string): Promise<PostModel[]> {
    //    return this.postRepository.getPostsByNickname(nickname);
    // }

    // Promotion
    async createPromotionPost(author: UserEntity, title: string, subtitle: string, platform: string, mobileOs: string[], category: string, contents: string, images: object[], domain: string[], status: string = 'active', period: number = 7): Promise<PromotionPostModel> {
        const post = new PromotionPostModel(null, author.userId, title, subtitle, platform, mobileOs, category, contents, status, period, 0, images, domain);
        return this.promotionRepo.createPost(post);
    }
    async updatePromotionPost(id: string, author: UserEntity, title: string, subtitle: string, platform: string, mobileOs: string[], category: string, contents: string, domain: string[], status: string = 'active', deleteImages: ImageToDelete[] = [], newImages: UploadedImageInfo[] = []): Promise<PromotionPostModel> {
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
        const postModel = new PromotionPostModel(id, author.userId, title, subtitle, platform, mobileOs, category, contents, status, undefined, undefined, finalImages, domain);
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
    async getPromotionPostPagination(page: number, size: number): Promise<PromotionPostModel[]> {
        const posts = await this.promotionRepo.getPostsPaginations(page, size);
        if(!posts){
            return [];
        }
        return this.promotionRepo.getPostsPaginations(page, size);
    }
    async getPromotionPostsByAuthor(authorId: string): Promise<PromotionPostModel[]> {
        return this.promotionRepo.getPostsByAuthor(authorId);
    }
}