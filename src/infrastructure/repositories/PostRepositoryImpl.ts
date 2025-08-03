import { AppDataSource } from "../../config/DataSource";
import { PostModel } from "../../domain/entities/PostModel";
import { IPostRepository } from "../../domain/interface_repositories/IPostRepository";
import { PostEntity, PostStatusType } from "../entities/PostEntity";
import { UserEntity } from "../entities/UserEntity";


export class PostRepositoryImpl implements IPostRepository {
    private postRepository = AppDataSource.getRepository(PostEntity);
    // private userRepository = AppDataSource.getRepository(UserEntity);
    
    private toDomainPost(postEntity: PostEntity): PostModel {
        // console.log(postEntity);
        const status = postEntity.status === PostStatusType.ACTIVE ? 'active' : (postEntity.status === PostStatusType.END ? 'end' : (postEntity.status === PostStatusType.EXPIRED ? 'expired' : 'delete' ));
        return new PostModel(
            postEntity.postId,
            postEntity.author && postEntity.author.userId,
            postEntity.title,
            postEntity.subtitle,
            postEntity.platform,
            postEntity.contents,
            status,
            postEntity.period,
            postEntity.createdAt,
            postEntity.updatedAt,
            postEntity.applications && postEntity.applications.map(application => application.appId)
        );
    }
    private toEntityPost(post: PostModel): PostEntity {
        const postStatus = post.status === 'active' ? PostStatusType.ACTIVE : (post.status === 'end' ? PostStatusType.END : PostStatusType.EXPIRED);
        const dbPost = this.postRepository.create({
            ...(post.id && {postId : post.id}),
            ...(post.authorId && { author: { userId: post.authorId } }),
            title: post.title,
            subtitle: post.subtitle,
            platform: post.platform,
            contents: post.contents,
            status: postStatus,
            period: post.period,
            createdAt: post.createdAt ? post.createdAt : new Date(),
            updatedAt: post.updatedAt ? post.updatedAt : new Date(),
            ...( post.appilcations && {applications: post.appilcations.map(appId => ({ appId }))})
        });
        return dbPost;
    }
    
    async createPost(post:PostModel): Promise<PostModel> {
        const postEntity = this.toEntityPost(post);
        const savedPost = await this.postRepository.save(postEntity);
        return this.toDomainPost(savedPost);
    }

    async updatePost(post:PostModel): Promise<PostModel> {
        const postEntity = await this.postRepository.findOne({
            where: { postId: post.id },
            relations: ['author', 'applications']
        });
        if (!postEntity) {
            throw new Error("Post not found");
        }
        // console.log(post);

        postEntity.title = post.title;
        postEntity.subtitle = post.subtitle;
        postEntity.platform = post.platform;
        postEntity.contents = post.contents;
        postEntity.status = post.status === "active" ? PostStatusType.ACTIVE : (post.status === "end" ? PostStatusType.END : PostStatusType.EXPIRED);
        // postEntity.period = post.period;

        const updatedPost = await this.postRepository.save(postEntity);
        
        return this.toDomainPost(updatedPost);
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

    async getPostById(id: string): Promise<PostModel> {
        const postEntity = await this.postRepository.findOne({
            where: { postId: id },
            relations: ['author', 'applications']
        });
        if (!postEntity) {
            throw new Error("Post not found");
        }
        return this.toDomainPost(postEntity);
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


    async getAllPosts(): Promise<PostModel[]> {
        const postEntities = await this.postRepository.find({
            relations: ['author', 'applications']
        });
        return postEntities.map(postEntity => this.toDomainPost(postEntity));
    }
}