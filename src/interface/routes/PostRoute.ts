import { Router } from "express";
import { authMiddleware } from "../middlewares/AuthMiddleware";
import { PostController } from "../controllers/PostController";
import { PostUseCase } from "../../app/PostUseCase";
import { PostRepositoryImpl } from "../../infrastructure/repositories/PostRepositoryImpl";
import { RecruitmentPostRepositoryImpl } from "../../infrastructure/repositories/RecruitmentPostRepositoryImpl";
import { PromotionPostRepositoryImpl } from "../../infrastructure/repositories/PromotionPostRepositoryImpl";
import multer from "multer";
import crypto from "crypto";
import path from "path";
import fs from "fs";
import { Env } from "../../config/env";


const route = Router();


const postRepo = new PostRepositoryImpl();
const recruitRepo = new RecruitmentPostRepositoryImpl();
const promotionRepo = new PromotionPostRepositoryImpl();

// const appRepo = new ApplicationRepositoryImpl();
// const recruitmentPostUseCase = new RecruitmentPostUseCase(recruitRepo);

const postUseCase = new PostUseCase(postRepo, recruitRepo, promotionRepo);
const postController = new PostController(postUseCase);

const UPLOAD_URL = Env.UPLOAD_URL;
if(!fs.existsSync(UPLOAD_URL)) fs.mkdirSync(UPLOAD_URL, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_URL);
    },
    filename: (req, file, cb) => {
       const ext = path.extname(file.originalname);
       const name = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}${ext}`
       cb(null, name);
    }
});

const uploadWithFiles = multer({ storage: storage, limits: { fileSize: 1024 * 1024 * 5 } });


route.get('/getInitPosts', postController.getInitPosts.bind(postController));
route.get('/getUserInitPosts/:userId', postController.getInitUserPosts.bind(postController));
// Recruitment
route.post('/createRecruitPost', authMiddleware, uploadWithFiles.array('images', 4), postController.createRecruitPost.bind(postController));
route.put('/updateRecruitPost', authMiddleware, uploadWithFiles.array('images', 4), postController.updateRecruitPost.bind(postController));
route.post('/deleteRecruitPost', authMiddleware, postController.deleteRecruitPost.bind(postController));
route.get('/getRecruitPostById/:id', postController.getRecruitPostById.bind(postController));
route.get('/getUserRecruitPosts/:userId', postController.getUserRecuritmentPosts.bind(postController));
route.get('/getRecruitPostByTitle/:title', postController.getRecruitPostByTitle.bind(postController));;
route.post('/getRecruitPostPagination', postController.getRecruitPostPagination.bind(postController));
route.get('/getRecruitPostsByAuthor/:authorId', authMiddleware, postController.getRecruitPostsByAuthor.bind(postController));
// route.get('/getPostByNickname/:nickname', postController.getPostsByNickname.bind(postController));

// PromotionDELETE /api/v1/post/deleteImage 라우트를 만들 수 있습니다. update에 통합하는 것이 더 효율적입니다.
route.post('/createPromotionPost', authMiddleware, uploadWithFiles.array('images', 4), postController.createPromotionPost.bind(postController));
route.put('/updatePromotionPost', authMiddleware, uploadWithFiles.array('images', 4), postController.updatePromotionPost.bind(postController));
route.post('/deletePromotionPost', authMiddleware, postController.deletePromotionPost.bind(postController));
route.get('/getPromotionPostById/:id', postController.getPromotionPostById.bind(postController));
route.get('/getUserPromotionPosts/:userId', postController.getUserPromotionPosts.bind(postController));
route.get('/getPromotionPostByTitle/:title', postController.getPromotionPostByTitle.bind(postController));;
route.post('/getPromotionPostPagination', postController.getPromotionPostPagination.bind(postController));
route.get('/getPromotionPostsByAuthor/:authorId', authMiddleware, postController.getPromotionPostsByAuthor.bind(postController));

export default route;