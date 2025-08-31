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
exports.PostRepositoryImpl = void 0;
const typeorm_1 = require("typeorm");
const DataSource_1 = require("../../config/DataSource");
const PostModel_1 = require("../../domain/entities/PostModel");
const PostEntity_1 = require("../entities/PostEntity");
class PostRepositoryImpl {
    constructor() {
        this.postRepository = DataSource_1.AppDataSource.getRepository(PostEntity_1.PostEntity);
        // async getPostsByNickname(nickname: string): Promise<PostModel[]> {
        //     const userEntity = await this.userRepository.findOne({
        //         where: { nickname },
        //         relations: ['posts']
        //     });
        //     if (!userEntity) {
        //         throw new Error("User not found");
        //     }
        //     return userEntity.posts.map(postEntity => this.toDomainPost(postEntity));
        // }
        // async getAllPosts(): Promise<PostModel[]> {
        //     const postEntities = await this.postRepository.find({
        //         relations: ['author', 'applications']
        //     });
        //     return postEntities.map(postEntity => this.toDomainPost(postEntity));
        // }
    }
    // private userRepository = AppDataSource.getRepository(UserEntity);
    toDomainPost(postEntity) {
        // console.log(postEntity);
        const status = postEntity.status === PostEntity_1.PostStatusType.ACTIVE ? 'active' : (postEntity.status === PostEntity_1.PostStatusType.END ? 'end' : (postEntity.status === PostEntity_1.PostStatusType.EXPIRED ? 'expired' : 'delete'));
        return new PostModel_1.PostModel(postEntity.postId, postEntity.author && postEntity.author.userId, postEntity.title, postEntity.subtitle, postEntity.platform, postEntity.contents, status, postEntity.period, postEntity.views, postEntity.createdAt, postEntity.updatedAt, postEntity.applications && postEntity.applications.map(application => application.appId));
    }
    toEntityPost(post) {
        const postStatus = post.status === 'active' ? PostEntity_1.PostStatusType.ACTIVE : (post.status === 'end' ? PostEntity_1.PostStatusType.END : PostEntity_1.PostStatusType.EXPIRED);
        const dbPost = this.postRepository.create(Object.assign(Object.assign(Object.assign(Object.assign({}, (post.id && { postId: post.id })), (post.authorId && { author: { userId: post.authorId } })), { title: post.title, subtitle: post.subtitle, platform: post.platform, contents: post.contents, status: postStatus, period: post.period, views: post.views, createdAt: post.createdAt ? post.createdAt : new Date(), updatedAt: post.updatedAt ? post.updatedAt : new Date() }), (post.appilcations && { applications: post.appilcations.map(appId => ({ appId })) })));
        return dbPost;
    }
    createPost(post) {
        return __awaiter(this, void 0, void 0, function* () {
            const postEntity = this.toEntityPost(post);
            const savedPost = yield this.postRepository.save(postEntity);
            return this.toDomainPost(savedPost);
        });
    }
    updatePost(post) {
        return __awaiter(this, void 0, void 0, function* () {
            const postEntity = yield this.postRepository.findOne({
                where: { postId: post.id },
                relations: ['author', 'applications']
            });
            if (!postEntity) {
                throw new Error("Post not found");
            }
            // console.log(post);
            postEntity.title = post.title;
            postEntity.subtitle = post.subtitle;
            postEntity.platform = post.platform;
            postEntity.contents = post.contents;
            postEntity.status = post.status === "active" ? PostEntity_1.PostStatusType.ACTIVE : (post.status === "end" ? PostEntity_1.PostStatusType.END : PostEntity_1.PostStatusType.EXPIRED);
            // postEntity.period = post.period;
            const updatedPost = yield this.postRepository.save(postEntity);
            return this.toDomainPost(updatedPost);
        });
    }
    deletePost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.postRepository.findOneBy({ postId: id });
            if (!result) {
                throw new Error("Post not found");
            }
            result.status = PostEntity_1.PostStatusType.DELETE;
            yield this.postRepository.save(result);
            return true;
        });
    }
    getWebPostsPaginations(page) {
        return __awaiter(this, void 0, void 0, function* () {
            const webPosts = yield this.postRepository.find({
                where: { platform: 'web' },
                relations: ['author', 'applications'],
                skip: (page - 1) * 10,
                take: 10
            });
            return webPosts.map(postEntity => this.toDomainPost(postEntity));
        });
    }
    getMobilePostsPaginations(page) {
        return __awaiter(this, void 0, void 0, function* () {
            const mobilePosts = yield this.postRepository.find({
                where: { platform: 'mobile' },
                relations: ['author', 'applications'],
                skip: (page - 1) * 10,
                take: 10
            });
            return mobilePosts.map(postEntity => this.toDomainPost(postEntity));
        });
    }
    getFavoritePostsPaginations(page) {
        return __awaiter(this, void 0, void 0, function* () {
            const favoritePosts = yield this.postRepository.find({
                relations: ['author', 'applications'],
                where: { views: (0, typeorm_1.MoreThan)(0) },
                order: { views: 'DESC' },
                skip: (page - 1) * 10,
                take: 10
            });
            return favoritePosts.map(postEntity => this.toDomainPost(postEntity));
        });
    }
    getPostById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const postEntity = yield this.postRepository.findOne({
                where: { postId: id },
                relations: ['author', 'applications']
            });
            if (!postEntity) {
                throw new Error("Post not found");
            }
            postEntity.views += 1;
            yield this.postRepository.save(postEntity);
            return this.toDomainPost(postEntity);
        });
    }
    getPostByTitle(title) {
        return __awaiter(this, void 0, void 0, function* () {
            const postEntity = yield this.postRepository.findOne({
                where: { title },
                relations: ['author', 'applications']
            });
            if (!postEntity) {
                throw new Error("Post not found");
            }
            return this.toDomainPost(postEntity);
        });
    }
    getPostsByAuthor(authorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const postEntities = yield this.postRepository.find({
                where: { author: { userId: authorId } },
                relations: ['author', 'applications']
            });
            return postEntities.map(entity => this.toDomainPost(entity));
        });
    }
}
exports.PostRepositoryImpl = PostRepositoryImpl;
