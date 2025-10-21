
import { Response, Request } from "express";
import { PromotionPostUseCase } from "../../app/PromotionPostUseCase";

export class PromotionPostController {
    constructor(private useCase: PromotionPostUseCase) { }

    async getPostById(req: Request, res: Response): Promise<void> {
        try {
            const postId = req.params.id;
            const post = await this.useCase.getPostById(postId);
            if (post) {
                res.status(200).json({status: 200,post: post});
            } else {
                res.status(404).json({ error: 'Post not found' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    
    }

}