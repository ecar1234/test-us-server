import { ImagesUseCase } from "../../app/ImagesUseCase";
import { Request, Response } from "express";


export class ImagesController {
    constructor(
        private imagesUseCase: ImagesUseCase
    ) { }

    async uploadImages(req: Request, res: Response): Promise<void> {

        if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
            res.status(400).json({ message: 'No image files uploaded.' });
            return;
        }
        const { postId, postType } = req.body;
        const files = req.files as Express.Multer.File[];
        const images = files.map((file: Express.Multer.File) =>
        ({
            filename: file.filename,
            originalname: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
            url: `${req.protocol}://${req.get('host')}/uploads/${file.filename}`,
        })
        );
        if (!postType) {
            res.status(400).json({ message: 'postType is required.' });
            return;
        }
        const result = await this.imagesUseCase.imagesRegister(images, postId, postType);
        // console.log(result);
        res.status(200).json({ status: 200, post: result });
        return;

    }

    async updateImages(req: Request, res: Response): Promise<void> {
        const { postId, postType } = req.body;
        let deleteImagesData = [];

        // deleteImages가 문자열로 오면 JSON 파싱을 시도합니다.
        if (req.body.deleteImages && typeof req.body.deleteImages === 'string') {
            try {
                deleteImagesData = JSON.parse(req.body.deleteImages);
            } catch (e) {
                res.status(400).json({ status: 400, message: 'Invalid format for deleteImages. It must be a valid JSON string.' });
                return;
            }
        }

        const files = req.files as Express.Multer.File[];
        const images = files.map((file: Express.Multer.File, i: number) =>
        (
            {
                filename: file.filename,
                originalname: file.originalname,
                mimetype: file.mimetype,
                size: file.size,
                url: `${req.protocol}://${req.get('host')}/uploads/${file.filename}`,
            }
        ));
        if (!postType) {
            res.status(400).json({ message: 'postType is required.' });
            return;
        }
        const result = await this.imagesUseCase.imagesUpdate(deleteImagesData, images, postId, postType);
        // console.log('post', result);
        res.status(200).json({ status: 200, post: result });
        return;
    }


    // async downloadImage(req: Request, res: Response): Promise<void> {
// 
    // }

    async deleteImage(req: Request, res: Response): Promise<void> {
        const { deleteImages } = req.body;
        try {
            const result = await this.imagesUseCase.imagesDelete(deleteImages);
            res.status(200).json({ status: 200, result: result });
            return;
        } catch (error) {
            res.status(500).json({ status: 500, error: error.message });
        }

    }
}