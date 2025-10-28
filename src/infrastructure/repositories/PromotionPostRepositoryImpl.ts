import { AppDataSource } from "../../config/DataSource";
import { PromotionPostModel } from "../../domain/entities/PromotionPostModel";
import { IPromotionPostRepository } from "../../domain/interface_repositories/IPromotionPostRepository";
import { ImagesModel } from "../../domain/entities/ImagesModel";
import { BasePostStateType } from "../entities/BasePostEntity";
import { PromotionPostEntity } from "../entities/PromotionPostEntity";
import { ImagesRepositoryImpl } from "./ImagesRepositoryImpl";


export class PromotionPostRepositoryImpl implements IPromotionPostRepository {

    private repository = AppDataSource.getRepository(PromotionPostEntity);
    public imagesRepository = new ImagesRepositoryImpl();

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
            contents: post.contents,
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
            ? { userId: post.author.userId, nickname: post.author.nickname }
            : null;
        const status = post.status === BasePostStateType.ACTIVE ?
            'active' : (post.status === BasePostStateType.EXPIRED ? 'expired' : 'delete');
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
            [], // 이미지는 별도로 로드하여 채웁니다.
            post.domain,
            post.createdAt,
            post.updatedAt
        );
    }

    async createPost(post: PromotionPostModel): Promise<PromotionPostModel> {
        try {
            const postEntity = this.toEntity(post);
            const savedPost = await this.repository.save(postEntity);
            const domainPost = this.toDomain(savedPost);
            if (post.images && post.images.length > 0) {
                const savedImages = await this.imagesRepository.imagesRegister(post.images as ImagesModel[], savedPost.postId, 'promotion');
                domainPost.images = savedImages;
            }
            return domainPost;
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
        postEntity.status = post.status === 'active' ? BasePostStateType.ACTIVE : (post.status === 'delete' ? BasePostStateType.DELETE : BasePostStateType.EXPIRED);
        if (post.period !== undefined) postEntity.period = post.period;
        postEntity.domain = post.domain;

        const updatedPostEntity = await this.repository.save(postEntity);
        const domainPost = this.toDomain(updatedPostEntity);
        domainPost.images = await this.imagesRepository.getImagesByPostId(post.id);
        return domainPost;
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
        domainPost.images = await this.imagesRepository.getImagesByPostId(id);
        return domainPost;
    }
    async getUserPromotionPosts(userId: string): Promise<PromotionPostModel[]> {
        const postEntities = await this.repository.find({
            where: { author: { userId }, status: BasePostStateType.ACTIVE },
            relations: ['author']
        });
        const domainPosts = postEntities.map(entity => this.toDomain(entity));
        for (const post of domainPosts) {
            post.images = await this.imagesRepository.getImagesByPostId(post.id);
        }
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
        domainPost.images = await this.imagesRepository.getImagesByPostId(postEntity.postId);
        return domainPost;
    }
    async getPostsByAuthor(authorId: string): Promise<PromotionPostModel[]> {
        const postEntities = await this.repository.find({
            where: { author: { userId: authorId } },
            relations: ['author']
        });

        const domainPosts = postEntities.map(entity => this.toDomain(entity));
        for (const post of domainPosts) {
            post.images = await this.imagesRepository.getImagesByPostId(post.id);
        }
        return domainPosts;
    }
    async getPostsPaginations(page: number): Promise<PromotionPostModel[]> {
        const posts = await this.repository.find({
            where: { status: BasePostStateType.ACTIVE },
            relations: ['author'],
            order: { createdAt: 'DESC' },
            skip: (page - 1) * 10,
            take: 10
        });
        const domainPosts = posts.map(postEntity => this.toDomain(postEntity));
        for (const post of domainPosts) {
            post.images = await this.imagesRepository.getImagesByPostId(post.id);
        }
        return domainPosts;
    }
}