"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewController = void 0;
const ReviewModel_1 = require("../../domain/entities/ReviewModel");
class ReviewController {
    constructor(reviewUseCase) {
        this.reviewUseCase = reviewUseCase;
    }
    createReview(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { reviewId, rating, comment, reviewType, createdAt, applicationId, reviewerUserId, reviewedUserId } = req.body;
            const reviewData = new ReviewModel_1.ReviewModel(reviewId, rating, comment, reviewType, createdAt, applicationId, reviewerUserId, reviewedUserId);
            const result = yield this.reviewUseCase.createReview(reviewData);
            res.status(200).json({ review: result, message: "review create success." });
        });
    }
    getReviewById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const reviewId = req.params.reviewId;
            const result = yield this.reviewUseCase.getReviewById(reviewId);
            res.status(result ? 200 : 404).json({ review: result });
        });
    }
    getReviewsByApplicationId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const appId = req.params.applicationId;
            const result = yield this.reviewUseCase.getReviewsByApplicationId(parseInt(appId));
            res.status(200).json({ reviews: result });
        });
    }
    getReviewsByReviewerUserId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const reviewerId = req.params.reviewerId;
            const result = yield this.reviewUseCase.getReviewsByReviewerUserId(reviewerId);
            res.status(200).json({ reviews: result });
        });
    }
    getReviewsByReviewedUserId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const reviewedId = req.params.reviewedId;
            const result = yield this.reviewUseCase.getReviewsByReviewedUserId(reviewedId);
            res.status(200).json({ reviews: result });
        });
    }
    deleteReview(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const reviewId = req.params.reviewId;
            const result = yield this.reviewUseCase.deleteReview(reviewId);
            res.status(result ? 200 : 404).json({ result: result ? 'success delete review' : 'delete failed' });
        });
    }
}
exports.ReviewController = ReviewController;
