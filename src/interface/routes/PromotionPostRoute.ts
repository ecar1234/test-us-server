import { Router } from "express";
import { PromotionPostUseCase } from "../../app/PromotionPostUseCase.js";
import { PromotionPostRepositoryImpl } from "../../infrastructure/repositories/PromotionPostRepositoryImpl.js";
import { PromotionPostController } from "../controllers/PromotionPostController.js";



const route = Router();

const promotionPostUseCase = new PromotionPostUseCase(new PromotionPostRepositoryImpl());
const promotionPostController = new PromotionPostController(promotionPostUseCase);

// route.post('/create', authMiddleware, promotionPostController.createPost.bind(promotionPostController));
// route.put('/update', authMiddleware, promotionPostController.updatePost.bind(promotionPostController));
// route.post('/delete', authMiddleware, promotionPostController.deletePost.bind(promotionPostController));
route.get('/getPostById/:id', promotionPostController.getPostById.bind(promotionPostController));
// route.get('/getUserRecruitmentPosts/:userId', promotionPostController.getUserRecuritmentPosts.bind(promotionPostController));
// route.get('/getPostByTitle/:title', promotionPostController.getPostByTitle.bind(promotionPostController));
// route.get('/getAllPosts', promotionPostController.getAllPosts.bind(promotionPostController));
// route.get('/getWebPostsPagination', promotionPostController.getWebPosts.bind(promotionPostController));
// route.get('/getMobilePostsPagination', promotionPostController.getMobilePosts.bind(promotionPostController));
// route.get('/getPostsPagination', promotionPostController.getPostsPaginations.bind(promotionPostController));
// route.get('/getPostsByAuthor/:authorId', authMiddleware, promotionPostController.getPostsByAuthor.bind(promotionPostController));
// route.get('/getPostByNickname/:nickname', promotionPostController.getPostsByNickname.bind(promotionPostController));


export default route;