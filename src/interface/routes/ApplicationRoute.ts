
import { Router } from "express";
import { AppUseCase } from "../../app/AppUseCase";
import { ApplicationRepositoryImpl } from "../../infrastructure/repositories/ApplicationRepositoryImpl";
import { ApplicationController } from "../controllers/ApplicationController";
import { RecruitmentPostRepositoryImpl } from "../../infrastructure/repositories/RecruitmentPostRepositoryImpl";
import { authMiddleware } from "../middlewares/AuthMiddleware";
import { FirebaseRepositoryImpl } from "../../infrastructure/repositories/FirebaseRepositoryImpl";
import { UserRepositoryImpl } from "../../infrastructure/repositories/UserRepositoryImpl";
import { UserReviewRepositoryImpl } from "../../infrastructure/repositories/UserReviewRepositoryImpl";

const router = Router();

const applicationUseCase = new AppUseCase(
    new ApplicationRepositoryImpl(),
    new RecruitmentPostRepositoryImpl(),
    new FirebaseRepositoryImpl(),
    new UserRepositoryImpl(),
    new UserReviewRepositoryImpl());
    
const applicationController = new ApplicationController(applicationUseCase);

// router.get("/findByPostId/:postId", applicationController.findApplicationsByPostId.bind(applicationController)); post에서 appilcations 가져오기
router.get("/findByUserId/:userId", authMiddleware, applicationController.findApplicationsByUserId.bind(applicationController)); // user에서 applications 가져오기
// router.get("/findByUserNickname/:nickname", applicationController.findByUserNickname.bind(applicationController)); user에서 가져오기
// router.get("/findPostListByUserId/:userId", applicationController.findPostListByUserId.bind(applicationController)); user 에서 가져오기
// router.get("/getAppUserListInPost/:postId", applicationController.countApplicantsByPostId.bind(applicationController)); post에서 가져오기
router.post("/apply", authMiddleware, applicationController.createApplication.bind(applicationController));
router.put("/update", authMiddleware, applicationController.updateApplication.bind(applicationController));
router.put("/cancelAppUser", authMiddleware, applicationController.cancelApplication.bind(applicationController));
router.put("/acceptUser", authMiddleware, applicationController.acceptUser.bind(applicationController));
router.put("/rejectUser", authMiddleware, applicationController.rejectUser.bind(applicationController));
router.post("/getTesterReviewsByAppIds", authMiddleware, applicationController.getTesterReviews.bind(applicationController))

// router.post('/getRecruitApplications', authMiddleware, applicationController.getRecruitApplications.bind(applicationController));
// router.post("/getAppPostList/:postId", applicationController.countApplicationsByPostId.bind(applicationController)); user에서 가져오기
// router.post("/applications/status/:postId/:userId/:status", applicationController.findApplicationByPostAndUserAndStatus.bind(applicationController));
// router.post("/applications/pagination/:postId", applicationController.findApplicationsWithPagination.bind(applicationController));


export default router;