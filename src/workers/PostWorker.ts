import { Worker } from "bullmq";
import { bullMqConnection } from "../config/RedisConfig.js";
import { RecruitmentPostRepositoryImpl } from "../infrastructure/repositories/RecruitmentPostRepositoryImpl.js";
import { UserRepositoryImpl } from "../infrastructure/repositories/UserRepositoryImpl.js";
import { ApplicationRepositoryImpl } from "../infrastructure/repositories/ApplicationRepositoryImpl.js";
import { PostUseCase } from "../app/PostUseCase.js";
import { PostRepositoryImpl } from "../infrastructure/repositories/PostRepositoryImpl.js";
import { PromotionPostRepositoryImpl } from "../infrastructure/repositories/PromotionPostRepositoryImpl.js";
import { FirebaseRepositoryImpl } from "../infrastructure/repositories/FirebaseRepositoryImpl.js";

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