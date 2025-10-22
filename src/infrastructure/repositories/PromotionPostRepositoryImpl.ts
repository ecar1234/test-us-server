import { AppDataSource } from "../../config/DataSource";
import { PromotionPostModel } from "../../domain/entities/PromotionPostModel";
import { IPromotionPostRepository } from "../../domain/interface_repositories/IPromotionPostRepository";
import { PromotionPostEntity, PromotionPostStatusType } from "../entities/PromotionPostEntity";


export class PromotionPostRepositoryImpl implements IPromotionPostRepository {

    private repository = AppDataSource.getRepository(PromotionPostEntity);

    private toEntity(post: PromotionPostModel): PromotionPostEntity {
        const status = post.status === 'active' ? PromotionPostStatusType.ACTIVE : (post.status === 'delete' ? PromotionPostStatusType.DELETE : PromotionPostStatusType.EXPIRED)

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
            contents: post.contents,
            status: status,
            period: post.period,
            views: post.views,
            domain: post.domain,
            images: post.images,
            createdAt: post.createdAt ? post.createdAt : new Date(),
            updatedAt: post.updatedAt ? post.updatedAt : new Date(),
        });
        return dbPost;
    }
    public toDomain(post: PromotionPostEntity): PromotionPostModel {
        const authorInfo = post.author
            ? { userId: post.author.userId, nickname: post.author.nickname }
            : null;
        const status = post.status === PromotionPostStatusType.ACTIVE ?
            'active' : (post.status === PromotionPostStatusType.EXPIRED ? 'expired' : 'delete');
        return new PromotionPostModel(
            post.postId,
            authorInfo,
            post.title,
            post.subtitle,
            post.platform,
            post.contents,
            status,
            post.period,
            post.views,
            post.images,
            post.domain,
            post.createdAt,
            post.updatedAt
        );
    }

    async createPost(post: PromotionPostModel): Promise<PromotionPostModel> {
        try {
            const postEntity = this.toEntity(post);
            const savedPost = await this.repository.save(postEntity);

            return this.toDomain(savedPost);
        } catch (error) {
            console.log(error);
            throw error;
        }

    }
    async updatePost(post: PromotionPostModel): Promise<PromotionPostModel> {
        const postEntity = await this.repository.findOne({
            where: { postId: post.id },
            relations: ["author", "images"],
        });

        if (!postEntity) {
            throw new Error("Promotion Post not found");
        }

        postEntity.title = post.title;
        postEntity.subtitle = post.subtitle;
        postEntity.platform = post.platform;
        postEntity.contents = post.contents;
        postEntity.status = post.status === 'active' ? PromotionPostStatusType.ACTIVE : (post.status === 'delete' ? PromotionPostStatusType.DELETE : PromotionPostStatusType.EXPIRED);
        if (post.period !== undefined) postEntity.period = post.period;
        postEntity.domain = post.domain;

        const updatedPost = await this.repository.save(postEntity);
        return this.toDomain(updatedPost);
    }
    async deletePost(id: string): Promise<boolean> {
        const result = await this.repository.findOneBy({ postId: id });
        if (!result) {
            throw new Error("Promotion Post not found");
        }
        result.status = PromotionPostStatusType.DELETE;
        await this.repository.save(result);
        return true;
    }
    async getPostById(id: string): Promise<PromotionPostModel> {
        const postEntity = await this.repository.findOne({
            where: { postId: id, status: PromotionPostStatusType.ACTIVE },
            relations: ['author', 'images']
        });
        if (!postEntity) {
            throw new Error("Promotion Post not found");
        }
        postEntity.views += 1;
        const newPost = await this.repository.save(postEntity);
        return this.toDomain(newPost);
    }
    async getUserPromotionPosts(userId: string): Promise<PromotionPostModel[]> {
        const postEntities = await this.repository.find({
            where: { author: { userId }, status: PromotionPostStatusType.ACTIVE },
            relations: ['author', 'images']
        });
        return postEntities.map(entity => this.toDomain(entity));
    }
    async getPostByTitle(title: string): Promise<PromotionPostModel> {
        const postEntity = await this.repository.findOne({
            where: { title },
            relations: ['author', 'images']
        });
        if (!postEntity) {
            throw new Error("Promotion Post not found");
        }
        return this.toDomain(postEntity);
    }
    async getPostsByAuthor(authorId: string): Promise<PromotionPostModel[]> {
        const postEntities = await this.repository.find({
            where: { author: { userId: authorId } },
            relations: ['author', 'images']
        });

        return postEntities.map(entity => this.toDomain(entity));
    }
    async getPostsPaginations(page: number): Promise<PromotionPostModel[]> {
        const posts = await this.repository.find({
            where: { status: PromotionPostStatusType.ACTIVE },
            relations: ['author', 'images'],
            order: { createdAt: 'DESC' },
            skip: (page - 1) * 10,
            take: 10
        });
        return posts.map(postEntity => this.toDomain(postEntity));
    }
}