import { UserUseCase } from "../../app/user_use_case";
import { Router } from 'express';
import { UserController } from "../controllers/user_controller";
import { UserRepository } from "../../infrastructure/repositories/user_repo";

const router = Router();
const userUseCase: UserUseCase = new UserUseCase(new UserRepository());
const userController: UserController = new UserController(userUseCase);

router.post('/update', userController.update.bind(userController));
router.post('/getUserInfoById', userController.getUserById.bind(userController));
router.get('/all', userController.getAllUsers.bind(userController));
router.post('/changePassword', userController.changePassword.bind(userController));
router.post('/getUserInfoByEmail', userController.getUserByEmail.bind(userController));
router.get('/getUserInfoByNickName', userController.getUserByNickname.bind(userController));
// Add any additional routes as needed  

export default router;