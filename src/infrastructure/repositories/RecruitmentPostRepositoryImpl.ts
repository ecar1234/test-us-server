import { In, MoreThan, Not } from "typeorm";
import { AppDataSource } from "../../config/DataSource";
import { RecruitmentPostModel } from "../../domain/entities/RecruitmentPostModel";
import { IRecruitmentPostRepository } from "../../domain/interface_repositories/IRecruitmentPostRepository";
import { RecruitmentPostEntity, RecruitmentPostStatusType } from "../entities/RecruitmentPostEntity";
import { UserModel } from "../../domain/entities/UserModel";
import { redisClient } from "../../config/RedisConfig";
import { ApplicationRepositoryImpl } from "./ApplicationRepositoryImpl";

export class RecruitmentPostRepositoryImpl implements IRecruitmentPostRepository {
    private postRepository = AppDataSource.getRepository(RecruitmentPostEntity);
    private applicationRepository: ApplicationRepositoryImpl;
    // private userRepository = AppDataSource.getRepository(UserEntity);
    constructor() {
        this.applicationRepository = new ApplicationRepositoryImpl();
    }
    private toDomainPost(postEntity: RecruitmentPostEntity): RecruitmentPostModel {
        // console.log("to postEntity : ",postEntity);
        const authorInfo = postEntity.author
            ? { userId: postEntity.author.userId, nickname: postEntity.author.nickname }
            : null;
        const status = postEntity.status === RecruitmentPostStatusType.ACTIVE ? 
        'active' : (postEntity.status === RecruitmentPostStatusType.END ? 'end' : (postEntity.status === RecruitmentPostStatusType.EXPIRED ? 'expired' : 'delete'));
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
            postEntity.images,
            postEntity.createdAt,
            postEntity.updatedAt,
            postEntity.applications ? postEntity.applications.map(app => this.applicationRepository.toDomainApplication(app)) : []
        );
    }
    private toEntityPost(post: RecruitmentPostModel): RecruitmentPostEntity {
        // console.log("post model : ", post);
        const postStatus = post.status === 'active' ? RecruitmentPostStatusType.ACTIVE : (post.status === 'end' ? RecruitmentPostStatusType.END : RecruitmentPostStatusType.EXPIRED);

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
            images: post.images,
            createdAt: post.createdAt ? post.createdAt : new Date(),
            updatedAt: post.updatedAt ? post.updatedAt : new Date(),
            ...(post.applications && { applications: post.applications.map(appId => ({ appId })) })
        });
        return dbPost;
    }

    async createPost(post: RecruitmentPostModel): Promise<RecruitmentPostModel> {
        const postEntity = this.toEntityPost(post);
        const savedPost = await this.postRepository.save(postEntity);

        // 새 게시물 추가 시, 첫 페이지 캐시를 삭제합니다.
        await redisClient.del('posts:page:1');

        return this.toDomainPost(savedPost);
    }

    async updatePost(post: RecruitmentPostModel): Promise<RecruitmentPostModel> {
        const postEntity = await this.postRepository.findOne({
            where: { postId: post.id },
            relations: ["author", "applications", "applications.applicant", "applications.post", "images"],
        });

        if (!postEntity) {
            throw new Error("Post not found");
        }

        // 필요한 필드만 업데이트합니다. 관계(images)는 직접 건드리지 않습니다.
        postEntity.title = post.title;
        postEntity.subtitle = post.subtitle;
        postEntity.platform = post.platform;
        postEntity.contents = post.contents;
        postEntity.status = post.status === 'active' ? RecruitmentPostStatusType.ACTIVE : (post.status === 'end' ? RecruitmentPostStatusType.END : RecruitmentPostStatusType.EXPIRED);
        if (post.period !== undefined) postEntity.period = post.period;

        const updatedPost = await this.postRepository.save(postEntity);

        // 게시물 업데이트 시, 관련 캐시를 모두 삭제합니다.
        // 더 정교한 전략을 사용할 수도 있지만, 모든 페이지 캐시를 지우는 것이 가장 간단하고 확실합니다.
        const keys = await redisClient.keys('posts:page:*');
        if (keys.length > 0) {
            await redisClient.del(keys);
        }
        await redisClient.del('favoritePosts');

        return this.toDomainPost(updatedPost);
    }

    async deletePost(id: string): Promise<boolean> {
        const result = await this.postRepository.findOneBy({ postId: id });
        if (!result) {
            throw new Error("Post not found");
        }
        result.status = RecruitmentPostStatusType.DELETE;
        await this.postRepository.save(result);

        // 게시물 삭제 시, 관련 캐시를 모두 삭제합니다.
        const keys = await redisClient.keys('posts:page:*');
        if (keys.length > 0) {
            await redisClient.del(keys);
        }
        await redisClient.del('favoritePosts');

        return true;
    }

    async getFavoritePostsPaginations(page: number): Promise<RecruitmentPostModel[]> {
        const cachedKey = `favoritePosts`;
        const cachedData = await redisClient.get(cachedKey);
        if (cachedData) {
            const parseredData: RecruitmentPostEntity[] = JSON.parse(cachedData);
            return parseredData.map(postEntity => this.toDomainPost(postEntity));
        }

        const favoritePosts = await this.postRepository.find({
            relations: ['author', 'applications', 'applications.applicant', 'applications.post', 'images'],
            where: { views: MoreThan(50), status: RecruitmentPostStatusType.ACTIVE },
            order: { views: 'DESC' },
            take: 10
        });

        if(favoritePosts.length){
            await redisClient.set(cachedKey, JSON.stringify(favoritePosts), 'EX', 60 * 10);
        }
        // console.log(favoritePosts);
        return favoritePosts.map(postEntity => this.toDomainPost(postEntity));
    }
    async getPostsPaginations(page: number): Promise<RecruitmentPostModel[]> {
        const cacheKey = `posts:page:${page}`;
        const cachedPosts = await redisClient.get(cacheKey);

        if (cachedPosts) {
            const parsedPosts: RecruitmentPostEntity[] = JSON.parse(cachedPosts);
            return parsedPosts.map(postEntity => this.toDomainPost(postEntity));
        }
        
        const posts = await this.postRepository.find({
            where: { status: RecruitmentPostStatusType.ACTIVE },
            relations: ['author', 'applications', 'applications.applicant', 'applications.post', 'images'],
            order: { createdAt: 'DESC' },
            skip: (page - 1) * 10,
            take: 10
        });

        if (posts.length > 0) {
            await redisClient.set(cacheKey, JSON.stringify(posts), 'EX', 60 * 10); // 10분 동안 캐시
        }

        return posts.map(postEntity => this.toDomainPost(postEntity));
    }

    async getPostById(id: string): Promise<RecruitmentPostModel> {
        const postEntity = await this.postRepository.findOne({
            where: { postId: id, status: RecruitmentPostStatusType.ACTIVE},
            relations: ['author', 'applications', 'applications.applicant', 'applications.post', 'images']
        });
        if (!postEntity) {
            throw new Error("Post not found");
        }
        postEntity.views += 1;
        const newPost = await this.postRepository.save(postEntity);
        // console.log(newPost);
        return this.toDomainPost(newPost);
    }

    async getUserRecuritmentPosts(userId: string): Promise<RecruitmentPostModel[]> {
        const redisKey = `userPosts:${userId}`;
        const cachedData = await redisClient.get(redisKey);
        if (cachedData) {
            const parsedData: RecruitmentPostEntity[] = JSON.parse(cachedData);
            return parsedData.map(postEntity => this.toDomainPost(postEntity));
        }

        const postEntities = await this.postRepository.find({
            where: { author: { userId }, status: Not(RecruitmentPostStatusType.DELETE)},
            relations: ['author', 'applications', 'applications.applicant', 'applications.post', 'images']
        });

        if(postEntities.length > 0){
            await redisClient.set(redisKey, JSON.stringify(postEntities), 'EX', 60 * 10);
        }

        return postEntities.map(postEntity => this.toDomainPost(postEntity));

    }

    async getPostByTitle(title: string): Promise<RecruitmentPostModel> {
        const postEntity = await this.postRepository.findOne({
            where: { title },
            relations: ['author', 'applications', 'applications.applicant', 'applications.post', 'images']
        });
        if (!postEntity) {
            throw new Error("Post not found");
        }
        return this.toDomainPost(postEntity);
    }

    async getPostsByAuthor(authorId: string): Promise<RecruitmentPostModel[]> {
        const postEntities = await this.postRepository.find({
            where: { author: { userId: authorId } },
            relations: ['author', 'applications', 'applications.applicant', 'applications.post', 'images']
        });

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