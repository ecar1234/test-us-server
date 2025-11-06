import { Worker } from "bullmq";
import { redisClient } from "../config/RedisConfig";
import { RecruitmentPostUseCase } from "../app/RecruitmentPostUseCase";
import { RecruitmentPostRepositoryImpl } from "../infrastructure/repositories/RecruitmentPostRepositoryImpl";
import { UserRepositoryImpl } from "../infrastructure/repositories/UserRepositoryImpl";
import { ApplicationRepositoryImpl } from "../infrastructure/repositories/ApplicationRepositoryImpl";
import { PostUseCase } from "../app/PostUseCase";
import { PostRepositoryImpl } from "../infrastructure/repositories/PostRepositoryImpl";
import { PromotionPostRepositoryImpl } from "../infrastructure/repositories/PromotionPostRepositoryImpl";
import { ImagesRepositoryImpl } from "../infrastructure/repositories/ImagesRepositoryImpl";

const postWorker = new Worker(
    'getInitPostsQueue',
    async (job) => {
        const postRepo = new PostRepositoryImpl();
        const recruitRepo = new RecruitmentPostRepositoryImpl();
        const promotionRepo = new PromotionPostRepositoryImpl();
        const postUseCase = new PostUseCase(postRepo, recruitRepo, promotionRepo);
 
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
    { connection: redisClient }
);


postWorker.on('completed', (job) => {
    console.log(`PostWorker: Job ${job.id} (${job.name}) has completed.`);
    // console.log(job.returnvalue);
});

postWorker.on('failed', (job, err) => {
    console.error(`PostWorker: Job ${job.id} (${job.name}) has failed with error:`, err.message);
});

console.log("Post worker is running.");