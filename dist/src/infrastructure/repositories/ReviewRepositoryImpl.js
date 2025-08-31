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
exports.ReviewRepositoryImpl = void 0;
const DataSource_1 = require("../../config/DataSource");
const ReviewModel_1 = require("../../domain/entities/ReviewModel");
const ReviewEntiry_1 = require("../entities/ReviewEntiry");
class ReviewRepositoryImpl {
    constructor() {
        this.reviewDataSource = DataSource_1.AppDataSource.getRepository(ReviewEntiry_1.ReviewEntity);
    }
    toDomainReview(reviewEntity) {
        return new ReviewModel_1.ReviewModel(reviewEntity.reviewId, reviewEntity.rating, reviewEntity.comment, reviewEntity.reviewType, reviewEntity.createdAt, reviewEntity.application.appId, reviewEntity.reviewer.userId, reviewEntity.reviewed.userId);
    }
    toEntityReview(reviewModel) {
        const reviewType = reviewModel.reviewType === 'PRODUCT_RATING' ? ReviewEntiry_1.ReviewType.PRODUCT_RATING : ReviewEntiry_1.ReviewType.PARTICIPANT_ATTITUDE_RATING;
        const reviewEntity = new ReviewEntiry_1.ReviewEntity();
        reviewEntity.reviewId = reviewModel.reviewId;
        reviewEntity.rating = reviewModel.rating;
        reviewEntity.comment = reviewModel.comment;
        reviewEntity.reviewType = reviewType;
        reviewEntity.createdAt = reviewModel.createdAt;
        reviewEntity.application = { appId: reviewModel.applicationId };
        reviewEntity.reviewer = { userId: reviewModel.reviewerUserId };
        reviewEntity.reviewed = { userId: reviewModel.reviewedUserId };
        return reviewEntity;
    }
    createReview(review) {
        return __awaiter(this, void 0, void 0, function* () {
            const reviewEntity = this.toEntityReview(review);
            return this.reviewDataSource.save(reviewEntity)
                .then(savedEntity => this.toDomainReview(savedEntity));
        });
    }
    getReviewById(reviewId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.reviewDataSource.findOne({ where: { reviewId } })
                .then(reviewEntity => reviewEntity ? this.toDomainReview(reviewEntity) : null);
        });
    }
    getReviewsByApplicationId(applicationId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.reviewDataSource.find({ where: { application: { appId: applicationId } } })
                .then(reviewEntities => reviewEntities.map(this.toDomainReview.bind(this)));
        });
    }
    getReviewsByReviewerUserId(reviewerUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.reviewDataSource.find({ where: { reviewer: { userId: reviewerUserId } } })
                .then(reviewEntities => reviewEntities.map(this.toDomainReview.bind(this)));
        });
    }
    getReviewsByReviewedUserId(reviewedUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.reviewDataSource.find({ where: { reviewed: { userId: reviewedUserId } } })
                .then(reviewEntities => reviewEntities.map(this.toDomainReview.bind(this)));
        });
    }
    deleteReview(reviewId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.reviewDataSource.delete({ reviewId: reviewId });
            return result.affected !== 0;
        });
    }
}
exports.ReviewRepositoryImpl = ReviewRepositoryImpl;
