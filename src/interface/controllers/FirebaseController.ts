import { FirebaseUseCase } from "../../app/FirebaseUseCase.js";
import { Request, Response } from "express";

export class FirebaseController {
    constructor(private firebaseUseCase: FirebaseUseCase) { }

    async createMessingToken(req: Request, res: Response) {
        try {
            const { userId, fcmToken, deviceType } = req.body;
            await this.firebaseUseCase.createMessingToken(userId, fcmToken, deviceType);
            res.status(200).json({ status: 200, result: true });
        } catch (error) {
            console.log(error);
            res.status(500).json({ status: 500, result: false, message: error.message});
        }
    }
    async updateMessingToken(req: Request, res: Response) {
        try {
            const { userId, fcmToken, deviceType } = req.body;
            await this.firebaseUseCase.updateMessingToken(userId, fcmToken, deviceType);
            res.status(200).json({ status: 200, result: true });
        } catch (error) {
            console.log(error);
            res.status(500).json({ status: 500, result: false, message: error.message});
        }
    }
    async revmoeMessingToken(req: Request, res: Response) {
        try {
            const { userId } = req.body;
            await this.firebaseUseCase.revmoeMessingToken(userId);
            res.status(200).json({ status: 200, result: true });
        } catch (error) {
            console.log(error);
            res.status(500).json({ status: 500, result: false, message: error.message});
        }
    }

    // async subscribe(req: Request, res: Response) {

        
    // }
    // async unsubscribe(req: Request, res: Response) {
        
    // }


}