import { In, MoreThan } from "typeorm";
import { AppDataSource } from "../../config/DataSource";
import { PostModel } from "../../domain/entities/PostModel";
import { IPostRepository } from "../../domain/interface_repositories/IPostRepository";
import { PostEntity, PostStatusType } from "../entities/PostEntity";
import { UserModel } from "../../domain/entities/UserModel";
import { redisClient } from "../../config/RedisConfig";

export class PostRepositoryImpl implements IPostRepository {
    private postRepository = AppDataSource.getRepository(PostEntity);
    // private userRepository = AppDataSource.getRepository(UserEntity);

    private toDomainPost(postEntity: PostEntity): PostModel {
        // console.log("postEntity : ",postEntity);
        const authorInfo = postEntity.author
            ? { userId: postEntity.author.userId, nickname: postEntity.author.nickname }
            : null;
        const status = postEntity.status === PostStatusType.ACTIVE ? 'active' : (postEntity.status === PostStatusType.END ? 'end' : (postEntity.status === PostStatusType.EXPIRED ? 'expired' : 'delete'));
        return new PostModel(
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
            postEntity.applications && postEntity.applications.map(application => application.appId)
        );
    }
    private toEntityPost(post: PostModel): PostEntity {
        // console.log("post model : ", post);
        const postStatus = post.status === 'active' ? PostStatusType.ACTIVE : (post.status === 'end' ? PostStatusType.END : PostStatusType.EXPIRED);

        let authorRelation: { userId: string } | undefined = undefined;
        if (post.author) {
            if (typeof post.author === 'string') {
                authorRelation = { userId: post.author };
            } else if (typeof post.author === 'object' && post.author !== null && 'userId' in post.author) {
                authorRelation = { userId: post.author.userId };
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
            ...(post.appilcations && { applications: post.appilcations.map(appId => ({ appId })) })
        });
        return dbPost;
    }

    async createPost(post: PostModel): Promise<PostModel> {
        const postEntity = this.toEntityPost(post);
        const savedPost = await this.postRepository.save(postEntity);

        // 새 게시물 추가 시, 첫 페이지 캐시를 삭제합니다.
        await redisClient.del('posts:page:1');

        return this.toDomainPost(savedPost);
    }

    async updatePost(post: PostModel): Promise<PostModel> {
        const postEntity = await this.postRepository.findOne({
            where: { postId: post.id },
            relations: ["author", "applications", "images"],
        });

        if (!postEntity) {
            throw new Error("Post not found");
        }

        // 필요한 필드만 업데이트합니다. 관계(images)는 직접 건드리지 않습니다.
        postEntity.title = post.title;
        postEntity.subtitle = post.subtitle;
        postEntity.platform = post.platform;
        postEntity.contents = post.contents;
        postEntity.status = post.status === 'active' ? PostStatusType.ACTIVE : (post.status === 'end' ? PostStatusType.END : PostStatusType.EXPIRED);
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
        result.status = PostStatusType.DELETE;
        await this.postRepository.save(result);

        // 게시물 삭제 시, 관련 캐시를 모두 삭제합니다.
        const keys = await redisClient.keys('posts:page:*');
        if (keys.length > 0) {
            await redisClient.del(keys);
        }
        await redisClient.del('favoritePosts');

        return true;
    }

    // async getWebPostsPaginations(page: number): Promise<PostModel[]> {
    //     const webPosts = await this.postRepository.find({
    //         where: { platform: 'web' },
    //         relations: ['author', 'applications'],
    //         skip: (page - 1) * 10,
    //         take: 10
    //     });
    //     return webPosts.map(postEntity => this.toDomainPost(postEntity));
    // }
    // async getMobilePostsPaginations(page: number): Promise<PostModel[]> {
    //     const mobilePosts = await this.postRepository
    //         .createQueryBuilder('post')
    //         .leftJoinAndSelect('post.author', 'author')
    //         .leftJoinAndSelect('post.applications', 'applications')
    //         .where("FIND_IN_SET(:ios, post.platform) > 0 OR FIND_IN_SET(:android, post.platform) > 0", {
    //             ios: 'ios',
    //             android: 'android',
    //         })
    //         .skip((page - 1) * 10)
    //         .take(10)
    //         .getMany();
    //     return mobilePosts.map(postEntity => this.toDomainPost(postEntity));
    // }
    async getFavoritePostsPaginations(page: number): Promise<PostModel[]> {
        const cachedKey = `favoritePosts`;
        const cachedData = await redisClient.get(cachedKey);
        if (cachedData) {
            const parseredData: PostEntity[] = JSON.parse(cachedData);
            return parseredData.map(postEntity => this.toDomainPost(postEntity));
        }

        const favoritePosts = await this.postRepository.find({
            relations: ['author', 'applications', 'images'],
            where: { views: MoreThan(50), status: PostStatusType.ACTIVE },
            order: { views: 'DESC' },
            take: 10
        });

        if(favoritePosts.length){
            await redisClient.set(cachedKey, JSON.stringify(favoritePosts), 'EX', 60 * 10);
        }
        // console.log(favoritePosts);
        return favoritePosts.map(postEntity => this.toDomainPost(postEntity));
    }
    async getPostsPaginations(page: number): Promise<PostModel[]> {
        const cacheKey = `posts:page:${page}`;
        const cachedPosts = await redisClient.get(cacheKey);

        if (cachedPosts) {
            const parsedPosts: PostEntity[] = JSON.parse(cachedPosts);
            return parsedPosts.map(postEntity => this.toDomainPost(postEntity));
        }
        
        const posts = await this.postRepository.find({
            where: { status: PostStatusType.ACTIVE },
            relations: ['author', 'applications', 'images'],
            order: { createdAt: 'DESC' },
            skip: (page - 1) * 10,
            take: 10
        });

        if (posts.length > 0) {
            await redisClient.set(cacheKey, JSON.stringify(posts), 'EX', 60 * 10); // 10분 동안 캐시
        }

        return posts.map(postEntity => this.toDomainPost(postEntity));
    }

    async getPostById(id: string): Promise<PostModel> {
        const postEntity = await this.postRepository.findOne({
            where: { postId: id },
            relations: ['author', 'applications', 'images']
        });
        if (!postEntity) {
            throw new Error("Post not found");
        }
        postEntity.views += 1;
        const newPost = await this.postRepository.save(postEntity);
        // console.log(newPost);
        return this.toDomainPost(newPost);
    }

    async getPostByTitle(title: string): Promise<PostModel> {
        const postEntity = await this.postRepository.findOne({
            where: { title },
            relations: ['author', 'applications', 'images']
        });
        if (!postEntity) {
            throw new Error("Post not found");
        }
        return this.toDomainPost(postEntity);
    }

    async getPostsByAuthor(authorId: string): Promise<PostModel[]> {
        const postEntities = await this.postRepository.find({
            where: { author: { userId: authorId } },
            relations: ['author', 'applications', 'images']
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