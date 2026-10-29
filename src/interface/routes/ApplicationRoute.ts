
import { Router } from "express";
import { AppUseCase } from "../../app/AppUseCase.js";
import { ApplicationRepositoryImpl } from "../../infrastructure/repositories/ApplicationRepositoryImpl.js";
import { ApplicationController } from "../controllers/ApplicationController.js";
import { RecruitmentPostRepositoryImpl } from "../../infrastructure/repositories/RecruitmentPostRepositoryImpl.js";
import { authMiddleware } from "../middlewares/AuthMiddleware.js";
import { FirebaseRepositoryImpl } from "../../infrastructure/repositories/FirebaseRepositoryImpl.js";
import { UserRepositoryImpl } from "../../infrastructure/repositories/UserRepositoryImpl.js";
import { UserReviewRepositoryImpl } from "../../infrastructure/repositories/UserReviewRepositoryImpl.js";
import { SideProjectPostRepositoryImpl } from "../../infrastructure/repositories/SideProjectPostRepositoryImpl.js";
import { ProjectRoleRepositoryImpl } from "../../infrastructure/repositories/ProjectRoleRepositoryImpl.js";

const router = Router();

const applicationUseCase = new AppUseCase(
    new ApplicationRepositoryImpl(),
    new RecruitmentPostRepositoryImpl(),
    new SideProjectPostRepositoryImpl(),
    new ProjectRoleRepositoryImpl(),
    new FirebaseRepositoryImpl(),
    new UserRepositoryImpl(),
    new UserReviewRepositoryImpl());
    
const applicationController = new ApplicationController(applicationUseCase);

// router.get("/findByPostId/:postId", applicationController.findApplicationsByPostId.bind(applicationController)); post에서 appilcations 가져오기
router.get("/findByUserId/:userId", authMiddleware, applicationController.findApplicationsByUserId.bind(applicationController)); // user에서 applications 가져오기
// router.get("/findByUserNickname/:nickname", applicationController.findByUserNickname.bind(applicationController)); user에서 가져오기
// router.get("/findPostListByUserId/:userId", applicationController.findPostListByUserId.bind(applicationController)); user 에서 가져오기
// router.get("/getAppUserListInPost/:postId", applicationController.countApplicantsByPostId.bind(applicationController)); post에서 가져오기
router.post("/apply/recruit", authMiddleware, applicationController.createAppRecruitPost.bind(applicationController));
router.post("/apply/side", authMiddleware, applicationController.createAppSidePost.bind(applicationController));
router.put("/update", authMiddleware, applicationController.updateApplication.bind(applicationController));
router.put("/cancelRecruitApp", authMiddleware, applicationController.cancelRecruitApp.bind(applicationController));
router.put("/cancelSideApp", authMiddleware, applicationController.cancelSideApp.bind(applicationController));
router.put("/acceptUser", authMiddleware, applicationController.acceptUser.bind(applicationController));
router.put("/rejectUser", authMiddleware, applicationController.rejectUser.bind(applicationController));
router.post("/getTesterReviewsByAppIds", authMiddleware, applicationController.getTesterReviews.bind(applicationController))

// router.post('/getRecruitApplications', authMiddleware, applicationController.getRecruitApplications.bind(applicationController));
// router.post("/getAppPostList/:postId", applicationController.countApplicationsByPostId.bind(applicationController)); user에서 가져오기
// router.post("/applications/status/:postId/:userId/:status", applicationController.findApplicationByPostAndUserAndStatus.bind(applicationController));
// router.post("/applications/pagination/:postId", applicationController.findApplicationsWithPagination.bind(applicationController));


export default router;