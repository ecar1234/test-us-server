import { AppDataSource } from "../../config/DataSource";
import { PromotionPostModel } from "../../domain/entities/PromotionPostModel";
import { IPromotionPostRepository } from "../../domain/interface_repositories/IPromotionPostRepository";
import { BasePostStateType, BasePostEntity, PostCategory, MobileOsType } from "../entities/BasePostEntity";
import { PromotionPostEntity } from "../entities/PromotionPostEntity";
import { redisClient } from "../../config/RedisConfig";
import { PostReviewRepositoryImpl } from "./PostReviewRepositoryImpl";



export class PromotionPostRepositoryImpl implements IPromotionPostRepository {

    private repository = AppDataSource.getRepository(PromotionPostEntity);
    private reviewRepository: PostReviewRepositoryImpl;
    constructor() {
        this.reviewRepository = new PostReviewRepositoryImpl();
    }
    private transferCategoryToString(category: PostCategory): string {
        switch (category) {
            case PostCategory.GAME:
                return 'game';
            case PostCategory.TRAVEL:
                return 'travel';
            case PostCategory.DEVELOPER_TOOL:
                return 'developerTool';
            case PostCategory.HEALTH:
                return 'health';
            case PostCategory.EDUCATION:
                return 'education';
            case PostCategory.FINANCE:
                return 'finance';
            case PostCategory.WEATHER:
                return 'weather';
            case PostCategory.NEWS:
                return 'news';
            case PostCategory.BOOKS:
                return 'books';
            case PostCategory.LIFE:
                return 'life';
            case PostCategory.BUSINESS:
                return 'business';
            case PostCategory.PHOTOGRAPHY:
                return 'photography';
            case PostCategory.SOCIAL:
                return 'social';
            case PostCategory.SPORTS:
                return 'sports';
            case PostCategory.SHOPPING:
                return 'shopping';
            case PostCategory.FOOD:
                return 'food';
            case PostCategory.UTILITY:
                return 'utility';
            case PostCategory.MEDICAL:
                return 'medical';
            case PostCategory.MAGAZINE:
                return 'magazine';
            case PostCategory.MUSIC:
                return 'music';
            case PostCategory.ENTERTAINMENT:
                return 'entertainment';
            case PostCategory.ETC:
                return 'etc';
            default:
                return 'etc';
        }
    }
    private transferStringToCategory(category: string): PostCategory {
        switch (category) {
            case 'game':
                return PostCategory.GAME;
            case 'travel':
                return PostCategory.TRAVEL;
            case 'developerTool':
                return PostCategory.DEVELOPER_TOOL;
            case 'health':
                return PostCategory.HEALTH;
            case 'education':
                return PostCategory.EDUCATION;
            case 'finance':
                return PostCategory.FINANCE;
            case 'weather':
                return PostCategory.WEATHER;
            case 'news':
                return PostCategory.NEWS;
            case 'books':
                return PostCategory.BOOKS;
            case 'life':
                return PostCategory.LIFE;
            case 'business':
                return PostCategory.BUSINESS;
            case 'photography':
                return PostCategory.PHOTOGRAPHY;
            case 'social':
                return PostCategory.SOCIAL;
            case 'sports':
                return PostCategory.SPORTS;
            case 'shopping':
                return PostCategory.SHOPPING;
            case 'food':
                return PostCategory.FOOD;
            case 'utility':
                return PostCategory.UTILITY;
            case 'medical':
                return PostCategory.MEDICAL;
            case 'magazine':
                return PostCategory.MAGAZINE;
            case 'music':
                return PostCategory.MUSIC;
            case 'entertainment':
                return PostCategory.ENTERTAINMENT;
            case 'etc':
                return PostCategory.ETC;
            default:
                return PostCategory.ETC;
        }
    }
    private transferOsToString(os: MobileOsType[]): string[] {
        let res = [];
        if (os.length !== 0) {
            res = os.map(os => {
                switch (os) {
                    case MobileOsType.ANDROID:
                        res.push('android');
                        break;
                    case MobileOsType.IOS:
                        res.push('ios');
                        break;
                }
            });
        }
        return res;
    }
    private transferStringToOs(os: string[]): MobileOsType[] {
        let res = [];
        if (os.length !== 0) {
            res = os.map(os => {
                switch (os) {
                    case 'android':
                        res.push(MobileOsType.ANDROID);
                        break;
                    case 'ios':
                        res.push(MobileOsType.IOS);
                        break;
                }
            });
        }
        return res;
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
            mobileOs: this.transferStringToOs(post.mobileOs),
            category: this.transferStringToCategory(post.category),
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
                profileImg: post.author.image
            }
            : null;
        const status = post.status === BasePostStateType.ACTIVE ?
            'active' : (post.status === BasePostStateType.EXPIRED ? 'expired' : 'delete');
        const category = this.transferCategoryToString(post.category);
        return new PromotionPostModel(
            post.postId,
            authorInfo,
            post.title,
            post.subtitle,
            post.platform,
            this.transferOsToString(post.mobileOs),
            category,
            post.contents,
            status,
            post.period,
            post.views,
            post.images || [],
            post.domain,
            post.postType,
            post.receivedReviews ? post.receivedReviews.map(review => this.reviewRepository.toDomainPostReview(review)) : [],
            post.createdAt,
            post.updatedAt
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
        const newPost = await this.repository.save(postEntity);
        const domainPost = this.toDomain(newPost);
        return domainPost;
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
        const cacheKey = `promotionPosts:page:${page}`;
        const cachedPosts = await redisClient.get(cacheKey);

        if (cachedPosts && cachedPosts.length > 0) {
            try {
                const parsedPosts = JSON.parse(cachedPosts);
                if (Array.isArray(parsedPosts)) {
                    const domainPosts = parsedPosts.map(postEntity => this.toDomain(postEntity));
                    return domainPosts;
                }
            } catch (error) {
                // JSON 파싱 실패 시, 캐시를 삭제하여 다음 요청 시 DB에서 새로 가져오도록 합니다.
                console.error('Failed to parse cached promotion posts, deleting cache key:', cacheKey, error);
                await redisClient.del(cacheKey);
            }
        }

        const posts = await this.repository.find({
            where: { status: BasePostStateType.ACTIVE },
            relations: ['author'],
            order: { createdAt: 'DESC' },
            skip: (page - 1) * 10,
            take: size
        });
        const domainPosts = posts.map(postEntity => this.toDomain(postEntity));
        return domainPosts;
    }
}