import { AppDataSource } from "../../config/DataSource";
import { PostModel } from "../../domain/entities/PostModel";
import { IPostRepository } from "../../domain/interface_repositories/IPostRepository";
import { PostEntity, PostStatusType } from "../entities/PostEntity";


export class PostRepositoryImpl implements IPostRepository {
    private postRepository = AppDataSource.getRepository(PostEntity);
    private toDomainPost(postEntity: PostEntity): PostModel {
        return new PostModel(
            postEntity.postId,
            postEntity.author ? postEntity.author.userId : null,
            postEntity.title,
            postEntity.subtitle,
            postEntity.contents,
            postEntity.status,
            postEntity.period,
            postEntity.createdAt,
            postEntity.updatedAt
        );
    }
    private toEntityPost(post: PostModel): PostEntity {
        const postStatus = post.status === 'active' ? PostStatusType.ACTIVE : post.status === 'end' ? PostStatusType.END : PostStatusType.EXPIRED;
        const dbPost = this.postRepository.create({
            postId: post.id,
            title: post.title,
            subtitle: post.subtitle,
            contents: post.content,
            status: postStatus,
            period: post.period,
            createdAt: post.createdAt ? post.createdAt : new Date(),
            updatedAt: post.updatedAt ? post.updatedAt : new Date()
        });
        return dbPost;
    }
    
    async createPost(post:PostModel): Promise<PostModel> {
        const postEntity = this.toEntityPost(post);
        const savedPost = await this.postRepository.save(postEntity);
        return this.toDomainPost(savedPost);
    }

    async updatePost(post:PostModel): Promise<[PostModel | null, string]> {
        const existingPost = await this.postRepository.findOneBy({ postId: post.id });
        if (!existingPost) {
            return [null, "Post not found"];
        }
        const updatedPostEntity = this.toEntityPost(post);
        const updatedPost = await this.postRepository.save(updatedPostEntity);
        return [this.toDomainPost(updatedPost), "Post updated successfully"];
    }

    async deletePost(id: string): Promise<boolean> {
       const result = await this.postRepository.delete({ postId: id });
       return result.affected !== 0;
    }

    async getPostById(id: string): Promise<[PostModel | null, string]> {
        const postEntity = await this.postRepository.findOneBy({ postId: id });
        if (!postEntity) {
            return [null, "Post not found"];
        }
        return [this.toDomainPost(postEntity), "Post retrieved successfully"];
    }

    async getPostByTitle(title: string): Promise<[PostModel | null, string]> {
       const postEntity = await this.postRepository.findOneBy({ title });
       if (!postEntity) {
           return [null, "Post not found"];
       }
         return [this.toDomainPost(postEntity), "Post retrieved successfully"];
    }

    async getAllPosts(): Promise<PostModel[]> {
        const postEntities = await this.postRepository.find();
        return postEntities.map(postEntity => this.toDomainPost(postEntity));
    }
}