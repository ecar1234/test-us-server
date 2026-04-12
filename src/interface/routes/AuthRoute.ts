import express, { Router } from 'express';
import { UserUseCase } from '../../app/UserUseCase.js';
import { UserRepositoryImpl } from '../../infrastructure/repositories/UserRepositoryImpl.js';
import { RecruitmentPostRepositoryImpl } from '../../infrastructure/repositories/RecruitmentPostRepositoryImpl.js';
import { OtpSevice } from '../../service/otp/OtpService.js';
import { MailService } from '../../service/otp/MailService.js';
import { OtpRepositoryImpl } from '../../infrastructure/repositories/Otp/OtpRedisRepositoryImpl.js';
import { OtpUseCase } from '../../app/OtpUseCase.js';
import { AuthConroller } from '../controllers/AuthController.js';
import { authMiddleware } from '../middlewares/AuthMiddleware.js';
import { UserReviewRepositoryImpl } from '../../infrastructure/repositories/UserReviewRepositoryImpl.js';
import { AuthUseCase } from '../../app/AuthUseCase.js';


const route: Router = express.Router();
// post, app, message, review useCase 추가해서 user usecase에 주입 해야함.(목록 조회용)

const userUseCase: UserUseCase = new UserUseCase(new UserRepositoryImpl(), new RecruitmentPostRepositoryImpl(), new UserReviewRepositoryImpl());
const authUseCase: AuthUseCase = new AuthUseCase(new UserRepositoryImpl(), new OtpRepositoryImpl(), new MailService(), new OtpSevice());
const otpUseCase: OtpUseCase = new OtpUseCase(new OtpRepositoryImpl(), new MailService(), new OtpSevice());
const authController: AuthConroller = new AuthConroller(userUseCase, authUseCase, otpUseCase);

route.post('/register', authController.register.bind(authController));
route.post('/login', authController.login.bind(authController));
route.get('/autoLogin', authMiddleware, authController.autoLogin.bind(authController));
route.post('/refreshToken', authController.refreshToken.bind(authController));
route.post('/authLogin', authController.authLogin.bind(authController));
route.post('/authSignup', authController.authRegister.bind(authController));
route.post('/delete', authController.delete.bind(authController));
route.post('/updatePassword', authMiddleware, authController.updatePassword.bind(authController));
route.post('/changePassword', authController.changePassword.bind(authController));
route.post('/findEmail', authController.findEmail.bind(authController));
route.post('/findPassword', authController.findPassword.bind(authController));
route.post('/verifyOtp', authController.verifyOtp.bind(authController));


export default route;