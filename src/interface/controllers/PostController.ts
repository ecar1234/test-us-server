import { PostUseCase } from "../../app/PostUseCase";
import { Request, Response } from "express";

export class PostController {
    constructor(private postUseCase: PostUseCase) {}

    async createPost(req: Request, res: Response): Promise<void> {
        try {
            const { title, subtitle, content } = req.body;
            const post = await this.postUseCase.createPost(title, subtitle, content);
            res.status(201).json(post);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
   
    async updatePost(req: Request, res: Response): Promise<void> {
        try {
            const { id, authorId, title, subtitle, content, status } = req.body;
            const [updatedPost, message] = await this.postUseCase.updatePost(id, authorId, title, subtitle, content, status);
            if (updatedPost) {
                res.status(200).json({ post: updatedPost, message });
            } else {
                res.status(404).json({ error: message });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async deletePost(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.body;
            const success = await this.postUseCase.deletePost(id);
            if (success) {
                res.status(200).json({ message: "Post deleted successfully" });
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
            const [post, message] = await this.postUseCase.getPostById(id);
            if (post) {
                res.status(200).json({ post, message });
            } else {
                res.status(404).json({ error: message });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getPostByTitle(req: Request, res: Response): Promise<void> {
        try {
            const { title } = req.params;
            const [post, message] = await this.postUseCase.getPostByTitle(title);
            if (post) {
                res.status(200).json({ post, message });
            } else {
                res.status(404).json({ error: message });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getAllPosts(req: Request, res: Response): Promise<void> {
        try {
            const posts = await this.postUseCase.getAllPosts();
            res.status(200).json(posts);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }   

    async getPostsByAuthor(req: Request, res: Response): Promise<void> {
        try {
            const { authorId } = req.params;
            const posts = await this.postUseCase.getPostsByAuthor(authorId);
            res.status(200).json(posts);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}