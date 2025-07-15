import express, { Router } from 'express';
import { UserRepository } from '../../infrastructure/repositories/user_repo';
import { UserUseCase } from '../../app/user_use_case';
import { UserController } from '../controllers/user_controller';

const route: Router = express.Router();
// post, app, message, review useCase 추가해서 user usecase에 주입 해야함.(목록 조회용)

const userUseCase: UserUseCase = new UserUseCase(new UserRepository());
const userController: UserController = new UserController(userUseCase);

route.post('/register', userController.register.bind(userController));
route.post('/delete', userController.delete.bind(userController));

export default route;