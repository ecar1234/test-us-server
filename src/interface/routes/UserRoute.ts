import { UserUseCase } from "../../app/UserUseCase";
import { Router } from 'express';
import { UserController } from "../controllers/UserController";
import { UserRepositoryImpl } from "../../infrastructure/repositories/UserRepositoryImpl";

const route = Router();
const userUseCase: UserUseCase = new UserUseCase(new UserRepositoryImpl());
const userController: UserController = new UserController(userUseCase);

route.post('/update', userController.update.bind(userController));
route.get('/getUserById/:id', userController.getUserById.bind(userController));
route.get('/getUserByEmail/:email', userController.getUserByEmail.bind(userController));
route.get('/getUserByNickname/:nickname', userController.getUserByNickname.bind(userController));
route.put('/changePassword', userController.changePassword.bind(userController));
route.get('/getAllUsers', userController.getAllUsers.bind(userController));
route.get('/isNicknameAvailable/:nickname', userController.isNicknameAvailable.bind(userController));
route.get('/isEmailAvailable/:email', userController.isEmailAvailable.bind(userController));
route.post('/isPasswordValid', userController.isPasswordValid.bind(userController));

export default route;