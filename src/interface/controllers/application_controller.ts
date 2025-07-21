import { AppUseCase } from "../../app/app_use_case";
import { Request, Response } from "express";
import { Application } from "../../domain/entities/application";

export class ApplicationController {
    constructor(private appUseCase: AppUseCase) {}

    async findApplicationsByPostId(req: Request, res: Response): Promise<void> {
        const { postId } = req.body;
        const applications: Application[] = await this.appUseCase.findApplicationsByPostId(postId);
        res.status(200).json({applications : applications});
    }
    async findApplicationsByUserId(req: Request, res: Response): Promise<void> {
        const userId: string = req.body.userId;
        const applications: Application[] = await this.appUseCase.findApplicationsByUserId(userId);
        res.status(200).json({applications : applications});
    }
    // 여기서 부터 점검 해야함. get, post 중 선택 필요. Get일 경우 user, post, 수정 필요.
    async countApplicantsByPostId(req: Request, res: Response): Promise<void> {
        const postId = req.params.postId;
        const count = await this.appUseCase.countApplicantsByPostId(postId);
        res.status(200).json({ count });
    }
    async createApplication(req: Request, res: Response): Promise<void> {
        const applicationData = req.body;
        const application = await this.appUseCase.createApplication(applicationData);
        res.status(201).json(application);
    }
    async updateApplication(req: Request, res: Response): Promise<void> {
        const applicationData = req.body;
        const updatedApplication = await this.appUseCase.updateApplication(applicationData);
        res.status(200).json(updatedApplication);
    }
    async deleteApplication(req: Request, res: Response): Promise<void> {
        const applicationId = req.params.id;
        const result = await this.appUseCase.deleteApplication(applicationId);
        res.status(result ? 200 : 404).json({ success: result });
    }
    async acceptUser(req: Request, res: Response): Promise<void> {
        const { userId, postId } = req.body;
        const application = await this.appUseCase.acceptUser(userId, postId);
        res.status(200).json(application);
    }
    async rejectUser(req: Request, res: Response): Promise<void> {
        const { userId, postId } = req.body;
        const application = await this.appUseCase.rejectUser(userId, postId);
        res.status(200).json(application);
    }
    async countApplicationsByPostId(req: Request, res: Response): Promise<void> {
        const postId = req.params.postId;
        const count = await this.appUseCase.countApplicationsByPostId(postId);
        res.status(200).json({ count });
    }
    async findApplicationByPostAndUserAndStatus(req: Request, res: Response): Promise<void> {
        const { postId, userId, status } = req.params;
        const application = await this.appUseCase.findApplicationByPostAndUserAndStatus(postId, userId, status);
        res.status(application ? 200 : 404).json(application);
    }
    async findApplicationsWithPagination(req: Request, res: Response): Promise<void> {
        const postId = req.params.postId;
        const page = parseInt(req.query.page as string, 10) || 1;
        const limit = parseInt(req.query.limit as string, 10) || 10;
        const result = await this.appUseCase.findApplicationsWithPagination(postId, page, limit);
        res.status(200).json(result);
    }
}