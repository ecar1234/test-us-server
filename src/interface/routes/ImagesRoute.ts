

import { Router } from "express";
import { ImagesController } from "../controllers/ImagesContoller";
import { ImagesUseCase } from "../../app/ImagesUseCase";
import { ImagesRepositoryImpl } from "../../infrastructure/repositories/ImagesRepositoryImpl";
import multer from "multer";
import { authMiddleware } from "../middlewares/AuthMiddleware";
import crypto from "crypto";
import path from "path";
import fs from "fs";
import { Env } from "../../config/env";
import { RecruitmentPostRepositoryImpl } from "../../infrastructure/repositories/RecruitmentPostRepositoryImpl";
import { PromotionPostRepositoryImpl } from "../../infrastructure/repositories/PromotionPostRepositoryImpl";

const route = Router();
const imagesUseCase = new ImagesUseCase(new ImagesRepositoryImpl(), new RecruitmentPostRepositoryImpl(), new PromotionPostRepositoryImpl());
const imagesController = new ImagesController(imagesUseCase);

const UPLOAD_URL = Env.UPLOAD_URL;
if(!fs.existsSync(UPLOAD_URL)) fs.mkdirSync(UPLOAD_URL, { recursive: true });


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_URL);
    },
    filename: (req, file, cb) => {
       const ext = path.extname(file.originalname);
       const name = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}${ext}`
       cb(null, name);
    }
});

const uploadWithFiles = multer({ storage: storage, limits: { fileSize: 1024 * 1024 * 5 } });
const uploadOnlyText = multer({ limits: { fileSize: 1024 * 1024 * 5 } }); // 파일 저장을 위한 storage 설정이 없음


route.post('/uploads', authMiddleware, uploadWithFiles.array('images', 4), imagesController.uploadImages.bind(imagesController));
route.put('/update', authMiddleware, uploadWithFiles.array('images', 4), imagesController.updateImages.bind(imagesController));
// route.get('/download/', authMiddleware, imagesController.downloadImage.bind(imagesController));
route.delete('/delete/', authMiddleware, uploadOnlyText.none(), imagesController.deleteImage.bind(imagesController));

export default route;
