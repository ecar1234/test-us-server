import { UserUseCase } from "../../app/UserUseCase";
import { Router } from 'express';
import { UserController } from "../controllers/UserController";
import { UserRepositoryImpl } from "../../infrastructure/repositories/UserRepositoryImpl";
import { PostRepositoryImpl } from "../../infrastructure/repositories/PostRepositoryImpl";
import { authMiddleware } from "../middlewares/AuthMiddleware";
import { ReviewRepositoryImpl } from "../../infrastructure/repositories/ReviewRepositoryImpl";

const route = Router();
const userUseCase: UserUseCase = new UserUseCase(new UserRepositoryImpl(), new PostRepositoryImpl(), new ReviewRepositoryImpl());
const userController: UserController = new UserController(userUseCase);

route.post('/update', authMiddleware, userController.update.bind(userController));
route.get('/getUserById/:id', authMiddleware, userController.getUserById.bind(userController));
route.post('/getUsersByIds', authMiddleware, userController.getUsersByIds.bind(userController));
route.get('/getUserByEmail/:email', authMiddleware, userController.getUserByEmail.bind(userController));
route.get('/getUserByNickname/:nickname', authMiddleware, userController.getUserByNickname.bind(userController));
route.get('/getPostsByNickname/:nickname', authMiddleware, userController.getPostsByNickname.bind(userController));
route.put('/changePassword', authMiddleware, userController.changePassword.bind(userController));
route.get('/getAllUsers', authMiddleware, userController.getAllUsers.bind(userController));
route.get('/isNicknameAvailable/:nickname', userController.isNicknameAvailable.bind(userController));
route.get('/isEmailAvailable/:email', userController.isEmailAvailable.bind(userController));
route.post('/isPasswordValid', userController.isPasswordValid.bind(userController));

export default route;