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
exports.PostUseCase = void 0;
const PostModel_1 = require("../domain/entities/PostModel");
class PostUseCase {
    constructor(postRepository) {
        this.postRepository = postRepository;
    }
    createPost(authorId_1, title_1, subtitle_1, platform_1, contents_1) {
        return __awaiter(this, arguments, void 0, function* (authorId, title, subtitle, platform, contents, status = 'active', period = 7) {
            const post = new PostModel_1.PostModel(null, authorId, title, subtitle, platform, contents, status, period);
            return this.postRepository.createPost(post);
        });
    }
    updatePost(id_1, authorId_1, title_1, subtitle_1, platform_1, contents_1) {
        return __awaiter(this, arguments, void 0, function* (id, authorId, title, subtitle, platform, contents, status = 'active') {
            const post = new PostModel_1.PostModel(id, authorId, title, subtitle, platform, contents, status);
            return this.postRepository.updatePost(post);
        });
    }
    deletePost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.postRepository.deletePost(id);
        });
    }
    getPostById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.postRepository.getPostById(id);
        });
    }
    getPostByTitle(title) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.postRepository.getPostByTitle(title);
        });
    }
    // async getAllPosts(): Promise<PostModel[]> {
    //     return this.postRepository.getAllPosts();
    // }
    getInitPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            const webPosts = yield this.postRepository.getWebPostsPaginations(1);
            const mobilePosts = yield this.postRepository.getMobilePostsPaginations(1);
            const favoritePosts = yield this.postRepository.getFavoritePostsPaginations(1);
            return [webPosts, mobilePosts, favoritePosts];
        });
    }
    getWebPostsPaginations(page) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.postRepository.getWebPostsPaginations(page);
        });
    }
    getMobilePostsPaginations(page) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.postRepository.getMobilePostsPaginations(page);
        });
    }
    getFavoritePostsPaginations(page) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.postRepository.getFavoritePostsPaginations(page);
        });
    }
    getPostsByAuthor(authorId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.postRepository.getPostsByAuthor(authorId);
        });
    }
}
exports.PostUseCase = PostUseCase;
