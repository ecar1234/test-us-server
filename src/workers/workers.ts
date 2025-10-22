// import * as dotenv from 'dotenv';
// dotenv.config(); // Worker 프로세스를 위해 환경 변수를 로드합니다.

// import { redisClient } from "../config/RedisConfig";
// import { Worker } from "bullmq";
// import { AppUseCase } from "../app/AppUseCase";
// import { ApplicationRepositoryImpl } from "../infrastructure/repositories/ApplicationRepositoryImpl";
// import { RecruitmentPostRepositoryImpl } from "../infrastructure/repositories/RecruitmentPostRepositoryImpl";
// import { RecruitmentPostUseCase } from "../app/RecruitmentPostUseCase";
// import { UserRepositoryImpl } from "../infrastructure/repositories/UserRepositoryImpl";
// import { AppDataSource } from '../config/DataSource';


// AppDataSource.initialize().then(() => {
//     console.log("Worker: Database connection initialized successfully.");

//     const applicationWorker = new Worker(
//         'getApplicationsByIdQueue',
//         async (job) => {
//             const { userId } = job.data;
//             const appRepository = new ApplicationRepositoryImpl();
//             const postRepository = new RecruitmentPostRepositoryImpl();
//             const useCase = new AppUseCase(appRepository, postRepository);
//             const applications = await useCase.findApplicationsByUserId(userId);
//             if (!applications) {
//                 return {
//                     'state': 'failed',
//                     'applications': []
//                 };
//             }
//             return {
//                 'state': 'success',
//                 'applications': applications
//             };
//         }
//         , { connection: redisClient });


//     const getInitPostsWorker = new Worker(
//         'getInitPostsQueue',
//         async (job) => {
//             const { page } = job.data;
//             const postRepository = new RecruitmentPostRepositoryImpl();
//             const userRepository = new UserRepositoryImpl();
//             const applicationRepository = new ApplicationRepositoryImpl();
//             const useCase = new RecruitmentPostUseCase(postRepository, userRepository, applicationRepository);
//             const posts = await useCase.getInitPosts();
//             // console.log(posts);
//             return {
//                 'state': 'success',
//                 'posts': posts
//             };
//         }
//         , { connection: redisClient });

//     applicationWorker.on('completed', (job, result) => {
//         // console.log(result);
//         console.log('success job id : ', job.id);
//     });
//     applicationWorker.on('failed', (job, err) => { 
//         // console.log(err);
//         console.log('applicationWorker failed job id : ', job.id);
//     });

//     getInitPostsWorker.on('completed', (job, result) => {
//         // console.log(result);
//         console.log('success job id : ', job.id);
//     });
//     getInitPostsWorker.on('failed', (job, err) => {
//         // console.log(err);
//         console.log('getInitPostsWorker failed job id : ', job.id);
//     });

//     // export { applicationWorker, getInitPostsWorker };

// }).catch((e) => {
//     console.log(e);
//     console.log("Worker: Error during database connection initialization.");
// });
