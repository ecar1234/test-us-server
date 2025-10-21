import { AppDataSource } from "../../config/DataSource";
import { PromotionPostModel } from "../../domain/entities/PromotionPostModel";
import { IPromotionPostRepository } from "../../domain/interface_repositories/IPromotionPostRepository";
import { PromotionPostEntity, PromotionPostStatusType } from "../entities/PromotionPostEntity";


export class PromotionPostRepositoryImpl implements IPromotionPostRepository {
    constructor() { }
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
    private toDomain(post: PromotionPostEntity): PromotionPostModel {
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


    async getPostById(id: string): Promise<PromotionPostModel> {
        const postEntity = await this.repository.findOne({ where: { postId: id }, relations: ['author', 'images'] });
        if (!postEntity) {
            throw new Error("Promotion post not found");
        }
        return this.toDomain(postEntity);
    }


}