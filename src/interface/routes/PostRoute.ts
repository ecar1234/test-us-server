import { Router } from "express";
import { authMiddleware } from "../middlewares/AuthMiddleware";
import { PostController } from "../controllers/PostController";
import { PostUseCase } from "../../app/PostUseCase";
import { PostRepositoryImpl } from "../../infrastructure/repositories/PostRepositoryImpl";
import { RecruitmentPostRepositoryImpl } from "../../infrastructure/repositories/RecruitmentPostRepositoryImpl";
import { PromotionPostRepositoryImpl } from "../../infrastructure/repositories/PromotionPostRepositoryImpl";


const route = Router();


const postRepo = new PostRepositoryImpl();
const recruitRepo = new RecruitmentPostRepositoryImpl();
const promotionRepo = new PromotionPostRepositoryImpl();

// const appRepo = new ApplicationRepositoryImpl();
// const recruitmentPostUseCase = new RecruitmentPostUseCase(recruitRepo);

const postUseCase = new PostUseCase(postRepo, recruitRepo, promotionRepo);
const postController = new PostController(postUseCase);


route.get('/getInitPosts', postController.getInitPosts.bind(postController));
// Recruitment
route.post('/createRecruitPost', authMiddleware, postController.createRecruitPost.bind(postController));
route.put('/updateRecruitPost', authMiddleware, postController.updateRecruitPost.bind(postController));
route.post('/deleteRecruitPost', authMiddleware, postController.deleteRecruitPost.bind(postController));
route.get('/getRecruitPostById/:id', postController.getRecruitPostById.bind(postController));
route.get('/getUserRecruitPosts/:userId', postController.getUserRecuritmentPosts.bind(postController));
route.get('/getRecruitPostByTitle/:title', postController.getRecruitPostByTitle.bind(postController));;
route.get('/getRecruitPostPagination', postController.getRecruitPostPagination.bind(postController));
route.get('/getRecruitPostsByAuthor/:authorId', authMiddleware, postController.getRecruitPostsByAuthor.bind(postController));
// route.get('/getPostByNickname/:nickname', postController.getPostsByNickname.bind(postController));

// Promotion
route.post('/createPromotionPost', authMiddleware, postController.createPromotionPost.bind(postController));
route.put('/updatePromotionPost', authMiddleware, postController.updatePromotionPost.bind(postController));
route.post('/deletePromotionPost', authMiddleware, postController.deletePromotionPost.bind(postController));
route.get('/getPromotionPostById/:id', postController.getPromotionPostById.bind(postController));
route.get('/getUserPromotionPosts/:userId', postController.getUserPromotionPosts.bind(postController));
route.get('/getPromotionPostByTitle/:title', postController.getPromotionPostByTitle.bind(postController));;
route.get('/getPromotionPostPagination', postController.getPromotionPostPagination.bind(postController));
route.get('/getPromotionPostsByAuthor/:authorId', authMiddleware, postController.getPromotionPostsByAuthor.bind(postController));

export default route;