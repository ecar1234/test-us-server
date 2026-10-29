import { Like } from "typeorm";
import { AppDataSource } from "../../config/DataSource.js";
import { BasePostEntity } from "../entities/PostEntities/BasePostEntity.js";
import { PromotionPostModel } from "../../domain/entities/PromotionPostModel.js";
import { IPromotionPostRepository } from "../../domain/interface_repositories/IPromotionPostRepository.js";
import { PromotionPostEntity } from "../entities/PostEntities/PromotionPostEntity.js";
import { PostReviewRepositoryImpl } from "./PostReviewRepositoryImpl.js";
import { convertCategoryToString, convertStringToCategory, MOBILE_OS_STRING } from "../../utils/convertUtil.js";
import { BasePostStateType } from "../enums/PostEnums.js";
import { UserStatus } from "../enums/UserEnums.js";



export class PromotionPostRepositoryImpl implements IPromotionPostRepository {

    private repository = AppDataSource.getRepository(PromotionPostEntity);
    private reviewRepository: PostReviewRepositoryImpl;
    constructor() {
        this.reviewRepository = new PostReviewRepositoryImpl();
    }


    private toEntity(post: PromotionPostModel): PromotionPostEntity {
        const status = post.status === 'active' ? BasePostStateType.ACTIVE : (post.status === 'delete' ? BasePostStateType.DELETE : BasePostStateType.EXPIRED)

        let authorRelation: { userId: string } | undefined = undefined;
        if (post.author) {
            if (typeof post.author === 'string') {
                authorRelation = { userId: post.author };
            } else if (typeof post.author === 'object' && post.author !== null && 'userId' in post.author && post.author.userId) {
                authorRelation = { userId: post.author.userId };
            }
        }

        const dbPost = this.repository.create({
            ...(post.id && { postId: post.id }),
            ...(authorRelation && { author: authorRelation }),
            title: post.title,
            subtitle: post.subtitle,
            platform: post.platform,
            mobileOs: MOBILE_OS_STRING[post.mobileOs],
            category: convertStringToCategory(post.category),
            contents: post.contents,
            images: post.images as BasePostEntity['images'],
            status: status,
            period: post.period,
            views: post.views,
            domain: post.domain,
            createdAt: post.createdAt ? post.createdAt : new Date(),
            updatedAt: post.updatedAt ? post.updatedAt : new Date(),
        });
        return dbPost;
    }
    public toDomain(post: PromotionPostEntity): PromotionPostModel {
        const authorInfo = post.author
            ? {
                userId: post.author.userId,
                nickname: post.author.nickname,
                profileImg: post.author.image,
                status: post.author.status === UserStatus.ACTIVE ? 'ACTIVE' : (post.author.status === UserStatus.INACTIVE ? 'INACTIVE' : 'DELETE')
            }
            : null;
        const status = post.status === BasePostStateType.ACTIVE ?
            'active' : (post.status === BasePostStateType.EXPIRED ? 'expired' : 'delete');
        const category = convertCategoryToString(post.category);
        return new PromotionPostModel(
            {
                id: post.postId,
                author: authorInfo,
                title: post.title,
                subtitle: post.subtitle,
                platform: post.platform,
                mobileOs: MOBILE_OS_STRING[post.mobileOs],
                category: category,
                contents: post.contents,
                status: status,
                period: post.period,
                views: post.views,
                images: post.images || [],
                domain: post.domain,
                // postType :'promotion',
                // post.receivedReviews ? post.receivedReviews.map(review => this.reviewRepository.toDomainPostReview(review)) : [],
                createdAt: post.createdAt,
                updatedAt: post.updatedAt
            }
        );
    }

    async createPost(post: PromotionPostModel): Promise<PromotionPostModel> {
        try {
            const postEntity = this.toEntity(post);
            const savedPost = await this.repository.save(postEntity);
            const newPost = await this.repository.findOne({
                where: { postId: savedPost.postId },
                relations: ['author']
            });
            return this.toDomain(newPost!);
        } catch (error) {
            console.log(error);
            throw error;
        }

    }

