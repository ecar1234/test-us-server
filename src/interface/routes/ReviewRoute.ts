
import { Router } from 'express';
import { ReviewUseCase } from '../../app/ReviewUseCase.js';
import { ReviewController } from '../controllers/ReviewController.js';
import { authMiddleware } from '../middlewares/AuthMiddleware.js';
import { PostReviewRepositoryImpl } from '../../infrastructure/repositories/PostReviewRepositoryImpl.js';
import { UserReviewRepositoryImpl } from '../../infrastructure/repositories/UserReviewRepositoryImpl.js';
import { RecruitmentPostRepositoryImpl } from '../../infrastructure/repositories/RecruitmentPostRepositoryImpl.js';

const route: Router = Router();

const reviewUseCase = new ReviewUseCase(new UserReviewRepositoryImpl(), new PostReviewRepositoryImpl(), new RecruitmentPostRepositoryImpl());
const reviewController = new ReviewController(reviewUseCase);

route.post('/addPromotionReview', authMiddleware, reviewController.addPromotionReview.bind(reviewController));
route.post('/addRecruitReview', authMiddleware, reviewController.addRecruitReview.bind(reviewController));
route.post('/addUserReview', authMiddleware, reviewController.addUserReview.bind(reviewController));
route.get('/getReviewByPostId/:postId', authMiddleware, reviewController.getReviewByPostId.bind(reviewController));
route.get('/getReviewByUserId/:userId', authMiddleware, reviewController.getReviewByUserId.bind(reviewController));
route.get('/getUserReview/:userId', authMiddleware, reviewController.getReviewsByUserId.bind(reviewController));
route.post('/getReviewByTesters', authMiddleware, reviewController.getReviewByTesterIds.bind(reviewController));
route.get('/getReviewByPostReviewId/:reviewId', authMiddleware, reviewController.getReviewByPostReviewId.bind(reviewController));

export default route;