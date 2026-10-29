import { Router } from "express";
import { authMiddleware } from "../../middlewares/AuthMiddleware.js";
import { uploadMiddleware } from "../../middlewares/Upload.Middleware.js";
import { RecruitmentPostController } from "../../controllers/posts/RecruitmentPostController.js";
import { RecruitmentPostUseCase } from "../../../app/posts/RecruitmentPostUseCase.js";
import { RecruitmentPostRepositoryImpl } from "../../../infrastructure/repositories/RecruitmentPostRepositoryImpl.js";
import { FirebaseRepositoryImpl } from "../../../infrastructure/repositories/FirebaseRepositoryImpl.js";
import { UserRepositoryImpl } from "../../../infrastructure/repositories/UserRepositoryImpl.js";
import { ApplicationRepositoryImpl } from "../../../infrastructure/repositories/ApplicationRepositoryImpl.js";


const route = Router();

const recruitPostUseCase = new RecruitmentPostUseCase(
    new RecruitmentPostRepositoryImpl(),
    new FirebaseRepositoryImpl(),
    new UserRepositoryImpl(),
    new ApplicationRepositoryImpl()
);
const recruitController = new RecruitmentPostController(recruitPostUseCase);

// Recruitment
route.post('/createRecruitPost', authMiddleware, uploadMiddleware.array('images', 10), recruitController.createRecruitPost.bind(recruitController));
route.put('/updateRecruitPost', authMiddleware, uploadMiddleware.array('images', 10), recruitController.updateRecruitPost.bind(recruitController));
route.post('/deleteRecruitPost', authMiddleware, recruitController.deleteRecruitPost.bind(recruitController));
route.put('/endRecruitPost', authMiddleware, recruitController.endRecruitPost.bind(recruitController));
route.get('/getRecruitPostById/:id', recruitController.getRecruitPostById.bind(recruitController));
route.get('/getUserRecruitPosts/:userId', recruitController.getUserRecuritmentPosts.bind(recruitController));
route.get('/getRecruitPostByTitle/:title', recruitController.getRecruitPostByTitle.bind(recruitController));;
route.post('/getRecruitPostPagination', recruitController.getRecruitPostPagination.bind(recruitController));
route.get('/getRecruitPostsByAuthor/:authorId', authMiddleware, recruitController.getRecruitPostsByAuthor.bind(recruitController));
route.post('/getAppRecruitPosts', recruitController.getAppRecruitPosts.bind(recruitController));
route.post('/getRecruitApplicationsByPostId', recruitController.getRecruitApplicationsByPostId.bind(recruitController));;
// route.get('/getPostByNickname/:nickname', recruitController.getPostsByNickname.bind(recruitController));

export default route;