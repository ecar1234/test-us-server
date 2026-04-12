import { In, Like, Not } from "typeorm";
import { AppDataSource } from "../../config/DataSource.js";
import { RecruitmentPostModel } from "../../domain/entities/RecruitmentPostModel.js";
import { IRecruitmentPostRepository } from "../../domain/interface_repositories/IRecruitmentPostRepository.js";
import { RecruitmentPostEntity } from "../entities/RecruitmentPostEntity.js";
import { redisClient } from "../../config/RedisConfig.js";
import { ApplicationRepositoryImpl } from "./ApplicationRepositoryImpl.js";
import { BasePostStateType, BasePostEntity, PostCategory, MobileOsType } from "../entities/BasePostEntity.js";
import { PostReviewRepositoryImpl } from "./PostReviewRepositoryImpl.js";
import { UserStatus } from "../entities/UserEntity.js";


export class RecruitmentPostRepositoryImpl implements IRecruitmentPostRepository {
    private postRepository = AppDataSource.getRepository(RecruitmentPostEntity);

    private applicationRepository: ApplicationRepositoryImpl;
    private reviewRepository: PostReviewRepositoryImpl;
    constructor() {
        this.applicationRepository = new ApplicationRepositoryImpl();
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
    private transferOsToString(mobileOs: MobileOsType): string {
        switch (mobileOs) {
            case MobileOsType.ANDROID:
                return 'android';
            case MobileOsType.IOS:
                return 'ios';
        }
    }
    private transferStringToOs(mobileOs: string): MobileOsType {
        switch (mobileOs) {
            case 'android':
                return MobileOsType.ANDROID;
            case 'ios':
                return MobileOsType.IOS;
        }
    }
    public toDomainPost(postEntity: RecruitmentPostEntity): RecruitmentPostModel {
        // console.log("to postEntity : ",postEntity);
        const authorInfo = postEntity.author
            ? {
                userId: postEntity.author.userId,
                nickname: postEntity.author.nickname,
                profileImg: postEntity.author.image,
                status: postEntity.author.status === UserStatus.ACTIVE ? 'ACTIVE' : (postEntity.author.status === UserStatus.INACTIVE ? 'INACTIVE' : 'DELETE')
            }
            : null;
        const status = postEntity.status === BasePostStateType.ACTIVE ?
            'active' : (postEntity.status === BasePostStateType.END ? 'end' : (postEntity.status === BasePostStateType.EXPIRED ? 'expired' : 'delete'));
        const category = this.transferCategoryToString(postEntity.category);
        const mobbileOs = this.transferOsToString(postEntity.mobileOs);
        return new RecruitmentPostModel(
            postEntity.postId,
            authorInfo,
            postEntity.title,
            postEntity.subtitle,
            postEntity.platform,
            mobbileOs,
            category,
            postEntity.contents,
            status,
            postEntity.period,
            postEntity.views,
            postEntity.images ?? [],
            postEntity.postType,
            postEntity.receivedReviews ? postEntity.receivedReviews.map(review => this.reviewRepository.toDomainPostReview(review)) : [],
            postEntity.createdAt,
            postEntity.updatedAt,
            postEntity.applications ? postEntity.applications.map(app => app.appId) : []
        );
    }
    private toEntityPost(post: RecruitmentPostModel): RecruitmentPostEntity {
        // console.log("post model : ", post);
        const postStatus = post.status === 'active' ? BasePostStateType.ACTIVE : (post.status === 'end' ? BasePostStateType.END : BasePostStateType.EXPIRED);

        let authorRelation: { userId: string } | undefined = undefined;
        if (post.author) {
            if (typeof post.author === 'string') {
                authorRelation = { userId: post.author };
            } else if (typeof post.author === 'object' && post.author !== null && 'userId' in post.author && post.author.userId) {
                // post.author.userId가 falsy(undefined, null, 빈 문자열 등)가 아닌지 확인합니다.
                authorRelation = { userId: post.author.userId };
            } else {
                // author 객체는 있지만 userId가 유효하지 않은 경우에 대한 방어 코드
            }
        }

        const dbPost = this.postRepository.create({
            ...(post.id && { postId: post.id }),
            ...(authorRelation && { author: authorRelation }),
            title: post.title,
            subtitle: post.subtitle,
            platform: post.platform,
            mobileOs: this.transferStringToOs(post.mobileOs),
            category: this.transferStringToCategory(post.category),
            contents: post.contents,
            images: post.images as BasePostEntity['images'],
            status: postStatus,
            period: post.period,
            views: post.views,
            createdAt: post.createdAt ? post.createdAt : new Date(),
            updatedAt: post.updatedAt ? post.updatedAt : new Date(),
            ...(post.applications && { applications: post.applications.map(appId => ({ appId })) })
        });
        return dbPost;
    }

    async createPost(post: RecruitmentPostModel): Promise<RecruitmentPostModel> {
        const postEntity = this.toEntityPost(post);
        const savedPost = await this.postRepository.save(postEntity);
        const newPost = await this.postRepository.findOne({
            where: { postId: savedPost.postId },
            relations: ['author']
        });

        // 새 게시물 추가 시, 첫 페이지 캐시를 삭제합니다.
        await redisClient.del('recruitPosts:page:1');

        return this.toDomainPost(newPost!);
    }

    async findPostAndStatus(id: string, status: string): Promise<RecruitmentPostModel | null> {
        const postEntity = await this.postRepository.findOne({
            where: { postId: id },
            relations: ['author']
        });
        if (!postEntity) {
            throw new Error("Post not found");
        }
        postEntity.status = status === 'active' ? BasePostStateType.ACTIVE : (status === 'end' ? BasePostStateType.END : BasePostStateType.DELETE);
        await this.postRepository.save(postEntity);

        return this.toDomainPost(postEntity);
    }
    async updatePost(post: RecruitmentPostModel): Promise<RecruitmentPostModel> {
        const postEntity = await this.postRepository.findOne({
            where: { postId: post.id },
            relations: ["author"],
        });

        if (!postEntity) {
            throw new Error("Post not found");
        }

        // 필요한 필드만 업데이트합니다. 관계(images)는 직접 건드리지 않습니다.
        postEntity.title = post.title;
        postEntity.subtitle = post.subtitle;
        postEntity.platform = post.platform;
        postEntity.mobileOs = this.transferStringToOs(post.mobileOs);
        postEntity.category = this.transferStringToCategory(post.category);
        postEntity.contents = post.contents;
        postEntity.images = post.images as BasePostEntity['images'];
        postEntity.status = post.status === 'active' ? BasePostStateType.ACTIVE : (post.status === 'end' ? BasePostStateType.END : BasePostStateType.EXPIRED);
        if (post.period !== undefined) postEntity.period = post.period;

        const updatedPost = await this.postRepository.save(postEntity);
        const domainPost = this.toDomainPost(updatedPost);

        const keys = await redisClient.keys('recruitPosts:page:*');
        if (keys.length > 0) {
            await redisClient.del(keys);
        }

        return domainPost;
    }

    async deletePost(id: string): Promise<boolean> {
        const result = await this.postRepository.findOneBy({ postId: id });
        if (!result) {
            throw new Error("Post not found");
        }
        result.status = BasePostStateType.DELETE;
        await this.postRepository.save(result);

        // 게시물 삭제 시, 관련 캐시를 모두 삭제합니다.
        const keys = await redisClient.keys('posts:page:*');
        if (keys.length > 0) {
            await redisClient.del(keys);
        }
        await redisClient.del('favoritePosts');

        return true;
    }

    async getPostsPaginations(page: number, size: number = 20): Promise<RecruitmentPostModel[]> {
        const posts = await this.postRepository.find({
            where: { status: BasePostStateType.ACTIVE , author: { status: UserStatus.ACTIVE } },
            relations: ['author'],
            order: { createdAt: 'DESC' },
            skip: (page - 1) * 10,
            take: size
        });

        const domainPosts = posts.map(postEntity => this.toDomainPost(postEntity));

        return domainPosts;
    }

    async getPostById(id: string): Promise<RecruitmentPostModel> {
        const postEntity = await this.postRepository.findOne({
            where: { postId: id, status: BasePostStateType.ACTIVE },
            relations: ['author', 'applications', 'applications.applicant', 'applications.post']
        });
        if (!postEntity) {
            throw new Error("Post not found");
        }
        postEntity.views += 1;
        await this.postRepository.save(postEntity); // 조회수 업데이트만 수행
        // console.log(postEntity);
        const domainPost = this.toDomainPost(postEntity); // save의 반환값이 아닌, relations가 포함된 원래 객체를 사용

        return domainPost;
    }

    async getPostAuthorId(postId: string): Promise<string | null> {
        const postEntity = await this.postRepository.findOne({
            where: { postId },
            relations: ['author'],
        });
        if (!postEntity || !postEntity.author) {
            return null;
        }
        return postEntity.author.userId;
    }

    async getUserRecuritmentPosts(userId: string): Promise<RecruitmentPostModel[]> {
        const postEntities = await this.postRepository.find({
            where: { author: { userId }, status: Not(BasePostStateType.DELETE) },
            relations: ['author', 'applications', 'applications.applicant', 'receivedReviews', 'receivedReviews.reviewer', 'receivedReviews.post'],
        });

        const domainPosts = postEntities.map(postEntity => this.toDomainPost(postEntity));

        return domainPosts;

    }

    async getPostByTitle(title: string): Promise<RecruitmentPostModel> {
        const postEntity = await this.postRepository.findOne({
            where: { title },
            relations: ['author', 'applications', 'applications.applicant', 'applications.post']
        });
        if (!postEntity) {
            throw new Error("Post not found");
        }
        return this.toDomainPost(postEntity);
    }

    async getPostsByAuthor(authorId: string): Promise<RecruitmentPostModel[]> {
        const postEntities = await this.postRepository.find({
            where: { author: { userId: authorId } },
            relations: ['author', 'applications', 'applications.applicant', 'applications.post']
        });

        const domainPosts = postEntities.map(entity => this.toDomainPost(entity));
        return domainPosts;
    }

    async getAppRecruitPosts(ids: string[]): Promise<RecruitmentPostModel[]> {
        const postEntities = await this.postRepository.find({
            where: { postId: In(ids) },
            relations: ['author', 'applications', 'applications.applicant', 'applications.post', 'receivedReviews', 'receivedReviews.reviewer', 'receivedReviews.post']
        });
        return postEntities.map(entity => this.toDomainPost(entity));
    }

    async searchPosts(keyword: string): Promise<RecruitmentPostModel[]> {
        const postEntities = await this.postRepository.find({
            where: [
                { title: Like(`%${keyword}%`), status: BasePostStateType.ACTIVE },
                { subtitle: Like(`%${keyword}%`), status: BasePostStateType.ACTIVE },
                { contents: Like(`%${keyword}%`), status: BasePostStateType.ACTIVE }
            ],
            relations: ['author', 'applications', 'applications.applicant', 'applications.post', 'receivedReviews', 'receivedReviews.reviewer', 'receivedReviews.post']
        });
        if (!postEntities) {
            return [];
        }
        return postEntities.map(entity => this.toDomainPost(entity));
    }


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