import { Worker } from "bullmq";
import { redisClient } from "../config/RedisConfig";
import { AppUseCase } from "../app/AppUseCase";
import { ApplicationRepositoryImpl } from "../infrastructure/repositories/ApplicationRepositoryImpl";
import { RecruitmentPostRepositoryImpl } from "../infrastructure/repositories/RecruitmentPostRepositoryImpl";

const applicationWorker = new Worker(
    'getApplicationsByIdQueue',
    async (job) => {
        const { userId } = job.data;
        const appRepository = new ApplicationRepositoryImpl();
        const postRepository = new RecruitmentPostRepositoryImpl();
        const useCase = new AppUseCase(appRepository, postRepository);
        const applications = await useCase.findApplicationsByUserId(userId);
        if (!applications) {
            return { 'state': 'failed', 'applications': [] };
        }
        return { 'state': 'success', 'applications': applications };
    },
    { connection: redisClient }
);

applicationWorker.on('completed', (job) => {
    console.log(`ApplicationWorker: Job ${job.id} has completed.`);
});

applicationWorker.on('failed', (job, err) => {
    console.error(`ApplicationWorker: Job ${job.id} has failed with error:`, err.message);
});

console.log("Application worker is running.");