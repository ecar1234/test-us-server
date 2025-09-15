import { PostUseCase } from "../../app/PostUseCase";
import { Request, Response } from "express";

export class PostController {
    constructor(private postUseCase: PostUseCase) { }

    async createPost(req: Request, res: Response): Promise<void> {
        try {
            // authorId는 인증된 사용자 세션(예: req.user.id)에서 가져오는 것이 더 좋습니다.
            const { author, title, subtitle, platform, contents, images } = req.body;
            
            const post = await this.postUseCase.createPost(author, title, subtitle, platform, contents, images);
            res.status(200).json({ status: 200, post: post });
        } catch (error) {
            res.status(500).json({ status: 500, error: error.message });
        }
    }

    async updatePost(req: Request, res: Response): Promise<void> {
        try {
            const { id, author, title, subtitle, platform, contents, status } = req.body;
            const updatedPost = await this.postUseCase.updatePost(id, author, title, subtitle, platform, contents, status);
            if (updatedPost) {
                res.status(200).json({ status: 200, post: updatedPost, message: "Post updated successfully" });
            } else {
                res.status(404).json({ status: 404, error: "Post not found" });
            }
        } catch (error) {
            res.status(500).json({ status: 500, error: error.message });
        }
    }

    async deletePost(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.body;
            const success = await this.postUseCase.deletePost(id);
            if (success) {
                res.status(200).json({ status: 200, result: success, message: "Post deleted successfully" });
            } else {
                res.status(404).json({ status: 404, error: "Post not found" });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getPostById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const post = await this.postUseCase.getPostById(id);
            if (post) {
                res.status(200).json({ status: 200, post: post });
            } else {
                res.status(404).json({ status: 404, error: "Post not found" });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getPostByTitle(req: Request, res: Response): Promise<void> {
        try {
            const { title } = req.params;
            const post = await this.postUseCase.getPostByTitle(title);
            if (post) {
                res.status(200).json({ status: 200, post: post });
            } else {
                res.status(404).json({ status: 404, error: "Post not found" });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // async getAllPosts(req: Request, res: Response): Promise<void> {
    //     try {
    //         const posts = await this.postUseCase.getAllPosts();
    //         res.status(200).json({ status: 200, posts: posts });
    //     } catch (error) {
    //         res.status(500).json({ error: error.message });
    //     }
    // }

    async getInitPosts(req: Request, res: Response): Promise<void> {
        try {
            const posts = await this.postUseCase.getInitPosts();

            res.status(200).json({ status: 200, favoritePosts: posts[0], posts: posts[1] });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // async getWebPosts(req: Request, res: Response): Promise<void> {
    //     try {
    //         const page = parseInt(req.query.page as string) || 1;

    //         const webPosts = await this.postUseCase.getWebPostsPaginations(page);
    //         // console.log(webPosts);
    //         res.status(200).json({ status: 200, posts: webPosts });
    //     } catch (error) {
    //         res.status(500).json({ error: error.message });
    //     }
    // }
    // async getMobilePosts(req: Request, res: Response): Promise<void> {
    //     try {
    //         const page = parseInt(req.query.page as string) || 1;

    //         const mobilePosts = await this.postUseCase.getMobilePostsPaginations(page);
    //         // console.log(mobilePosts);

    //         res.status(200).json({ status: 200, posts: mobilePosts });
    //     } catch (error) {
    //         res.status(500).json({ error: error.message });
    //     }
    // }

    async getPostsPaginations(req: Request, res: Response): Promise<void> {
        try {
            const page = parseInt(req.query.page as string) || 1;

            const posts = await this.postUseCase.getPostsPaginations(page);
            // console.log(posts);

            res.status(200).json({ status: 200, posts: posts });
            // console.log(posts);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getPostsByAuthor(req: Request, res: Response): Promise<void> {
        try {
            const { authorId } = req.params;
            const posts = await this.postUseCase.getPostsByAuthor(authorId);
            res.status(200).json({ status: 200, posts: posts });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}