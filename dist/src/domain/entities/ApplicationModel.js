"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationModel = void 0;
class ApplicationModel {
    constructor(id, platform, status, appliedAt = new Date(), updatedAt = null, postId, applicantId) {
        this.id = id;
        this.platform = platform;
        this.status = status;
        this.appliedAt = appliedAt;
        this.updatedAt = updatedAt;
        this.postId = postId;
        this.applicantId = applicantId;
    }
}
exports.ApplicationModel = ApplicationModel;
