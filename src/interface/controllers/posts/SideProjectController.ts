import { Request, Response } from "express";
import { SideProjectUseCase } from "../../../app/posts/SideProjectUseCase.js";
import { SideProjectPostModel } from "../../../domain/entities/SideProject/SideProjectPostModel.js";

export class SideProjectController {
    constructor(
        private sideUseCase: SideProjectUseCase
    ) {}

    /** create, update */
    async upsertSideProjectPost(req: Request, res: Response): Promise<void> {
        const { post } = req.body;
        const result = await this.sideUseCase.upsertSideProjectPost(post);
        res.status(200).json({status: 200, post: result});
        return;
    }

    /** update, end, delete */
    async updateSideProjectPost(req: Request, res: Response): Promise<void>{
        const { postId, state } = req.body;
        const result = await this.sideUseCase.updateSideProjectPost(postId, state);
        res.status(200).json({status: 200, post: result});
        return;
    }

    async getSideProjectPostByPostId(req: Request, res: Response): Promise<void> {
        const { postId } = req.params;
        const result = await this.sideUseCase.getSideProjectPostByPostId(postId);
        res.status(200).json({status: 200, post: result});
        return;
    }

    /** 나의 포스트 목록 가져오기 */
    async getUserSideProjectPost(req: Request, res: Response): Promise<void> {
        const { userId } = req.params;
        const result = await this.sideUseCase.getSideProjectPostsByUserId(userId);
        res.status(200).json({status: 200, posts: result});
        return;
    }

    /** title로 포스트 가져오기 */
    // async getSideProjectPostByTitle(req: Request, res: Response): Promise<void> {
    //     const { title } = req.params;
    //     const result = await this.sideUseCase.getSideProjectPostByTitle(title);
    //     res.status(200).json({status: 200, post: result});
    //     return;
    // }

    /** 포스트 목록 가져오기 */
    async getSideProjectPostPagination(req: Request, res: Response): Promise<void> {

    }

    /** 나의 포스트에 신청한 유저 목록 가져오기 */
    async getSideProjectAppUsers(req: Request, res: Response): Promise<void> {
        const { postId } = req.params;
        const result = await this.sideUseCase.getSideProjectAppUsers(postId);
        res.status(200).json({status: 200, applicantsInfo: result});
        return;
    }
    
    /** 내가 신청한 포스트 목록 가져오기 */
    // async getUserApplicationSideProjectPosts(req: Request, res: Response): Promise<void> {
    //     const { userId } = req.params;
    //     const result = await this.sideUseCase.getUserApplicationSideProjectPosts(userId);
    //     res.status(200).json({status: 200, posts: result});
    //     return;
    // }
}