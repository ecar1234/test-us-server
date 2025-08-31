import { AppUseCase } from "../../app/AppUseCase";
import { Request, Response } from "express";
import { ApplicationModel } from "../../domain/entities/ApplicationModel";

export class ApplicationController {
    constructor(private appUseCase: AppUseCase) { }

    async createApplication(req: Request, res: Response): Promise<void> {
        try {
            const { userId, postId, platfrom } = req.body;

            const application = await this.appUseCase.createApplication(userId, postId, platfrom);
            res.status(200).json({ status: 200, application: application });
        } catch (error) {
            res.status(500).json({ status: 500, error: error.message });

        }
    }
    async updateApplication(req: Request, res: Response): Promise<void> {
        try {
            const { userId, postId, platform, status } = req.body;

            const updatedApplication = await this.appUseCase.updateApplication(postId, userId, platform, status);
            res.status(200).json({ stuatus: 200, updatedApplication: updatedApplication });
        } catch (error) {
            res.status(500).json({ status: 500, error: error.message })
        }
    }
    async deleteApplication(req: Request, res: Response): Promise<void> {
        try {
            const applicationId = req.params.id;
            const result = await this.appUseCase.deleteApplication(applicationId);
            if (result) {
                res.status(200).json({ stauts: 200, success: result });
            } else {
                res.status(404).json({ status: 404, error: "Application not found" });
            }
        } catch (error) {
            res.status(500).json({ status: 500, error: error.message });
        }
    }
    async acceptUser(req: Request, res: Response): Promise<void> {
        try {
            const { userId, postId } = req.body;
            const application = await this.appUseCase.acceptUser(userId, postId);
            res.status(200).json({ status: 200, application: application });
        } catch (error) {
            res.status(500).json({ status: 500, error: error.message });
        }
    }
    async rejectUser(req: Request, res: Response): Promise<void> {
        try {
            const { userId, postId } = req.body;
            const application = await this.appUseCase.rejectUser(userId, postId);
            res.status(200).json({ status: 200, application: application });
        } catch (error) {
            res.status(500).json({ status: 500, error: error.message });
        }
    }
}