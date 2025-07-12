import express, { Router } from 'express';
import { AuthController } from '../controllers/auth_controller';
import { AuthRepository } from '../../infrastructure/repositories/auth_repo';
import { AuthUseCase } from '../../app/auth_use_case';

const route: Router = express.Router();
const authUseCase: AuthUseCase = new AuthUseCase(new AuthRepository());
const authController: AuthController = new AuthController(authUseCase);

route.post('signup', authController.signup.bind(authController));
route.post('signin', authController.signin.bind(authController));
route.post('withdraw', authController.withdraw.bind(authController));


export default route;