import express, { Router } from 'express';
import { UserRepositoryImpl } from '../../infrastructure/repositories/UserRepositoryImpl';
import { UserUseCase } from '../../app/UserUseCase';
import { UserController } from '../controllers/UserController';
import { RecruitmentPostRepositoryImpl } from '../../infrastructure/repositories/RecruitmentPostRepositoryImpl';
import { ReviewRepositoryImpl } from '../../infrastructure/repositories/ReviewRepositoryImpl';

const route: Router = express.Router();
// post, app, message, review useCase 추가해서 user usecase에 주입 해야함.(목록 조회용)

const userUseCase: UserUseCase = new UserUseCase(new UserRepositoryImpl(), new RecruitmentPostRepositoryImpl(), new ReviewRepositoryImpl());
const userController: UserController = new UserController(userUseCase);

route.post('/register', userController.register.bind(userController));
route.post('/login', userController.login.bind(userController));
route.post('/delete', userController.delete.bind(userController));

export default route;