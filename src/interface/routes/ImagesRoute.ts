

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
import { PostRepositoryImpl } from "../../infrastructure/repositories/PostRepositoryImpl";

const route = Router();
const imagesUseCase = new ImagesUseCase(new ImagesRepositoryImpl(), new PostRepositoryImpl());
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

const upload = multer({ storage: storage, limits: { fileSize: 1024 * 1024 * 5 },  });


route.post('/uploads', authMiddleware, upload.array('images', 4), imagesController.uploadImages.bind(imagesController));
route.put('/update', authMiddleware, upload.array('images', 4), imagesController.updateImages.bind(imagesController));
// route.get('/download/', authMiddleware, imagesController.downloadImage.bind(imagesController));
// route.post('/delete/', authMiddleware, imagesController.deleteImage.bind(imagesController));

export default route;
