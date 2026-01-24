import { MessageUseCase } from "../../app/MessageUseCase";
import { Request, Response } from "express";
import { MessageModel } from "../../domain/entities/MessagesModels/MessageModel";

export class MessageController {
    constructor(
        private messageUseCase: MessageUseCase
    ) { }


    // Room
    async getRoomList(req: Request, res: Response): Promise<void> {
       try {
         const userId = req.params.userId;
         const roomList = await this.messageUseCase.getRoomList(userId);
         res.status(200).json({ status: 200, roomList: roomList });
       } catch (error) {
        res.status(500).json({ status: 500, error: error.message });
       }
    }

    async sendMessage(req: Request, res: Response): Promise<void> {
       
    }
    
}