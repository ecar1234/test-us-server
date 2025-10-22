import { PostUseCase } from "../../app/PostUseCase";
import { Request, Response } from "express";
import { getInitPostsQueue } from "../../config/RedisConfig";


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

    // Recruitment
        async createRecruitPost(req: Request, res: Response): Promise<void> {
        try {
            // authorId는 인증된 사용자 세션(예: req.user.id)에서 가져오는 것이 더 좋습니다.
            const { author, title, subtitle, platform, contents, images } = req.body;
            
            const post = await this.postUseCase.createRecruitPost(author, title, subtitle, platform, contents, images);
            res.status(200).json({ status: 200, post: post });
        } catch (error) {
            res.status(500).json({ status: 500, error: error.message });
        }
    }

    async updateRecruitPost(req: Request, res: Response): Promise<void> {
        try {
            const { id, author, title, subtitle, platform, contents, status } = req.body;
            const updatedPost = await this.postUseCase.updateRecruitPost(id, author, title, subtitle, platform, contents, status);
            if (updatedPost) {
                res.status(200).json({ status: 200, post: updatedPost, message: "Post updated successfully" });
            } else {
                res.status(404).json({ status: 404, error: "Post not found" });
            }
        } catch (error) {
            res.status(500).json({ status: 500, error: error.message });
        }
    }

    async deleteRecruitPost(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.body;
            const success = await this.postUseCase.deleteRecruitPost(id);
            if (success) {
                res.status(200).json({ status: 200, result: success, message: "Post deleted successfully" });
            } else {
                res.status(404).json({ status: 404, error: "Post not found" });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getRecruitPostById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const post = await this.postUseCase.getRecruitPostById(id);
            if (post) {
                res.status(200).json({ status: 200, post: post });
            } else {
                res.status(404).json({ status: 404, error: "Post not found" });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getUserRecuritmentPosts(req: Request, res: Response): Promise<void> {
        try {
            const { userId } = req.params;
            const posts = await this.postUseCase.getUserRecuritmentPosts(userId);
            res.status(200).json({ status: 200, posts: posts });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getRecruitPostByTitle(req: Request, res: Response): Promise<void> {
        try {
            const { title } = req.params;
            const post = await this.postUseCase.getRecruitPostByTitle(title);
            if (post) {
                res.status(200).json({ status: 200, post: post });
            } else {
                res.status(404).json({ status: 404, error: "Post not found" });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getRecruitPostPagination(req: Request, res: Response): Promise<void> {
        try {
            const page = parseInt(req.query.page as string) || 1;

            const posts = await this.postUseCase.getRecruitPostPagination(page);
            // console.log(posts);

            res.status(200).json({ status: 200, posts: posts });
            // console.log(posts);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getRecruitPostsByAuthor(req: Request, res: Response): Promise<void> {
        try {
            const { authorId } = req.params;
            const posts = await this.postUseCase.getRecruitPostsByAuthor(authorId);
            res.status(200).json({ status: 200, posts: posts });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Promotion
    async createPromotionPost(req: Request, res: Response): Promise<void> {}

    async updatePromotionPost(req: Request, res: Response): Promise<void> {}

    async deletePromotionPost(req: Request, res: Response): Promise<void> {}

    async getPromotionPostById(req: Request, res: Response): Promise<void> {}

    async getUserPromotionPosts(req: Request, res: Response): Promise<void> {}

    async getPromotionPostByTitle(req: Request, res: Response): Promise<void> {}

    async getPromotionPostPagination(req: Request, res: Response): Promise<void> {}

    async getPromotionPostsByAuthor(req: Request, res: Response): Promise<void> {}

}