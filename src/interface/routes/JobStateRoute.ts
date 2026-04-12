import { Router } from "express";
import { authMiddleware } from "../middlewares/AuthMiddleware.js";
import { JobController } from "../controllers/JobController.js";


const route = Router();
const jobController = new JobController();

route.get('/jobApplicationsById/:jobId', authMiddleware, jobController.getApplicationsById.bind(jobController));
route.get('/jobInitPosts/:jobId', jobController.getInitPosts.bind(jobController));
route.get('/jobInitUserPosts/:jobId', jobController.getInitUserPosts.bind(jobController));

export default route;