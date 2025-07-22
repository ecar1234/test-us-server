import { UserUseCase } from "../../app/UserUseCase";
import { Router } from 'express';
import { UserController } from "../controllers/UserController";
import { UserRepositoryImpl } from "../../infrastructure/repositories/UserRepositoryImpl";

const route = Router();
const userUseCase: UserUseCase = new UserUseCase(new UserRepositoryImpl());
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