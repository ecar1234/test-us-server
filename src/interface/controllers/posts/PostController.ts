import { Request, Response } from "express";
import { PostUseCase } from "../../../app/posts/PostUseCase.js";
import { getInitPostsQueue } from "../../../config/RedisConfig.js";


export class PostController {
    constructor(private postUseCase: PostUseCase) { }

    // async getFavoritePosts(req: Request, res: Response): Promise<void> {
    //     try {
    //         const [favoritePosts, recentPosts] = await this.postUseCase.getInitPosts();
    //         res.status(200).json({ status: 200, favoritePosts, recentPosts });
    //     } catch (error) {
    //         res.status(500).json({ status: 500, error: error.message });
    //     }
    // }

    async getInitPosts(req: Request, res: Response): Promise<void> {
        try {
            const job = await getInitPostsQueue.add('getInitPosts', {});
            // const posts = await this.postUseCase.getInitPosts();

            // res.status(200).json({ status: 200, favoritePosts: posts[0], posts: posts[1] });
            res.status(202).json({ status: 202, state: 'pending', jobId: job.id });
            return;

        } catch (error) {
            res.status(501).json({ error: error.message });
        }
    }

    async getInitUserPosts(req: Request, res: Response): Promise<void> {
        try {
            const job = await getInitPostsQueue.add('getInitUserPosts', { userId: req.params.userId });
            res.status(202).json({ status: 202, state: 'pending', jobId: job.id });
            return;
        } catch (error) {
            res.status(501).json({ error: error.message });
        }
    }

    async searchPosts(req: Request, res: Response): Promise<void> {
        try {
            const { keyword } = req.params;
            const posts = await this.postUseCase.searchPosts(keyword);
            res.status(200).json({ status: 200, recruit: posts[0], promotion: posts[1] });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}