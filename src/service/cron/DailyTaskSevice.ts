import { Not } from "typeorm";
import { AppDataSource } from "../../config/DataSource";
import { BasePostStateType } from "../../infrastructure/entities/BasePostEntity";
import { FirebaseDeviceTokenEntity } from "../../infrastructure/entities/FirebaseDeviceTokenEntity";
import { PromotionPostEntity } from "../../infrastructure/entities/PromotionPostEntity";
import { RecruitmentPostEntity } from "../../infrastructure/entities/RecruitmentPostEntity";
import { expiredPostNotificationHandler } from "../firebase/notificationHandler";
import fs from 'fs/promises';
import path from 'path';
import { UserEntity, UserStatus } from "../../infrastructure/entities/UserEntity";


export class DailyTaskService {
    static async updateRecruitPosts(): Promise<void> {
        try {
            const postRepository = AppDataSource.getRepository(RecruitmentPostEntity);
            const result = await postRepository
                .createQueryBuilder()
                .update(RecruitmentPostEntity)
                .set({ status: BasePostStateType.EXPIRED })
                .where("status = :status", { status: BasePostStateType.ACTIVE })
                .andWhere("DATE_ADD(createdAt, INTERVAL period DAY) < NOW()")
                .execute();
            console.log(`[DailyTask] Updated ${result.affected} posts to Expired status.`);


        }
        catch (e) {
            console.error('[DailyTask] Error during daily recruit post update:', e);
            throw e;
        }
    }
    static async updatePromotionPosts(): Promise<void> {
        try {
            const postRepository = AppDataSource.getRepository(PromotionPostEntity);

            const result = await postRepository
                .createQueryBuilder()
                .update(PromotionPostEntity)
                .set({ status: BasePostStateType.EXPIRED })
                .where("status = :status", { status: BasePostStateType.ACTIVE })
                .andWhere('DATE_ADD(createdAt, INTERVAL period DAY) < NOW()')
                .execute();
            console.log(`[DailyTask] Updated ${result.affected} promotion posts to Expired status.`);


        } catch (e) {
            console.error('[DailyTask] Error during daily promotion post update:', e);
            throw e;
        }
    }
    static async expiredPostsFcmToSend(): Promise<void> {
        try {
            const recruitData = AppDataSource.getRepository(RecruitmentPostEntity);
            const fmcData = AppDataSource.getRepository(FirebaseDeviceTokenEntity);

            const start = new Date();
            start.setHours(0, 0, 0, 0); // 오늘 00:00:00

            const end = new Date();
            end.setHours(6, 0, 0, 0); // 오늘 06:00:00

            const expiredRecruitPosts = await recruitData
                .createQueryBuilder('entity')
                .where('entity.status = :status', { status: BasePostStateType.EXPIRED })
                .andWhere('entity.updatedAt >= :start', { start })
                .andWhere('entity.updatedAt < :end', { end })
                .getMany();





            const recruitUsers = expiredRecruitPosts.map(post => post.author.userId);

            if (recruitUsers.length !== 0) {
                const recruitFcmTokens = await fmcData
                    .createQueryBuilder('entity')
                    .where('entity.userId IN (:...userIds)', { userIds: recruitUsers })
                    .getMany();

                recruitFcmTokens.forEach(async token => {
                    const postTitle = expiredRecruitPosts.find(post => post.author.userId === token.user.userId)?.title;
                    if (postTitle) {
                        await expiredPostNotificationHandler(token, postTitle, 'recruit');
                    } else {
                        return;
                    }
                });
            }


        }
        catch (e) {
            console.log('[DailyTask] Error during daily send to expired recruit posts:', e);
            throw new Error('Error during daily send to expired recruit posts');
        }
    }
    static async expiredPostsFcmToSend2(): Promise<void> {
        try {
            const promotionData = AppDataSource.getRepository(PromotionPostEntity);
            const fmcData = AppDataSource.getRepository(FirebaseDeviceTokenEntity);

            const start = new Date();
            start.setHours(0, 0, 0, 0); // 오늘 00:00:00

            const end = new Date();
            end.setHours(6, 0, 0, 0); // 오늘 06:00:00

            const expiredPromotionPosts = await promotionData
                .createQueryBuilder('entity')
                .where('entity.status = :status', { status: BasePostStateType.EXPIRED })
                .andWhere('entity.updatedAt >= :start', { start })
                .andWhere('entity.updatedAt < :end', { end })
                .getMany();

            const promotionUsers = expiredPromotionPosts.map(post => post.author.userId);
            if (promotionUsers.length !== 0) {
                const promotionFcmTokens = await fmcData
                    .createQueryBuilder('entity')
                    .where('entity.userId IN (:...userIds)', { userIds: promotionUsers })
                    .getMany();

                promotionFcmTokens.forEach(async token => {
                    const postTitle = expiredPromotionPosts.find(post => post.author.userId === token.user.userId)?.title;
                    if (postTitle) {
                        await expiredPostNotificationHandler(token, postTitle, 'promotion');
                    } else {
                        return;
                    }
                });

            }
        } catch (e) {
            console.log('[DailyTask] Error during daily send to expired promotion posts:', e);
            throw new Error('Error during daily send to expired promotion posts');
        }
    }
    static async cleanupOrphanedPostImages(): Promise<void> {
        console.log('--- POST 더미 이미지 정리 시작 ---');
        try {
            const recruitData = AppDataSource.getRepository(RecruitmentPostEntity);
            const promotionData = AppDataSource.getRepository(PromotionPostEntity);

            const isProd = process.env.NODE_ENV === 'prod';
            const postUploadPath = isProd
                ? path.resolve(process.env.MAIN_UPLOAD_URL) : path.resolve(process.env.UPLOAD_URL);
            const filesOnDisk = await fs.readdir(postUploadPath);
            if (filesOnDisk.length === 0) return console.log('정리할 파일이 없습니다.');
            // recruit post image rows
            const recruitPosts = await recruitData.find({
                where: { status: Not(BasePostStateType.ACTIVE) },
                select: ["images"] // 필요한 컬럼만 선택 (이미지 구조에 따라 조정)
            });
            const promotionPosts = await promotionData.find({
                where: { status: Not(BasePostStateType.ACTIVE) },
                select: ["images"]
            });

            const posts = [...recruitPosts, ...promotionPosts];

            const activeFiles = new Set();
            posts.forEach(post => {
                if (post.images && Array.isArray(post.images)) {
                    post.images.forEach(img => activeFiles.add(img.filename));
                }
            });

            let deletedCount = 0;
            for (const file of filesOnDisk) {
                // DB 리스트에 파일명이 없다면 '더미'로 간주
                if (!activeFiles.has(file)) {
                    const filePath = path.join(postUploadPath, file);

                    // [안전장치] 생성된 지 1시간 이상 된 파일만 삭제 (현재 업로드 중일 수도 있음)
                    const stats = await fs.stat(filePath);
                    const now = new Date().getTime();
                    if (now - stats.mtimeMs > 60 * 60 * 1000) {
                        await fs.unlink(filePath);
                        deletedCount++;
                        console.log(`Deleted Orphaned File: ${file}`);
                    }
                }
            }

            console.log(`--- 정리 완료: 총 ${deletedCount}개의 파일을 삭제했습니다. ---`);
        }
        catch (e) {
            console.error(`파일 처리 중 오류 :`, e.message);
        }
    }
    static async cleanupOrphanedUserImages(): Promise<void> {
        console.log('--- USER PROFILE 더미 이미지 정리 시작 ---');
        try {
            const userData = AppDataSource.getRepository(UserEntity);

            const isProd = process.env.NODE_ENV === 'prod';
            const postUploadPath = isProd
                ? path.resolve(process.env.MAIN_UPLOAD_USER_URL) : path.resolve(process.env.UPLOAD_USER_URL);
            const filesOnDisk = await fs.readdir(postUploadPath);
            if (filesOnDisk.length === 0) return console.log('정리할 파일이 없습니다.');

            const users = await userData.find({
                where: { status: Not(UserStatus.ACTIVE) },
                select: ["image"]
            });

            const activeFiles = new Set(users.map(user => user.image?.filename));
            let deletedCount = 0;
            for (const file of filesOnDisk) {
                if (!activeFiles.has(file)) {
                    const filePath = path.join(postUploadPath, file);

                    // [안전장치]
                    const stats = await fs.stat(filePath);
                    const now = new Date().getTime();
                    if (now - stats.mtimeMs > 60 * 60 * 1000) {
                        await fs.unlink(filePath);
                        deletedCount++;
                        console.log(`Deleted Orphaned File: ${file}`);
                    }
                }
            }
            console.log(`--- 정리 완료: 총 ${deletedCount}개의 파일을 삭제했습니다. ---`);

        } catch (e) {
            console.error(`파일 처리 중 오류 :`, e.message);
        }
    }
}