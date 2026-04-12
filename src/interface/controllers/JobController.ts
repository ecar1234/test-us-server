import { Application, application, Request, Response } from "express";
import { getInitPostsQueue, getApplicationsByIdQueue } from "../../config/RedisConfig.js";


export class JobController {
    constructor() { }

    async getApplicationsById(req: Request, res: Response): Promise<void> {
        try {
            const { jobId } = req.params;
            const job = await getApplicationsByIdQueue.getJob(jobId);
            if (!job) {
                res.status(404).json({ status: 404, error: 'Job not found' });
                return;
            }
            if (await job.isCompleted()) {
                const result = await job.returnvalue;
                if (result && result['state'] === 'success') {
                    res.status(200).json({ status: 200, applications: result['applications'] });
                    return;
                } else {
                    res.status(200).json({ status: 200, state: 'failed', applications: [] });
                    return;
                }
            } else if (await job.isFailed()) {
                res.status(500).json({
                    status: 'failed',
                    message: '작업이 실패했습니다.',
                });
                return;
            } else {
                res.status(202).json({
                    status: 202,
                    state: 'pending',
                    message: '작업이 아직 처리 중입니다.',
                });
                return;
            }
        } catch (error) {
            res.status(500).json({ status: 500, error: error.message });
        }
    }
    async getInitPosts(req: Request, res: Response): Promise<void> {
        try {
            const { jobId } = req.params;
            const job = await getInitPostsQueue.getJob(jobId);
            if (!job) {
                res.status(404).json({ status: 404, error: 'Job not found' });
                return;
            }
            if (await job.isCompleted()) {
                console.log(job.id, await job.getState());
                // console.log(job.id, await job.returnvalue);

                const result = await job.returnvalue;
                if (result && result['state'] === 'success') {
                    res.status(200).json({ status: 200, favoritePosts: result['favorite'], recruitPosts: result['recruit'], promotionPosts: result['promotion'] });
                    return;
                } else {
                    // 작업은 완료되었지만, 내부 로직에서 실패한 경우
                    res.status(200).json({ status: 200, state: 'failed', favoritePosts: [], posts: [] });
                    return;
                }

            } else if (await job.isFailed()) {
                console.log(await job.getState());
                console.log(await job.failedReason);
                res.status(500).json({
                    status: 500,
                    state: 'failed',
                    message: '작업이 실패했습니다.',
                });
                return;
            } else {
                console.log(await job.getState());
                res.status(202).json({
                    status: 202,
                    state: 'pending',
                    message: '작업이 아직 처리 중입니다.',
                });
                return;
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ status: 500, error: error.message });
        }
    }
    async getInitUserPosts(req: Request, res: Response): Promise<Response> {
        try {
            const { jobId } = req.params;
            const job = await getInitPostsQueue.getJob(jobId);
            if (!job) {
                return res.status(404).json({ status: 404, message: 'Posts not found' });
            }

            if (await job.isCompleted()) {
                const result = await job.returnvalue;
                if (result && result['state'] === 'success') {
                    return res.status(200).json({ status: 200, recruitPosts: result['recruit'], promotionPosts: result['promotion'] });
                } else {
                    // 작업은 완료되었지만, 내부 로직에서 실패한 경우
                    return res.status(200).json({ status: 200, state: 'failed', recruitPosts: [], promotionPosts: [] });
                }
            } else if (await job.isFailed()) {
                return res.status(500).json({
                    status: 500,
                    state: 'failed',
                    message: '작업이 실패했습니다.',
                });
            } else {
                return res.status(202).json({
                    status: 202,
                    state: 'pending',
                    message: '작업이 아직 처리 중입니다.',
                });
            }
        } catch (error){
            res.status(500).json({ status: 500, error: error.message });
        }
    }
}