"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewModel = void 0;
class ReviewModel {
    constructor(reviewId, rating, comment, reviewType, createdAt, applicationId, reviewerUserId, reviewedUserId) {
        this.reviewId = reviewId;
        this.rating = rating;
        this.comment = comment;
        this.reviewType = reviewType;
        this.createdAt = createdAt;
        this.applicationId = applicationId;
        this.reviewerUserId = reviewerUserId;
        this.reviewedUserId = reviewedUserId;
    }
}
exports.ReviewModel = ReviewModel;
