import { Worker } from "bullmq";
import { bullMqConnection, redisClient } from "../config/RedisConfig";
import { RecruitmentPostUseCase } from "../app/RecruitmentPostUseCase";
import { RecruitmentPostRepositoryImpl } from "../infrastructure/repositories/RecruitmentPostRepositoryImpl";
import { UserRepositoryImpl } from "../infrastructure/repositories/UserRepositoryImpl";
import { ApplicationRepositoryImpl } from "../infrastructure/repositories/ApplicationRepositoryImpl";
import { PostUseCase } from "../app/PostUseCase";
import { PostRepositoryImpl } from "../infrastructure/repositories/PostRepositoryImpl";
import { PromotionPostRepositoryImpl } from "../infrastructure/repositories/PromotionPostRepositoryImpl";
import { ImagesRepositoryImpl } from "../infrastructure/repositories/ImagesRepositoryImpl";
import { FirebaseRepositoryImpl } from "../infrastructure/repositories/FirebaseRepositoryImpl";
import { app } from "firebase-admin";
import { UserReviewRepositoryImpl } from "../infrastructure/repositories/UserReviewRepositoryImpl";

const isProd = process.env.NODE_ENV === "prod";
const postWorker = new Worker(
    'getInitPostsQueue',
    async (job) => {
        const postRepo = new PostRepositoryImpl();
        const recruitRepo = new RecruitmentPostRepositoryImpl();
        const promotionRepo = new PromotionPostRepositoryImpl();
        const firebaseRepo = new FirebaseRepositoryImpl();
        const userRepo = new UserRepositoryImpl();
        const appRepo = new ApplicationRepositoryImpl();

        const postUseCase = new PostUseCase(userRepo, postRepo, recruitRepo, promotionRepo, firebaseRepo, appRepo);
 
        switch (job.name) {
            case 'getInitPosts':
                const [favorite, recruit, promotion] = await postUseCase.getInitPosts();
                return { 'state': 'success', 'favorite': favorite, 'recruit': recruit, 'promotion': promotion };
            
            case 'getInitUserPosts':
                const { userId } = job.data;
                const [userRecruit, userPromotion] = await postUseCase.getInitUserPosts(userId);
                return { 'state': 'success', 'recruit': userRecruit, 'promotion': userPromotion };
            
            default:
                throw new Error(`Unknown job name: ${job.name}`);
        }
    },
    { connection: bullMqConnection, prefix: isProd ? 'prod:bull' : 'dev:bull'}
);


postWorker.on('completed', (job) => {
    console.log(`PostWorker: Job ${job.id} (${job.name}) has completed.`);
    // console.log(job.returnvalue);
});

postWorker.on('failed', (job, err) => {
    console.error(`PostWorker: Job ${job.id} (${job.name}) has failed with error:`, err.message);
});

console.log("Post worker is running.");