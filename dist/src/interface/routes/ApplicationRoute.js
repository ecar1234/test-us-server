"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AppUseCase_1 = require("../../app/AppUseCase");
const ApplicationRepositoryImpl_1 = require("../../infrastructure/repositories/ApplicationRepositoryImpl");
const ApplicationController_1 = require("../controllers/ApplicationController");
const router = (0, express_1.Router)();
const applicationUseCase = new AppUseCase_1.AppUseCase(new ApplicationRepositoryImpl_1.ApplicationRepositoryImpl());
const applicationController = new ApplicationController_1.ApplicationController(applicationUseCase);
// router.get("/findByPostId/:postId", applicationController.findApplicationsByPostId.bind(applicationController)); post에서 appilcations 가져오기
// router.get("/findByUserId/:userId", applicationController.findApplicationsByUserId.bind(applicationController)); user에서 applications 가져오기
// router.get("/findByUserNickname/:nickname", applicationController.findByUserNickname.bind(applicationController)); user에서 가져오기
// router.get("/findPostListByUserId/:userId", applicationController.findPostListByUserId.bind(applicationController)); user 에서 가져오기
// router.get("/getAppUserListInPost/:postId", applicationController.countApplicantsByPostId.bind(applicationController)); post에서 가져오기
router.post("/apply", applicationController.createApplication.bind(applicationController));
router.put("/update", applicationController.updateApplication.bind(applicationController));
router.put("/cancelAppUser", applicationController.deleteApplication.bind(applicationController));
router.put("/acceptUser", applicationController.acceptUser.bind(applicationController));
router.put("/rejectUser", applicationController.rejectUser.bind(applicationController));
// router.post("/getAppPostList/:postId", applicationController.countApplicationsByPostId.bind(applicationController)); user에서 가져오기
// router.post("/applications/status/:postId/:userId/:status", applicationController.findApplicationByPostAndUserAndStatus.bind(applicationController));
// router.post("/applications/pagination/:postId", applicationController.findApplicationsWithPagination.bind(applicationController));
exports.default = router;
