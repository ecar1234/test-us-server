import path from "path";
import fs from 'fs';
import { RecruitmentPostModel } from "../../domain/entities/RecruitmentPostModel.js";
import { UserEntity } from "../../infrastructure/entities/UserEntity.js";
import { RecruitmentPostRepositoryImpl } from "../../infrastructure/repositories/RecruitmentPostRepositoryImpl.js";
import { FirebaseRepositoryImpl } from "../../infrastructure/repositories/FirebaseRepositoryImpl.js";
import { FCMPayload } from "../../interface/interfaces/types.js";
import { sendNotificationToMultiUser } from "../../service/firebase/FcmService.js";
import { ImageToDelete, UploadedImageInfo } from "../../domain/entities/interface/PostType.js";
import { Env } from "../../config/env.js";
import { TResRecruitApplicationUserInfo } from "../../infrastructure/entities/package/RecruitPostPackage.js";
import { UserRepositoryImpl } from "../../infrastructure/repositories/UserRepositoryImpl.js";
import { ApplicationRepositoryImpl } from "../../infrastructure/repositories/ApplicationRepositoryImpl.js";

export class RecruitmentPostUseCase {
    constructor(
        private recruitRepo: RecruitmentPostRepositoryImpl,
        private firebaseRepo: FirebaseRepositoryImpl,
        private userRepo: UserRepositoryImpl,
        private applicationRepo: ApplicationRepositoryImpl
    ) { }


    async createRecruitPost(author: UserEntity, title: string, subtitle: string, platform: string, mobileOs: string, category: string, contents: string, images: UploadedImageInfo[], status: string = 'active', period: number = 7): Promise<RecruitmentPostModel> {
            const post = new RecruitmentPostModel({
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
            });
            return this.recruitRepo.createPost(post);
        }
        async updateRecruitPost(id: string, author: UserEntity, title: string, subtitle: string, platform: string, mobileOs: string, category: string, contents: string, status: string = 'active', deleteImages: ImageToDelete[] = [], newImages: UploadedImageInfo[] = []): Promise<RecruitmentPostModel> {
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
            const postModel = new RecruitmentPostModel({
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
            });
            const updatedPost = await this.recruitRepo.updatePost(postModel);
    
            return updatedPost;
        }
        async endRecruitPost(id: string): Promise<RecruitmentPostModel> {
            // Use a method that fetches the post regardless of its current status.
            const post = await this.recruitRepo.findPostAndStatus(id, 'end');
            if (!post) {
                throw new Error("Post not found");
            }
    
            if (post.applications.length !== 0) {
                const message: FCMPayload = {
                    tokens: await this.firebaseRepo.getMessingTokens(post.applications.map(app => app.user.id)),
                    notification: {
                        title: 'TESTUS',
                        body: `${post.title}의 테스트가 종료되었습니다. 리뷰 관리에서 피드백을 남겨주세요.`
                    },
                    data: {
                        type: 'recruit',
                        title: post.title,
                    }
                }
                const result = await sendNotificationToMultiUser(message);
                if (result.length > 0) {
                    await this.firebaseRepo.revmoeMessingTokens(result);
                }
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
        async getRecruitPostPagination(page: number, size: number): Promise<[RecruitmentPostModel[], number, boolean]> {
    
            const posts = await this.recruitRepo.getPostsPaginations(page, size);
            if (!posts) {
                return [[] as RecruitmentPostModel[], page, true];
            }
            const isLast = page * size >= posts.length;
    
            return [posts, page, isLast];
        }
        async getRecruitPostsByAuthor(authorId: string): Promise<RecruitmentPostModel[]> {
            return this.recruitRepo.getPostsByAuthor(authorId);
        }
    
        async getAppRecruitPosts(ids: string[]): Promise<RecruitmentPostModel[]> {
            return this.recruitRepo.getAppRecruitPosts(ids);
        }
        async getRecruitApplicationsByPostId(postId: string): Promise<TResRecruitApplicationUserInfo[]> {
            const post = await this.recruitRepo.getPostById(postId);
            if (!post) {
                throw new Error("Post not found");
            }
            const applications = await this.applicationRepo.getPostApplicantsInfo(post.applications as number[]);
            const users = await this.userRepo.findUsersByIds(applications.map(app => app.applicantId));
            const res: TResRecruitApplicationUserInfo[] = [];
            applications.forEach((app, idx) => {
                let user = users.find(user => user.userId === app.applicantId);
                res.push(
                    {
                        user: {
                            userId: user.userId,
                            email: user.email,
                            nickname: user.nickname,
                            profileImg: user.profileImg,
                            status: user.status,
                            userType: user.userType,
                            role: user.role,
                            createdAt: user.createdAt,
                            updatedAt: user.updatedAt
                        },
                        application: {
                            id: app.id,
                            postId: app.postInfo.postId,
                            status: app.status,
                            platform: app.platform,
                            mobileOs: app.mobileOs,
                            appliedAt: app.appliedAt,
                            updatedAt: app.updatedAt
                        }
                    }
                );
            });
            return res;
        }
    
    
        // async getPostsByNickname(nickname: string): Promise<PostModel[]> {
        //    return this.postRepository.getPostsByNickname(nickname);
        // }
    
}