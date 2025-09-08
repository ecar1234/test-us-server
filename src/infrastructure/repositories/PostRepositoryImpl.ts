import { In, MoreThan } from "typeorm";
import { AppDataSource } from "../../config/DataSource";
import { PostModel } from "../../domain/entities/PostModel";
import { IPostRepository } from "../../domain/interface_repositories/IPostRepository";
import { PostEntity, PostStatusType } from "../entities/PostEntity";
import { UserModel } from "../../domain/entities/UserModel";

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
            createdAt: post.createdAt ? post.createdAt : new Date(),
            updatedAt: post.updatedAt ? post.updatedAt : new Date(),
            ...(post.appilcations && { applications: post.appilcations.map(appId => ({ appId })) })
        });
        return dbPost;
    }

    async createPost(post: PostModel): Promise<PostModel> {
        const postEntity = this.toEntityPost(post);
        const savedPost = await this.postRepository.save(postEntity);
        return this.toDomainPost(savedPost);
    }

    async updatePost(post: PostModel): Promise<PostModel> {
        const postEntity = this.toEntityPost(post);
        await this.postRepository.save(postEntity);
        return this.toDomainPost(postEntity);
    }

    async deletePost(id: string): Promise<boolean> {
        const result = await this.postRepository.findOneBy({ postId: id });
        if (!result) {
            throw new Error("Post not found");
        }
        result.status = PostStatusType.DELETE;
        await this.postRepository.save(result);
        return true;
    }

    async getWebPostsPaginations(page: number): Promise<PostModel[]> {
        const webPosts = await this.postRepository.find({
            where: { platform: 'web' },
            relations: ['author', 'applications'],
            skip: (page - 1) * 10,
            take: 10
        });
        return webPosts.map(postEntity => this.toDomainPost(postEntity));
    }
    async getMobilePostsPaginations(page: number): Promise<PostModel[]> {
        const mobilePosts = await this.postRepository
            .createQueryBuilder('post')
            .leftJoinAndSelect('post.author', 'author')
            .leftJoinAndSelect('post.applications', 'applications')
            .where("FIND_IN_SET(:ios, post.platform) > 0 OR FIND_IN_SET(:android, post.platform) > 0", {
                ios: 'ios',
                android: 'android',
            })
            .skip((page - 1) * 10)
            .take(10)
            .getMany();
        return mobilePosts.map(postEntity => this.toDomainPost(postEntity));
    }
    async getFavoritePostsPaginations(page: number): Promise<PostModel[]> {
        const favoritePosts = await this.postRepository.find({
            relations: ['author', 'applications'],
            where: { views: MoreThan(0), status: PostStatusType.ACTIVE },
            order: { views: 'DESC' },
            skip: (page - 1) * 10,
            take: 10
        });
        // console.log(favoritePosts);
        return favoritePosts.map(postEntity => this.toDomainPost(postEntity));
    }
    async getPostsPaginations(page: number): Promise<PostModel[]> {
        const posts = await this.postRepository.find({
            where: { status: PostStatusType.ACTIVE },
            relations: ['author', 'applications'],
            skip: (page - 1) * 10,
            take: 10
        });
        // console.log(posts);
        return posts.map(postEntity => this.toDomainPost(postEntity));
    }

    async getPostById(id: string): Promise<PostModel> {
        const postEntity = await this.postRepository.findOne({
            where: { postId: id },
            relations: ['author', 'applications']
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
            relations: ['author', 'applications']
        });
        if (!postEntity) {
            throw new Error("Post not found");
        }
        return this.toDomainPost(postEntity);
    }

    async getPostsByAuthor(authorId: string): Promise<PostModel[]> {
        const postEntities = await this.postRepository.find({
            where: { author: { userId: authorId } },
            relations: ['author', 'applications']
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