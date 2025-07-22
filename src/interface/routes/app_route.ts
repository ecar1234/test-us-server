
import { Router } from "express";
import { AppUseCase } from "../../app/app_use_case";
import { ApplicationRepo } from "../../infrastructure/repositories/application_repo";
import { ApplicationController } from "../controllers/application_controller";
import app from "../..";

const router = Router();

const applicationUseCase = new AppUseCase(new ApplicationRepo());
const applicationController = new ApplicationController(applicationUseCase);

router.get("/findByPostId/:postId", applicationController.findApplicationsByPostId.bind(applicationController));
router.get("/findByUserId/:userId", applicationController.findApplicationsByUserId.bind(applicationController));
router.get("/findByUserNickname/:nickname", applicationController.findByUserNickname.bind(applicationController));
router.get("/findPostListByUserId/:userId", applicationController.findPostListByUserId.bind(applicationController));
router.get("/getAppUserListInPost/:postId", applicationController.countApplicantsByPostId.bind(applicationController));
router.post("/applications", applicationController.createApplication.bind(applicationController));
router.put("/updateAppUserById", applicationController.updateApplication.bind(applicationController));
router.delete("/deleteAppUser/:id", applicationController.deleteApplication.bind(applicationController));
router.post("/acceptUser", applicationController.acceptUser.bind(applicationController));
router.post("/rejectUser", applicationController.rejectUser.bind(applicationController));
router.post("/getAppPostList/:postId", applicationController.countApplicationsByPostId.bind(applicationController));
router.post("/applications/status/:postId/:userId/:status", applicationController.findApplicationByPostAndUserAndStatus.bind(applicationController));
router.post("/applications/pagination/:postId", applicationController.findApplicationsWithPagination.bind(applicationController));


export default router;