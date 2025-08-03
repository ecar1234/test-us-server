import { PostUseCase } from "../../app/PostUseCase";
import { Request, Response } from "express";

export class PostController {
    constructor(private postUseCase: PostUseCase) {}

    async createPost(req: Request, res: Response): Promise<void> {
        try {
            // authorId는 인증된 사용자 세션(예: req.user.id)에서 가져오는 것이 더 좋습니다.
            const { authorId, title, subtitle, platform, contents } = req.body;
            const post = await this.postUseCase.createPost(authorId, title, subtitle, platform, contents);
            res.status(201).json({post : post});
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
   
    async updatePost(req: Request, res: Response): Promise<void> {
        try {
            const { postId, authorId, title, subtitle, platform, contents, status } = req.body;
            const updatedPost = await this.postUseCase.updatePost(postId, authorId, title, subtitle, platform, contents, status);
            if (updatedPost) {
                res.status(200).json({ post: updatedPost, message: "Post updated successfully" });
            } else {
                res.status(404).json({ error: "Post not found" });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async deletePost(req: Request, res: Response): Promise<void> {
        try {
            const { postId } = req.body;
            const success = await this.postUseCase.deletePost(postId);
            if (success) {
                res.status(200).json({ result: success, message: "Post deleted successfully" });
            } else {
                res.status(404).json({ error: "Post not found" });
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
                res.status(200).json({ post: post });
            } else {
                res.status(404).json({ error: "Post not found" });
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
                res.status(200).json({ post: post });
            } else {
                res.status(404).json({ error: "Post not found" });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getAllPosts(req: Request, res: Response): Promise<void> {
        try {
            const posts = await this.postUseCase.getAllPosts();
            res.status(200).json({posts: posts});
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }   

    async getPostsByAuthor(req: Request, res: Response): Promise<void> {
        try {
            const { authorId } = req.params;
            const posts = await this.postUseCase.getPostsByAuthor(authorId);
            res.status(200).json({posts: posts});
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}