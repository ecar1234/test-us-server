import multer from "multer";
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { Env } from '../../config/env.js';


class UploadMiddleware {
    private uploadUrl: string;
    public uploader: multer.Multer;

    constructor() {
        const isProd = process.env.NODE_ENV === 'prod';
        this.uploadUrl = isProd ? path.resolve(Env.MAIN_UPLOAD_URL) : path.resolve(Env.UPLOAD_URL);

        // 폴더가 없으면 재귀적으로 생성
        if (!fs.existsSync(this.uploadUrl)) {
            fs.mkdirSync(this.uploadUrl, { recursive: true });
        }

        // 스토리지 설정
        const storage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, this.uploadUrl);
            },
            filename: (req, file, cb) => {
                const ext = path.extname(file.originalname);
                const name = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}${ext}`;
                cb(null, name);
            }
        });

        // Multer 인스턴스 생성 (보안 및 필터링 적용)
        this.uploader = multer({
            storage: storage,
            // 1. 보안: 파일 사이즈 제한 (예: 10MB) - 반드시 주석을 풀고 적용하는 것을 권장합니다.
            limits: { fileSize: 1024 * 1024 * 10 },

            // 2. 보안: 이미지 파일만 업로드 가능하도록 필터링
            fileFilter: (req, file, cb) => {
                const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
                if (allowedMimeTypes.includes(file.mimetype)) {
                    cb(null, true);
                } else {
                    cb(new Error('허용되지 않는 파일 형식입니다. 이미지(JPG, PNG, GIF, WEBP)만 업로드 가능합니다.'));
                }
            }
        });
    }
}

export const uploadMiddleware = new UploadMiddleware().uploader;