    async updatePost(post: PromotionPostModel): Promise<PromotionPostModel> {
        const postEntity = await this.repository.findOne({
            where: { postId: post.id },
            relations: ["author"],
        });

        if (!postEntity) {
            throw new Error("Promotion Post not found");
        }

        postEntity.title = post.title;
        postEntity.subtitle = post.subtitle;
        postEntity.platform = post.platform;
        postEntity.mobileOs = MOBILE_OS_STRING[post.mobileOs];
        postEntity.category = convertStringToCategory(post.category);
        postEntity.contents = post.contents;
        postEntity.images = post.images as BasePostEntity['images'];
        postEntity.status = post.status === 'active' ? BasePostStateType.ACTIVE : (post.status === 'delete' ? BasePostStateType.DELETE : BasePostStateType.EXPIRED);
        if (post.period !== undefined) postEntity.period = post.period;
        postEntity.domain = post.domain;

        const updatedPostEntity = await this.repository.save(postEntity);
        return this.toDomain(updatedPostEntity);
    }
    async deletePost(id: string): Promise<boolean> {
        const result = await this.repository.findOneBy({ postId: id });
        if (!result) {
            throw new Error("Promotion Post not found");
        }
        result.status = BasePostStateType.DELETE;
        await this.repository.save(result);
        return true;
    }
    async getPostById(id: string): Promise<PromotionPostModel> {
        const postEntity = await this.repository.findOne({
            where: { postId: id, status: BasePostStateType.ACTIVE },
            relations: ['author']
        });
        if (!postEntity) {
            throw new Error("Promotion Post not found");
        }
        postEntity.views += 1;
        await this.repository.save(postEntity);

        return this.toDomain(postEntity);;
    }
    async getUserPromotionPosts(userId: string): Promise<PromotionPostModel[]> {
        const postEntities = await this.repository.find({
            where: { author: { userId: userId }, status: BasePostStateType.ACTIVE },
            relations: ['author']
        });
        const domainPosts = postEntities.map(entity => this.toDomain(entity));
        return domainPosts;
    }
    async getPostByTitle(title: string): Promise<PromotionPostModel> {
        const postEntity = await this.repository.findOne({
            where: { title },
            relations: ['author']
        });
        if (!postEntity) {
            throw new Error("Promotion Post not found");
        }
        const domainPost = this.toDomain(postEntity);
        return domainPost;
    }
    async getPostsByAuthor(authorId: string): Promise<PromotionPostModel[]> {
        const postEntities = await this.repository.find({
            where: { author: { userId: authorId } },
            relations: ['author']
        });

        const domainPosts = postEntities.map(entity => this.toDomain(entity));
        return domainPosts;
    }
    async getPostsPaginations(page: number, size: number = 20): Promise<PromotionPostModel[]> {

        const posts = await this.repository.find({
            where: { status: BasePostStateType.ACTIVE, author: { status: UserStatus.ACTIVE } },
            relations: ['author'],
            order: { createdAt: 'DESC' },
            skip: (page - 1) * 10,
            take: size
        });
        const domainPosts = posts.map(postEntity => this.toDomain(postEntity));
        return domainPosts;
    }

    async searchPosts(keyword: string): Promise<PromotionPostModel[]> {
        const postEntities = await this.repository.find({
            where: [
                { title: Like(`%${keyword}%`), status: BasePostStateType.ACTIVE },
                { subtitle: Like(`%${keyword}%`), status: BasePostStateType.ACTIVE },
                { contents: Like(`%${keyword}%`), status: BasePostStateType.ACTIVE }
            ],
            relations: ['author']
        });
        if (!postEntities) {
            return [];
        }
        return postEntities.map(entity => this.toDomain(entity));
    }
}