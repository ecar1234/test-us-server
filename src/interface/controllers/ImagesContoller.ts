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
        const { postId } = req.body;
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
        const result = await this.imagesUseCase.imagesRegister(images, postId);
        // console.log(result);
        res.status(200).json({ status: 200, post: result });
        return;

    }

    async updateImages(req: Request, res: Response): Promise<void> {
        const { deleteImages, postId } = req.body;

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
        const result = await this.imagesUseCase.imagesUpdate(deleteImages, images, postId);
        // console.log('post', result);
        res.status(200).json({ status: 200, post: result });
        return;
    }


    // async downloadImage(req: Request, res: Response): Promise<void> {
// 
    // }

    // async deleteImage(req: Request, res: Response): Promise<void> {
    //     const { id } = req.body;
    //     try {
    //         const result = await this.imagesUseCase.imagesDelete(id);
    //         res.status(200).json({ state: 200, result: result });
    //         return;
    //     } catch (error) {
    //         res.status(500).json({ state: 500, error: error.message });
    //     }

    // }
}