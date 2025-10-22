import { Worker } from "bullmq";
import { redisClient } from "../config/RedisConfig";
import { RecruitmentPostUseCase } from "../app/RecruitmentPostUseCase";
import { RecruitmentPostRepositoryImpl } from "../infrastructure/repositories/RecruitmentPostRepositoryImpl";
import { UserRepositoryImpl } from "../infrastructure/repositories/UserRepositoryImpl";
import { ApplicationRepositoryImpl } from "../infrastructure/repositories/ApplicationRepositoryImpl";
import { PostUseCase } from "../app/PostUseCase";
import { PostRepositoryImpl } from "../infrastructure/repositories/PostRepositoryImpl";
import { PromotionPostRepositoryImpl } from "../infrastructure/repositories/PromotionPostRepositoryImpl";

const getInitPostsWorker = new Worker(
    'getInitPostsQueue',
    async (job) => {
        const { page } = job.data;
        const postRepo = new PostRepositoryImpl();
        const recruitRepo = new RecruitmentPostRepositoryImpl();
        const promotionRepo = new PromotionPostRepositoryImpl();

        const postUseCase = new PostUseCase(postRepo, recruitRepo, promotionRepo);
        
        const [favorite, recruit, promotion] = await postUseCase.getInitPosts();
        return { 'state': 'success', 'favorite': favorite, 'recruit': recruit, 'promotion': promotion};
    },
    { connection: redisClient }
);

getInitPostsWorker.on('completed', (job) => {
    console.log(`PostWorker: Job ${job.id} has completed.`);
});

getInitPostsWorker.on('failed', (job, err) => {
    console.error(`PostWorker: Job ${job.id} has failed with error:`, err.message);
});

console.log("Post worker is running.");