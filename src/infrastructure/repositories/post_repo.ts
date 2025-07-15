import { AppDataSource } from "../../config/data_source";
import { Post } from "../../domain/entities/post";
import { IPostRepository } from "../../domain/interface_repositories/IPostRepository";
import { PostEntity, PostStatusType } from "../entities/post_entity";


export class PostRepository implements IPostRepository {
    private postRepository = AppDataSource.getRepository(PostEntity);
    private toDomainPost(postEntity: PostEntity): Post {
        return new Post(
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
    private toEntityPost(post: Post): PostEntity {
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
    
    async createPost(post:Post): Promise<Post> {
        const postEntity = this.toEntityPost(post);
        const savedPost = await this.postRepository.save(postEntity);
        return this.toDomainPost(savedPost);
    }

    async updatePost(post:Post): Promise<[Post | null, string]> {
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

    async getPostById(id: string): Promise<[Post | null, string]> {
        const postEntity = await this.postRepository.findOneBy({ postId: id });
        if (!postEntity) {
            return [null, "Post not found"];
        }
        return [this.toDomainPost(postEntity), "Post retrieved successfully"];
    }

    async getPostByTitle(title: string): Promise<[Post | null, string]> {
       const postEntity = await this.postRepository.findOneBy({ title });
       if (!postEntity) {
           return [null, "Post not found"];
       }
         return [this.toDomainPost(postEntity), "Post retrieved successfully"];
    }

    async getAllPosts(): Promise<Post[]> {
        const postEntities = await this.postRepository.find();
        return postEntities.map(postEntity => this.toDomainPost(postEntity));
    }
}