

import { Router } from "express";
import { Env } from "../../config/env.js";
import { ImagesController } from "../controllers/ImagesContoller.js";
import { ImagesUseCase } from "../../app/ImagesUseCase.js";
import { ImagesRepositoryImpl } from "../../infrastructure/repositories/ImagesRepositoryImpl.js";
import { authMiddleware } from "../middlewares/AuthMiddleware.js";
import { RecruitmentPostRepositoryImpl } from "../../infrastructure/repositories/RecruitmentPostRepositoryImpl.js";
import { PromotionPostRepositoryImpl } from "../../infrastructure/repositories/PromotionPostRepositoryImpl.js";
import multer from "multer";
import crypto from "crypto";
import path from "path";
import fs from "fs";

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


// route.post('/uploads', authMiddleware, uploadWithFiles.array('images', 4), imagesController.uploadImages.bind(imagesController)); // Removed as post creation now handles images
// route.put('/update', authMiddleware, uploadWithFiles.array('images', 4), imagesController.updateImages.bind(imagesController)); // This is now handled by PostController
// route.get('/download/', authMiddleware, imagesController.downloadImage.bind(imagesController));
route.delete('/delete/', authMiddleware, uploadOnlyText.none(), imagesController.deleteImage.bind(imagesController));

export default route;
