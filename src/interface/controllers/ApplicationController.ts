import { AppUseCase } from "../../app/AppUseCase";
import { Request, Response } from "express";
import { ApplicationModel } from "../../domain/entities/ApplicationModel";

export class ApplicationController {
    constructor(private appUseCase: AppUseCase) { }

    async createApplication(req: Request, res: Response): Promise<void> {
        const { userId, postId, platfrom } = req.body;

        const application = await this.appUseCase.createApplication(userId, postId, platfrom);
        res.status(201).json(application);
    }
    async updateApplication(req: Request, res: Response): Promise<void> {
        const { userId, postId, platform, status } = req.body;
    
        const updatedApplication = await this.appUseCase.updateApplication(postId, userId, platform, status);
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
}