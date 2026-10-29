
import { Response, Request } from "express";
import { PromotionPostUseCase } from "../../../app/posts/PromotionPostUseCase.js";



export class PromotionPostController {
    constructor(private promotionUseCase: PromotionPostUseCase) { }

    // async getPostById(req: Request, res: Response): Promise<void> {
    //     try {
    //         const postId = req.params.id;
    //         const post = await this.useCase.getPostById(postId);
    //         if (post) {
    //             res.status(200).json({status: 200,post: post});
    //         } else {
    //             res.status(404).json({ error: 'Post not found' });
    //         }
    //     } catch (error) {
    //         res.status(500).json({ error: error.message });
    //     }
    
    // }

     async createPromotionPost(req: Request, res: Response): Promise<void> {
        try {
            const { title, subtitle, platform, mobileOs, category, contents, author, domain } = JSON.parse(req.body.post);

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
            const post = await this.promotionUseCase.createPromotionPost(author, title, subtitle, platform, mobileOs, category, contents, images, domain);
            res.status(200).json({ status: 200, post: post });
        } catch (error) {
            res.status(500).json({ status: 500, error: error.message });
        }
    }

    async updatePromotionPost(req: Request, res: Response): Promise<void> {
        try {
            // 업데이트 시에도 클라이언트가 'post' 필드에 모든 데이터를 JSON 문자열로 보내므로, req.body.post를 파싱합니다.
            const { author, id, title, subtitle, platform, mobileOs, category, contents, domain, status } = JSON.parse(req.body.post);
            const deleteImages = req.body.deleteImages ? JSON.parse(req.body.deleteImages) : [];

            const newImageFiles = (req.files as Express.Multer.File[] || []).map(file => ({
                filename: file.filename,
                originalname: file.originalname,
                mimetype: file.mimetype,
                size: file.size,
                url: `${req.protocol}://${req.get('host')}/posts/${file.filename}`,
            }));

            const updatedPost = await this.promotionUseCase.updatePromotionPost(id, author, title, subtitle, platform, mobileOs, category, contents, domain, status, deleteImages, newImageFiles);
            res.status(200).json({ status: 200, post: updatedPost });
        } catch (error) {
            res.status(500).json({ status: 500, error: error.message });
        }
    }

    async deletePromotionPost(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.body;
            const success = await this.promotionUseCase.deletePromotionPost(id);
            if (success) {
                res.status(200).json({ status: 200, result: success, message: "Post deleted successfully" });
            } else {
                res.status(404).json({ status: 404, error: "Post not found" });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getPromotionPostById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const post = await this.promotionUseCase.getPromotionPostById(id);
            if (!post) {
                res.status(404).json({ status: 404, error: "Post not found" });
                return;
            }
            res.status(200).json({ status: 200, post: post });

        } catch (error) {
            res.status(500).json({ error: error.message });
        }

    }

    async getUserPromotionPosts(req: Request, res: Response): Promise<void> {
        try {
            const { userId } = req.params;
            const posts = await this.promotionUseCase.getUserPromotionPosts(userId);
            if (!posts) {
                res.status(404).json({ status: 404, error: "Post not found" });
                return;
            }
            res.status(200).json({ status: 200, posts: posts });

        } catch (error) {
            res.status(500).json({ error: error.message });
        }

    }

    async getPromotionPostByTitle(req: Request, res: Response): Promise<void> { }

    async getPromotionPostPagination(req: Request, res: Response): Promise<void> {
        try {
            const { page, size } = req.body;
            const result = await this.promotionUseCase.getPromotionPostPagination(parseInt(page as string), parseInt(size as string));
            res.status(200).json({ status: 200, posts: result[0], page: result[1], isLast: result[2] });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }

    }

    async getPromotionPostsByAuthor(req: Request, res: Response): Promise<void> { }


}