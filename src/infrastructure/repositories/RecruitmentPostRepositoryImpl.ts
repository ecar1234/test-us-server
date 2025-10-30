import { Not } from "typeorm";
import { AppDataSource } from "../../config/DataSource";
import { RecruitmentPostModel } from "../../domain/entities/RecruitmentPostModel";
import { IRecruitmentPostRepository } from "../../domain/interface_repositories/IRecruitmentPostRepository";
import { RecruitmentPostEntity } from "../entities/RecruitmentPostEntity";
import { redisClient } from "../../config/RedisConfig";
import { ApplicationRepositoryImpl } from "./ApplicationRepositoryImpl";
import { BasePostStateType } from "../entities/BasePostEntity";
import { ImagesRepositoryImpl } from "./ImagesRepositoryImpl";
import { ImagesModel } from "../../domain/entities/ImagesModel";

export class RecruitmentPostRepositoryImpl implements IRecruitmentPostRepository {
    private postRepository = AppDataSource.getRepository(RecruitmentPostEntity);

    private applicationRepository: ApplicationRepositoryImpl;
    public imagesRepository: ImagesRepositoryImpl;
    constructor() {
        this.applicationRepository = new ApplicationRepositoryImpl();
        this.imagesRepository = new ImagesRepositoryImpl();
    }
    public toDomainPost(postEntity: RecruitmentPostEntity): RecruitmentPostModel {
        // console.log("to postEntity : ",postEntity);
        const authorInfo = postEntity.author
            ? { userId: postEntity.author.userId, nickname: postEntity.author.nickname }
            : null;
        const status = postEntity.status === BasePostStateType.ACTIVE ?
            'active' : (postEntity.status === BasePostStateType.END ? 'end' : (postEntity.status === BasePostStateType.EXPIRED ? 'expired' : 'delete'));
        return new RecruitmentPostModel(
            postEntity.postId,
            authorInfo,
            postEntity.title,
            postEntity.subtitle,
            postEntity.platform,
            postEntity.contents,
            status,
            postEntity.period,
            postEntity.views,
            [], // 이미지는 별도로 로드하여 채웁니다.
            postEntity.createdAt,
            postEntity.updatedAt,
            postEntity.applications ? postEntity.applications.map(app => this.applicationRepository.toDomainApplication(app)) : []
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
            contents: post.contents,
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
        console.log(postEntity);
        const savedPost = await this.postRepository.save(postEntity);

        const domainPost = this.toDomainPost(savedPost);
        if (post.images && post.images.length > 0) {
            const savedImages = await this.imagesRepository.imagesRegister(post.images as ImagesModel[], savedPost.postId, 'recruitment');
            domainPost.images = savedImages;
        }

        // 새 게시물 추가 시, 첫 페이지 캐시를 삭제합니다.
        await redisClient.del('posts:page:1');

        return domainPost;
    }

    async updatePost(post: RecruitmentPostModel): Promise<RecruitmentPostModel> {
        const postEntity = await this.postRepository.findOne({
            where: { postId: post.id },
            relations: ["author", "applications", "applications.applicant"],
        });

        if (!postEntity) {
            throw new Error("Post not found");
        }

        // 필요한 필드만 업데이트합니다. 관계(images)는 직접 건드리지 않습니다.
        postEntity.title = post.title;
        postEntity.subtitle = post.subtitle;
        postEntity.platform = post.platform;
        postEntity.contents = post.contents;
        postEntity.status = post.status === 'active' ? BasePostStateType.ACTIVE : (post.status === 'end' ? BasePostStateType.END : BasePostStateType.EXPIRED);
        if (post.period !== undefined) postEntity.period = post.period;

        const updatedPost = await this.postRepository.save(postEntity);
        const domainPost = this.toDomainPost(updatedPost); // 이미지는 UseCase에서 처리 후 별도로 조회됩니다.
        // 더 정교한 전략을 사용할 수도 있지만, 모든 페이지 캐시를 지우는 것이 가장 간단하고 확실합니다.
        const keys = await redisClient.keys('posts:page:*');
        if (keys.length > 0) {
            await redisClient.del(keys);
        }
        await redisClient.del('favoritePosts');

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
        const cacheKey = `recruitPosts:page:${page}`;
        const cachedPosts = await redisClient.get(cacheKey);

        if (cachedPosts) {
            const parsedPosts: RecruitmentPostEntity[] = JSON.parse(cachedPosts);
            const domainPosts = parsedPosts.map(postEntity => this.toDomainPost(postEntity));
            // 캐시된 데이터에 이미지 정보를 추가합니다.
            for (const post of domainPosts) {
                post.images = await this.imagesRepository.getImagesByPostId(post.id);
            }
            return domainPosts;
        }

        const posts = await this.postRepository.find({
            where: { status: BasePostStateType.ACTIVE },
            relations: ['author', 'applications', 'applications.applicant'],
            order: { createdAt: 'DESC' },
            skip: (page - 1) * 10,
            take: size
        });

        const domainPosts = posts.map(postEntity => this.toDomainPost(postEntity));
        for (const post of domainPosts) {
            post.images = await this.imagesRepository.getImagesByPostId(post.id);
        }

        if (posts.length > 0) {
            await redisClient.set(cacheKey, JSON.stringify(posts), 'EX', 60 * 10); // 10분 동안 캐시
        }

        return domainPosts;
    }

    async getPostById(id: string): Promise<RecruitmentPostModel> {
        const postEntity = await this.postRepository.findOne({
            where: { postId: id, status: BasePostStateType.ACTIVE },
            relations: ['author', 'applications', 'applications.applicant']
        });
        if (!postEntity) {
            throw new Error("Post not found");
        }
        postEntity.views += 1;
        const newPost = await this.postRepository.save(postEntity);
        // console.log(newPost);
        const domainPost = this.toDomainPost(newPost);
        domainPost.images = await this.imagesRepository.getImagesByPostId(id);

        return domainPost;
    }

    async getUserRecuritmentPosts(userId: string): Promise<RecruitmentPostModel[]> {
        const redisKey = `userPosts:${userId}`;
        const cachedData = await redisClient.get(redisKey);
        if (cachedData) {
            const parsedData: RecruitmentPostEntity[] = JSON.parse(cachedData);
            const domainPosts = parsedData.map(postEntity => this.toDomainPost(postEntity));
            for (const post of domainPosts) {
                post.images = await this.imagesRepository.getImagesByPostId(post.id);
            }
            return domainPosts;
        }

        const postEntities = await this.postRepository.find({
            where: { author: { userId }, status: Not(BasePostStateType.DELETE) },
            relations: ['author', 'applications', 'applications.applicant']
        });

        const domainPosts = postEntities.map(postEntity => this.toDomainPost(postEntity));
        for (const post of domainPosts) {
            post.images = await this.imagesRepository.getImagesByPostId(post.id);
        }

        if (postEntities.length > 0) {
            await redisClient.set(redisKey, JSON.stringify(postEntities), 'EX', 60 * 10);
        }

        return domainPosts;

    }

    async getPostByTitle(title: string): Promise<RecruitmentPostModel> {
        const postEntity = await this.postRepository.findOne({
            where: { title },
            relations: ['author', 'applications', 'applications.applicant']
        });
        if (!postEntity) {
            throw new Error("Post not found");
        }
        return this.toDomainPost(postEntity);
    }

    async getPostsByAuthor(authorId: string): Promise<RecruitmentPostModel[]> {
        const postEntities = await this.postRepository.find({
            where: { author: { userId: authorId } },
            relations: ['author', 'applications', 'applications.applicant']
        });

        const domainPosts = postEntities.map(entity => this.toDomainPost(entity));
        for (const post of domainPosts) {
            post.images = await this.imagesRepository.getImagesByPostId(post.id);
        }
        return domainPosts;
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