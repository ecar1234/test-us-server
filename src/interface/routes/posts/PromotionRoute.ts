import { Router } from "express";
import { authMiddleware } from "../../middlewares/AuthMiddleware.js";
import { uploadMiddleware } from "../../middlewares/Upload.Middleware.js";

import { PromotionPostController } from "../../controllers/posts/PromotionPostController.js";
import { PromotionPostUseCase } from "../../../app/posts/PromotionPostUseCase.js";
import { PromotionPostRepositoryImpl } from "../../../infrastructure/repositories/PromotionPostRepositoryImpl.js";

const route = Router();

const promotionUseCase = new PromotionPostUseCase(new PromotionPostRepositoryImpl());
const promotionControlle = new PromotionPostController(promotionUseCase);

// PromotionDELETE /api/v1/post/deleteImage 라우트를 만들 수 있습니다. update에 통합하는 것이 더 효율적입니다.
route.post('/createPromotionPost', authMiddleware, uploadMiddleware.array('images', 4), promotionControlle.createPromotionPost.bind(promotionControlle));
route.put('/updatePromotionPost', authMiddleware, uploadMiddleware.array('images', 4), promotionControlle.updatePromotionPost.bind(promotionControlle));
route.post('/deletePromotionPost', authMiddleware, promotionControlle.deletePromotionPost.bind(promotionControlle));
route.get('/getPromotionPostById/:id', promotionControlle.getPromotionPostById.bind(promotionControlle));
route.get('/getUserPromotionPosts/:userId', promotionControlle.getUserPromotionPosts.bind(promotionControlle));
route.get('/getPromotionPostByTitle/:title', promotionControlle.getPromotionPostByTitle.bind(promotionControlle));;
route.post('/getPromotionPostPagination', promotionControlle.getPromotionPostPagination.bind(promotionControlle));
route.get('/getPromotionPostsByAuthor/:authorId', authMiddleware, promotionControlle.getPromotionPostsByAuthor.bind(promotionControlle));

export default route;