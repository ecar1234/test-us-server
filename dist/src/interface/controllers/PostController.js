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
exports.PostController = void 0;
class PostController {
    constructor(postUseCase) {
        this.postUseCase = postUseCase;
    }
    createPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // authorId는 인증된 사용자 세션(예: req.user.id)에서 가져오는 것이 더 좋습니다.
                const { authorId, title, subtitle, platform, contents } = req.body;
                const post = yield this.postUseCase.createPost(authorId, title, subtitle, platform, contents);
                res.status(200).json({ status: 200, post: post });
            }
            catch (error) {
                res.status(500).json({ status: 500, error: error.message });
            }
        });
    }
    updatePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { postId, authorId, title, subtitle, platform, contents, status } = req.body;
                const updatedPost = yield this.postUseCase.updatePost(postId, authorId, title, subtitle, platform, contents, status);
                if (updatedPost) {
                    res.status(200).json({ status: 200, post: updatedPost, message: "Post updated successfully" });
                }
                else {
                    res.status(404).json({ status: 404, error: "Post not found" });
                }
            }
            catch (error) {
                res.status(500).json({ status: 500, error: error.message });
            }
        });
    }
    deletePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { postId } = req.body;
                const success = yield this.postUseCase.deletePost(postId);
                if (success) {
                    res.status(200).json({ status: 200, result: success, message: "Post deleted successfully" });
                }
                else {
                    res.status(404).json({ status: 404, error: "Post not found" });
                }
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    getPostById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const post = yield this.postUseCase.getPostById(id);
                if (post) {
                    res.status(200).json({ status: 200, post: post });
                }
                else {
                    res.status(404).json({ status: 404, error: "Post not found" });
                }
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    getPostByTitle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { title } = req.params;
                const post = yield this.postUseCase.getPostByTitle(title);
                if (post) {
                    res.status(200).json({ status: 200, post: post });
                }
                else {
                    res.status(404).json({ status: 404, error: "Post not found" });
                }
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    getAllPosts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const posts = yield this.postUseCase.getAllPosts();
                res.status(200).json({ status: 200, posts: posts });
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    getPostsByAuthor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { authorId } = req.params;
                const posts = yield this.postUseCase.getPostsByAuthor(authorId);
                res.status(200).json({ status: 200, posts: posts });
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
}
exports.PostController = PostController;
