import { UserUseCase } from "../../app/UserUseCase";
import { Router } from 'express';
import { UserController } from "../controllers/UserController";
import { UserRepositoryImpl } from "../../infrastructure/repositories/UserRepositoryImpl";
import { RecruitmentPostRepositoryImpl } from "../../infrastructure/repositories/RecruitmentPostRepositoryImpl";
import { authMiddleware } from "../middlewares/AuthMiddleware";
import { ReviewRepositoryImpl } from "../../infrastructure/repositories/ReviewRepositoryImpl";
import { Env } from "../../config/env";
import fs from "fs";
import multer from "multer";
import path from "path";
import crypto from "crypto";

const route = Router();
const userUseCase: UserUseCase = new UserUseCase(new UserRepositoryImpl(), new RecruitmentPostRepositoryImpl(), new ReviewRepositoryImpl());
const userController: UserController = new UserController(userUseCase);

const UPLOAD_USER_URL = Env.UPLOAD_USER_URL;
if(!fs.existsSync(UPLOAD_USER_URL)) fs.mkdirSync(UPLOAD_USER_URL, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_USER_URL);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const name = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}${ext}`
        cb(null, name);
    }
});

const uploadWithFile = multer({ storage: storage, limits: { fileSize: 1024 * 1024 * 5 } });

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
route.put('/updateUserInfo', authMiddleware, userController.update.bind(userController));
route.post('/updateUserInfoWithImg', authMiddleware, uploadWithFile.single('image'), userController.updateUserInfoWithImg.bind(userController));

export default route;