import { UserUseCase } from "../../app/user_use_case";
import { Router } from 'express';
import { UserController } from "../controllers/user_controller";
import { UserRepository } from "../../infrastructure/repositories/user_repo";

const route = Router();
const userUseCase: UserUseCase = new UserUseCase(new UserRepository());
const userController: UserController = new UserController(userUseCase);

route.post('/update', userController.update.bind(userController));
route.post('/getUserById', userController.getUserById.bind(userController));
route.post('/getUserByEmail', userController.getUserByEmail.bind(userController));
route.post('/getUserByNickname', userController.getUserByNickname.bind(userController));
route.post('/changePassword', userController.changePassword.bind(userController));
route.get('/getAllUsers', userController.getAllUsers.bind(userController));
route.get('/isNicknameAvailable', userController.isNicknameAvailable.bind(userController));
route.get('/isEmailAvailable', userController.isEmailAvailable.bind(userController));
route.post('/isPasswordValid', userController.isPasswordValid.bind(userController));

export default route;