import { url } from "inspector";
import { ImagesUseCase } from "../../app/ImagesUseCase";
import { ImagesModel } from "../../domain/entities/ImagesModel";
import { Request, Response } from "express";
import fs from "fs";
import { Env } from "../../config/env";


export class ImagesController {
    constructor(
        private imagesUseCase: ImagesUseCase
    ) { }

    async uploadImages(req: Request, res: Response): Promise<void> {

        if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
            res.status(400).json({ message: 'No image files uploaded.' });
        }
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
        const result = await this.imagesUseCase.imagesResistation(images);
        // console.log(result);
        const urls = result.map(image => ({id : image.id, url : image.url}));

        res.status(200).json({ state: 200, urls: urls });

    }

    async updateImages(req: Request, res: Response): Promise<void> {
        const imgInfo = req.body;

        const files = req.files as Express.Multer.File[];

        const images = files.map((file: Express.Multer.File, i: number) =>
        (
            {
                id: imgInfo[i].id,
                filename: file.filename,
                originalname: file.originalname,
                mimetype: file.mimetype,
                size: file.size,
                url: `${req.protocol}://${req.get('host')}/uploads/${file.filename}`,
                path: `${Env.UPLOAD_URL}/${imgInfo[i].filename}`
            }
        ));
        const result = await this.imagesUseCase.imagesUpdate(images);
        res.status(200).json({ state: 200, result: result });
    }


    async downloadImage(req: Request, res: Response): Promise<void> {

    }

    async deleteImage(req: Request, res: Response): Promise<void> {
        const infos = req.body;
   try {
        //  for (let info of infos) {
        //      const path = `${Env.UPLOAD_URL}/${info.filename}`;
        //      if (fs.existsSync(path)) fs.unlinkSync(path);
        //  }
         const ids = infos.map((info: any) => info.id);
 
         const result = await this.imagesUseCase.imagesDelete(ids);
         res.status(200).json({ state: 200, result: result });
   } catch (error) {
        res.status(500).json({ state: 500, error: error.message });
   }
    
    }
}