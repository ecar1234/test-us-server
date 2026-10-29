import { Router } from "express";
import { SideProjectUseCase } from "../../../app/posts/SideProjectUseCase.js";
import { SideProjectController } from "../../controllers/posts/SideProjectController.js";
import { SideProjectPostRepositoryImpl } from "../../../infrastructure/repositories/SideProjectPostRepositoryImpl.js";
import { authMiddleware } from "../../middlewares/AuthMiddleware.js";
import { UserRepositoryImpl } from "../../../infrastructure/repositories/UserRepositoryImpl.js";
import { ApplicationRepositoryImpl } from "../../../infrastructure/repositories/ApplicationRepositoryImpl.js";


const route = Router();

const sideProjectUseCase = new SideProjectUseCase(
    new SideProjectPostRepositoryImpl(),
    new UserRepositoryImpl(),
    new ApplicationRepositoryImpl()
);
const sideProjectController = new SideProjectController(sideProjectUseCase);

route.post('/upsertSideProjectPost', authMiddleware, sideProjectController.upsertSideProjectPost.bind(sideProjectController));
route.put('/updateSideProjectPost', authMiddleware, sideProjectController.updateSideProjectPost.bind(sideProjectController));
route.get('/getSideProjectPostById/:id', sideProjectController.getSideProjectPostByPostId.bind(sideProjectController));
route.get('/getUserSideProjectPosts/:userId', sideProjectController.getUserSideProjectPost.bind(sideProjectController));
// route.get('/getSideProjectPostByTitle/:title', sideProjectController.getSideProjectPostByTitle.bind(sideProjectController));
route.post('/getSideProjectPagination', sideProjectController.getSideProjectPostPagination.bind(sideProjectController));
route.get('/getSideProjectAppUsers/:postId', sideProjectController.getSideProjectAppUsers.bind(sideProjectController));
// route.get('/getUserApplicationPosts/:userId', sideProjectController.getUserApplicationSideProjectPosts.bind(sideProjectController));

export default route;