import { Router } from "express";
import { authMiddleware } from "../../middlewares/AuthMiddleware.js";
import { PostController } from "../../controllers/posts/PostController.js";
import { PostUseCase } from "../../../app/posts/PostUseCase.js";
import { PostRepositoryImpl } from "../../../infrastructure/repositories/PostRepositoryImpl.js";
import { RecruitmentPostRepositoryImpl } from "../../../infrastructure/repositories/RecruitmentPostRepositoryImpl.js";
import { PromotionPostRepositoryImpl } from "../../../infrastructure/repositories/PromotionPostRepositoryImpl.js";
import { Env } from "../../../config/env.js";
import { FirebaseRepositoryImpl } from "../../../infrastructure/repositories/FirebaseRepositoryImpl.js";
import { ApplicationRepositoryImpl } from "../../../infrastructure/repositories/ApplicationRepositoryImpl.js";
import { UserRepositoryImpl } from "../../../infrastructure/repositories/UserRepositoryImpl.js";
import multer from "multer";
import crypto from "crypto";
import path from "path";
import fs from "fs";


const route = Router();


const postRepo = new PostRepositoryImpl();
const recruitRepo = new RecruitmentPostRepositoryImpl();
const promotionRepo = new PromotionPostRepositoryImpl();
const firebaseRepo = new FirebaseRepositoryImpl();
const applicationRepo = new ApplicationRepositoryImpl();
const userRepo = new UserRepositoryImpl();
// const userReviewRepo = new UserReviewRepositoryImpl();


// const appRepo = new ApplicationRepositoryImpl();
// const recruitmentPostUseCase = new RecruitmentPostUseCase(recruitRepo);

const postUseCase = new PostUseCase(userRepo, postRepo, recruitRepo, promotionRepo, firebaseRepo, applicationRepo);
const postController = new PostController(postUseCase);

const isProd = process.env.NODE_ENV === 'prod';
const url = isProd ? path.resolve(Env.MAIN_UPLOAD_URL) : path.resolve(Env.UPLOAD_URL);

// const UPLOAD_URL = Env.UPLOAD_URL;
// if(!fs.existsSync(url)) fs.mkdirSync(url, { recursive: true });

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, url);
//     },
//     filename: (req, file, cb) => {
//        const ext = path.extname(file.originalname);
//        const name = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}${ext}`
//        cb(null, name);
//     }
// });

// const uploadWithFiles = multer({ storage: storage, 
//     // limits: { fileSize: 1024 * 1024 * 5 } 
// });


route.get('/getInitPosts', postController.getInitPosts.bind(postController));
route.get('/getUserInitPosts/:userId', postController.getInitUserPosts.bind(postController));
route.get('/searchPosts/:keyword', postController.searchPosts.bind(postController));

export default route;