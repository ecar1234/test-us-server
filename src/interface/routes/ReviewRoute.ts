
import { Router } from 'express';
import { ReviewUseCase } from '../../app/ReviewUseCase';
import { ReviewRepositoryImpl } from '../../infrastructure/repositories/ReviewRepositoryImpl';
import { ReviewController } from '../controllers/ReviewController';

const route: Router = Router();

const reviewUseCase = new ReviewUseCase(new ReviewRepositoryImpl);
const reviewController = new ReviewController(reviewUseCase);

route.post('/createReview', reviewController.createReview.bind(reviewController));
route.get('/getReviewById', reviewController.createReview.bind(reviewController));
route.get('/getReviewByAppId', reviewController.createReview.bind(reviewController));
route.get('/getReviewByReviewer', reviewController.createReview.bind(reviewController));
route.get('/getReviewByReviewed', reviewController.createReview.bind(reviewController));
route.delete('/deleteReview', reviewController.createReview.bind(reviewController));

export default route;