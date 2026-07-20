import { Router } from 'express';
import { UserUseCase } from "../../app/UserUseCase.js";
import { UserController } from "../controllers/UserController.js";
import { UserRepositoryImpl } from "../../infrastructure/repositories/UserRepositoryImpl.js";
import { UserReviewRepositoryImpl } from "../../infrastructure/repositories/UserReviewRepositoryImpl.js";
import { RecruitmentPostRepositoryImpl } from "../../infrastructure/repositories/RecruitmentPostRepositoryImpl.js";
import { authMiddleware } from "../middlewares/AuthMiddleware.js";
// import { Env } from "../../config/env";
import fs from "fs";
import multer from "multer";
import path from "path";
import crypto from "crypto";

const route = Router();
const userUseCase: UserUseCase = new UserUseCase(new UserRepositoryImpl(), new RecruitmentPostRepositoryImpl(), new UserReviewRepositoryImpl());
const userController: UserController = new UserController(userUseCase);

const isProd = process.env.NODE_ENV === 'prod';
const url = isProd ? path.resolve(process.env.MAIN_UPLOAD_USER_URL) : path.resolve(process.env.UPLOAD_USER_URL);

if(!fs.existsSync(url)) fs.mkdirSync(url, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, url);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const name = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}${ext}`
        cb(null, name);
    }
});

const uploadWithFile = multer({ storage: storage, limits: { fileSize: 1024 * 1024 * 5 } });

route.post('/update', authMiddleware, userController.update.bind(userController));
route.put('/updateUserInfo', authMiddleware, userController.update.bind(userController));
route.post('/updateUserInfoWithImg', authMiddleware, uploadWithFile.single('image'), userController.updateUserInfoWithImg.bind(userController));
route.get('/getUserById/:id', authMiddleware, userController.getUserById.bind(userController));
route.post('/getUsersByIds', authMiddleware, userController.getUsersByIds.bind(userController));
route.get('/getUserByEmail/:email', userController.getUserByEmail.bind(userController));
route.get('/getUserByNickname/:nickname', userController.getUserByNickname.bind(userController));
route.get('/getPostsByNickname/:nickname', userController.getPostsByNickname.bind(userController));
route.get('/getAllUsers', authMiddleware, userController.getAllUsers.bind(userController));
route.get('/isNicknameAvailable/:nickname', userController.isNicknameAvailable.bind(userController));
route.get('/isEmailAvailable/:email', userController.isEmailAvailable.bind(userController));
route.post('/isPasswordValid', authMiddleware, userController.isPasswordValid.bind(userController));

export default route;