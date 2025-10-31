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

    async getInitUserPosts(req: Request, res: Response): Promise<void> {
        try {
            const job = await getInitPostsQueue.add('getInitUserPosts', { userId: req.params.userId });
            res.status(202).json({ status: 202, state: 'pending', jobId: job.id });
            return;
        }catch (error) {
            res.status(501).json({ error: error.message });
        }
    }

    // Recruitment
    async createRecruitPost(req: Request, res: Response): Promise<void> {
        try {
            // 클라이언트가 'post' 필드에 모든 데이터를 JSON 문자열로 보내므로, req.body.post를 파싱합니다.
            // req.body.post는 이미 객체이므로 JSON.parse를 제거합니다.

            const { author, title, subtitle, platform, contents } = JSON.parse(req.body.post);

            const files = req.files as Express.Multer.File[];
            const images = files.map((file: Express.Multer.File) =>
            ({
                filename: file.filename,
                originalname: file.originalname,
                mimetype: file.mimetype,
                size: file.size,
                url: `${req.protocol}://${req.get('host')}/uploads/${file.filename}`,
            })
            );
            if (!author) {
                console.log(author);
                res.status(400).json({ status: 400, message: 'Author information is missing.' });
                return;
            }

            const newPost = await this.postUseCase.createRecruitPost(author, title, subtitle, platform, contents, images);
            res.status(200).json({ status: 200, post: newPost });
        } catch (error) {
            res.status(500).json({ status: 500, error: error.message });
        }
    }

    async updateRecruitPost(req: Request, res: Response): Promise<void> {
        try {
            const { author, id, title, subtitle, platform, contents, status } = JSON.parse(req.body.post);;
            const deleteImages = JSON.parse(req.body.deleteImages);


            // deleteImagesJson은 post 객체 안에 문자열화 되어 있을 수 있습니다.
            if (deleteImages === null || deleteImages === undefined) { // deleteImagesJson이 단일 값일 경우를 대비
                res.status(400).json({ status: 400, message: 'Invalid format for deleteImages.' });
                return;
            }

            const newImageFiles = (req.files as Express.Multer.File[] || []).map(file => ({
                filename: file.filename,
                originalname: file.originalname,
                mimetype: file.mimetype,
                size: file.size,
                url: `${req.protocol}://${req.get('host')}/uploads/${file.filename}`,
            }));

            const updatedPost = await this.postUseCase.updateRecruitPost(id, author, title, subtitle, platform, contents, status, deleteImages, newImageFiles);
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
            const {page, size} = req.body;

            if (!page || !size) {
                res.status(400).json({ status: 400, message: 'page and size are required.' });
                return;
            }

            const posts = await this.postUseCase.getRecruitPostPagination(parseInt(page as string), parseInt(size as string));
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
    async createPromotionPost(req: Request, res: Response): Promise<void> {
        try {
            const { title, subtitle, platform, contents, author, domain } = JSON.parse(req.body.post);

            const files = req.files as Express.Multer.File[];
            const images = files.map((file: Express.Multer.File) =>
            ({
                filename: file.filename,
                originalname: file.originalname,
                mimetype: file.mimetype,
                size: file.size,
                url: `${req.protocol}://${req.get('host')}/uploads/${file.filename}`,
            })
            );
            const post = await this.postUseCase.createPromotionPost(author, title, subtitle, platform, contents, images, domain);
            res.status(200).json({ status: 200, post: post });
        } catch (error) {
            res.status(500).json({ status: 500, error: error.message });
        }
    }

    async updatePromotionPost(req: Request, res: Response): Promise<void> {
        try {
            // 업데이트 시에도 클라이언트가 'post' 필드에 모든 데이터를 JSON 문자열로 보내므로, req.body.post를 파싱합니다.
            const postData = req.body.post;
            const { author, id, title, subtitle, platform, contents, domain, status, deleteImages: deleteImagesJson } = postData;

            let deleteImages = [];
            if (deleteImagesJson && typeof deleteImagesJson === 'string') {
                try {
                    deleteImages = JSON.parse(deleteImagesJson);
                } catch (e) {
                    res.status(400).json({ status: 400, message: 'Invalid format for deleteImages.' });
                    return;
                }
            }
            const newImageFiles = (req.files as Express.Multer.File[] || []).map(file => ({
                filename: file.filename,
                originalname: file.originalname,
                mimetype: file.mimetype,
                size: file.size,
                url: `${req.protocol}://${req.get('host')}/uploads/${file.filename}`,
            }));
            const updatedPost = await this.postUseCase.updatePromotionPost(id, author, title, subtitle, platform, contents, domain, status, deleteImages, newImageFiles);
            res.status(200).json({ status: 200, post: updatedPost });
        } catch (error) {
            res.status(500).json({ status: 500, error: error.message });
        }
    }

    async deletePromotionPost(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.body;
            const success = await this.postUseCase.deletePromotionPost(id);
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
            const post = await this.postUseCase.getPromotionPostById(id);
            if(!post) {
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
            const posts = await this.postUseCase.getUserPromotionPosts(userId);
            if(!posts) {
                res.status(404).json({ status: 404, error: "Post not found" });
                return;
            }
            res.status(200).json({ status: 200, posts: posts });

        } catch (error) {
            res.status(500).json({ error: error.message });
        }

     }

    async getPromotionPostByTitle(req: Request, res: Response): Promise<void> { }

    async getPromotionPostPagination(req: Request, res: Response): Promise<void> { }

    async getPromotionPostsByAuthor(req: Request, res: Response): Promise<void> { }

}