import { RecruitmentPostUseCase } from "../../../app/posts/RecruitmentPostUseCase.js";
import { Request, Response } from "express";


export class RecruitmentPostController {
    // PostUseCase를 주입받도록 수정
    constructor(
    
        private recruitUseCase: RecruitmentPostUseCase
    ) { }

    async createRecruitPost(req: Request, res: Response): Promise<void> {
        try {
            const { author, title, subtitle, platform, mobileOs, category, contents } = JSON.parse(req.body.post);

            const files = req.files as Express.Multer.File[];
            const images = files.map((file: Express.Multer.File) =>
            ({
                filename: file.filename,
                originalname: file.originalname,
                mimetype: file.mimetype,
                size: file.size,
                url: `${req.protocol}://${req.get('host')}/posts/${file.filename}`,
            })
            );
            if (!author) {
                // console.log(author);
                res.status(400).json({ status: 400, message: 'Author information is missing.' });
                return;
            }
            // console.log("post controller", images);

            const newPost = await this.recruitUseCase.createRecruitPost(author, title, subtitle, platform, mobileOs, category, contents, images);
            res.status(200).json({ status: 200, post: newPost });
        } catch (error) {
            res.status(500).json({ status: 500, error: error.message });
        }
    }

    async updateRecruitPost(req: Request, res: Response): Promise<void> {
        try {
            const { author, id, title, subtitle, platform, mobileOs, category, contents, status } = JSON.parse(req.body.post);;
            const deleteImages = req.body.deleteImages ? JSON.parse(req.body.deleteImages) : []; // deleteImages가 없으면 빈 배열로 초기화

            const newImageFiles = (req.files as Express.Multer.File[] || []).map(file => ({
                filename: file.filename,
                originalname: file.originalname,
                mimetype: file.mimetype,
                size: file.size,
                url: `${req.protocol}://${req.get('host')}/posts/${file.filename}`,
            }));

            const updatedPost = await this.recruitUseCase.updateRecruitPost(id, author, title, subtitle, platform, mobileOs, category, contents, status, deleteImages, newImageFiles);
            if (updatedPost) {
                res.status(200).json({ status: 200, post: updatedPost, message: "Post updated successfully" });
            } else {
                res.status(404).json({ status: 404, error: "Post not found" });
            }
        } catch (error) {
            res.status(500).json({ status: 500, error: error.message });
        }
    }

    async endRecruitPost(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.body;
            const updatedPost = await this.recruitUseCase.endRecruitPost(id);
            // console.log("updatedPost : ", updatedPost);
            res.status(200).json({ status: 200, post: updatedPost });
        } catch (error) {
            res.status(500).json({ status: 500, error: error.message });
        }
    }

    async deleteRecruitPost(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.body;
            const success = await this.recruitUseCase.deleteRecruitPost(id);
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
            const post = await this.recruitUseCase.getRecruitPostById(id);
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
            const posts = await this.recruitUseCase.getUserRecuritmentPosts(userId);
            res.status(200).json({ status: 200, posts: posts });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getRecruitPostByTitle(req: Request, res: Response): Promise<void> {
        try {
            const { title } = req.params;
            const post = await this.recruitUseCase.getRecruitPostByTitle(title);
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
            const { page, size } = req.body;

            if (!page || !size) {
                res.status(400).json({ status: 400, message: 'page and size are required.' });
                return;
            }

            const result = await this.recruitUseCase.getRecruitPostPagination(parseInt(page as string), parseInt(size as string));
            // console.log(posts);

            res.status(200).json({ status: 200, posts: result[0], page: result[1], isLast: result[2] });
            // console.log(posts);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getRecruitPostsByAuthor(req: Request, res: Response): Promise<void> {
        try {
            const { authorId } = req.params;
            const posts = await this.recruitUseCase.getRecruitPostsByAuthor(authorId);
            res.status(200).json({ status: 200, posts: posts });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getAppRecruitPosts(req: Request, res: Response): Promise<void> {
        try {
            const { ids } = req.body;
            const posts = await this.recruitUseCase.getAppRecruitPosts(ids);
            res.status(200).json({ status: 200, posts: posts });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }

    }

    async getRecruitApplicationsByPostId(req: Request, res: Response): Promise<void> {
        try {
            const { postId } = req.body;
            const applications = await this.recruitUseCase.getRecruitApplicationsByPostId(postId);
            res.status(200).json({ status: 200, applications: applications });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }

    }
}