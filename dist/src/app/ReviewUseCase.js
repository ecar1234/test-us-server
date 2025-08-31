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
exports.ReviewUseCase = void 0;
class ReviewUseCase {
    constructor(reviewRepo) {
        this.reviewRepo = reviewRepo;
    }
    createReview(review) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.reviewRepo.createReview(review);
        });
    }
    getReviewById(reviewId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.reviewRepo.getReviewById(reviewId);
        });
    }
    getReviewsByApplicationId(applicationId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.reviewRepo.getReviewsByApplicationId(applicationId);
        });
    }
    getReviewsByReviewerUserId(reviewerUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.reviewRepo.getReviewsByReviewedUserId(reviewerUserId);
        });
    }
    getReviewsByReviewedUserId(reviewedUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.reviewRepo.getReviewsByReviewedUserId(reviewedUserId);
        });
    }
    deleteReview(reviewId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.reviewRepo.deleteReview(reviewId);
        });
    }
}
exports.ReviewUseCase = ReviewUseCase;
