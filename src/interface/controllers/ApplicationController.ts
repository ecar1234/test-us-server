import { AppUseCase } from "../../app/AppUseCase";
import { Request, Response } from "express";
import { ApplicationModel } from "../../domain/entities/ApplicationModel";
import { RecruitmentPostModel } from "../../domain/entities/RecruitmentPostModel";
import { getApplicationsByIdQueue } from "../../config/RedisConfig";

export class ApplicationController {
    constructor(private appUseCase: AppUseCase) { }

    async createApplication(req: Request, res: Response): Promise<void> {
        try {
            const { applicantId, postId, platfrom, mobileOs } = req.body;

            const result: ApplicationModel = await this.appUseCase.createApplication(applicantId, postId, platfrom, mobileOs);
            res.status(200).json({ status: 200, application: result});
        } catch (error) {
            res.status(500).json({ status: 500, error: error.message });

        }
    }
    async updateApplication(req: Request, res: Response): Promise<void> {
        try {
            const {id ,applicantId, postId, platform, mobileOs, status } = req.body;

            const result: ApplicationModel = await this.appUseCase.updateApplication(id, postId, applicantId, platform, mobileOs, status);
            console.log(result);
            res.status(200).json({ status: 200, application: result });
        } catch (error) {
            res.status(500).json({ status: 500, error: error.message })
        }
    }
    async cancelApplication(req: Request, res: Response): Promise<void> {
        try {
            const applicationId = req.body.applicationId;
            const result = await this.appUseCase.cancelApplication(applicationId);
            if (result) {
                res.status(200).json({ status: 200, application: result });
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
            const data = await this.appUseCase.acceptUser(userId, postId);

            res.status(200).json({ status: 200, application: data });
        } catch (error) {
            res.status(500).json({ status: 500, error: error.message });
        }
    }
    async rejectUser(req: Request, res: Response): Promise<void> {
        try {
            const { userId, postId } = req.body;
            const data = await this.appUseCase.rejectUser(userId, postId);
            res.status(200).json({ status: 200, application: data });
        } catch (error) {
            res.status(500).json({ status: 500, error: error.message });
        }
    }
    async findApplicationsByUserId(req: Request, res: Response): Promise<void> {
        try {
            
            const job = await getApplicationsByIdQueue.add('getApplicationsByIdQueue', { userId: req.params.userId });
            
            res.status(202).json({ status: 202, state: 'pending', jobId: job.id});

            // const { userId } = req.params;
            // // console.log(userId);
            // const applications = await this.appUseCase.findApplicationsByUserId(userId);
            // // console.log(applications);
            // res.status(200).json({ status: 200, applications: applications });
        } catch (error) {

        }
    }

    async getRecruitApplications(req: Request, res: Response): Promise<void> {
        try {
            const { applicationIds } = req.body;
            const applications = await this.appUseCase.getRecruitApplications(applicationIds);
            if(applications.length === 0){
                res.status(200).json({ status: 200, applications: [] });
                return;
            }
            res.status(200).json({ status: 200, applications: applications });
        } catch (error) {
            res.status(500).json({ status: 500, error: error.message });
        }
    
    }
}