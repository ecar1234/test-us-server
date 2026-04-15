import { Worker } from "bullmq";
import { bullMqConnection } from "../config/RedisConfig.js";
import { AppUseCase } from "../app/AppUseCase.js";
import { ApplicationRepositoryImpl } from "../infrastructure/repositories/ApplicationRepositoryImpl.js";
import { RecruitmentPostRepositoryImpl } from "../infrastructure/repositories/RecruitmentPostRepositoryImpl.js";
import { FirebaseRepositoryImpl } from "../infrastructure/repositories/FirebaseRepositoryImpl.js";
import { UserReviewRepositoryImpl } from "../infrastructure/repositories/UserReviewRepositoryImpl.js";
import { UserRepositoryImpl } from "../infrastructure/repositories/UserRepositoryImpl.js";

const isProd = process.env.NODE_ENV === "prod";

const applicationWorker = new Worker(
    'getApplicationsByIdQueue',
    async (job) => {
        const { userId } = job.data;
        const appRepository = new ApplicationRepositoryImpl();
        const postRepository = new RecruitmentPostRepositoryImpl();
        const firebaseRepository = new FirebaseRepositoryImpl();
        const userRepo = new UserRepositoryImpl();
        const userReviewRepo = new UserReviewRepositoryImpl();
        const useCase = new AppUseCase(appRepository, postRepository, firebaseRepository, userRepo, userReviewRepo);
        const applications = await useCase.findApplicationsByUserId(userId);
        if (!applications) {
            return { 'state': 'failed', 'applications': [] };
        }
        return { 'state': 'success', 'applications': applications };
    },
    { connection: bullMqConnection, prefix: isProd ? 'prod:bull' : 'dev:bull'}
);

applicationWorker.on('completed', (job) => {
    console.log(`ApplicationWorker: Job ${job.id} has completed.`);
});

applicationWorker.on('failed', (job, err) => {
    console.error(`ApplicationWorker: Job ${job.id} has failed with error:`, err.message);
});

console.log("Application worker is running.");