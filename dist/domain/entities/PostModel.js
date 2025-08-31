"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostModel = void 0;
class PostModel {
    constructor(id, authorId = null, title, subtitle, platform, contents, status = 'active', period = 7, views = 0, createdAt = new Date(), updatedAt = null, appilcations = []) {
        this.id = id;
        this.authorId = authorId;
        this.title = title;
        this.subtitle = subtitle;
        this.platform = platform;
        this.contents = contents;
        this.status = status;
        this.period = period;
        this.views = views;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.appilcations = appilcations;
    }
}
exports.PostModel = PostModel;
