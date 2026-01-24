import express, { Router } from 'express';
import { UserRepositoryImpl } from '../../infrastructure/repositories/UserRepositoryImpl';
import { UserUseCase } from '../../app/UserUseCase';
import { UserController } from '../controllers/UserController';
import { RecruitmentPostRepositoryImpl } from '../../infrastructure/repositories/RecruitmentPostRepositoryImpl';
import { UserReviewRepositoryImpl } from '../../infrastructure/repositories/UserReviewRepositoryImpl';
import { auth } from 'firebase-admin';
import { authMiddleware } from '../middlewares/AuthMiddleware';

const route: Router = express.Router();
// post, app, message, review useCase 추가해서 user usecase에 주입 해야함.(목록 조회용)

const userUseCase: UserUseCase = new UserUseCase(new UserRepositoryImpl(), new RecruitmentPostRepositoryImpl(), new UserReviewRepositoryImpl());
const userController: UserController = new UserController(userUseCase);

route.post('/register', userController.register.bind(userController));
route.post('/login', userController.login.bind(userController));
route.get('/autoLogin', authMiddleware, userController.autoLogin.bind(userController));
route.post('/refreshToken', userController.refreshToken.bind(userController));
route.post('/authLogin', userController.authLogin.bind(userController));
route.post('/authSignup', userController.authRegister.bind(userController));
route.post('/delete', userController.delete.bind(userController));

export default route;