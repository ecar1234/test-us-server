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

    async getRoomById(req: Request, res: Response): Promise<void> {
        try {
            const roomId = req.params.roomId;
            const room = await this.messageUseCase.getRoomById(parseInt(roomId));
            res.status(200).json({ status: 200, room: room });
        } catch (error) {
            res.status(500).json({ status: 500, error: error.message });
        }
    }

    async resetUnreadCount(req: Request, res: Response): Promise<void> {
        try {
            const { roomId, userId } = req.body;
            await this.messageUseCase.resetUnreadCount(roomId, userId);
            res.status(200).json({ status: 200 });
        } catch (error) {
            res.status(500).json({ status: 500, error: error.message });
        }
    }

    // Message
    async getMessageByRoomId(req: Request, res: Response): Promise<void> {
        try {
            const { roomId, userId } = req.body;
            const messages: MessageModel[] = await this.messageUseCase.getMessageByRoomId(roomId, userId);
            res.status(200).json({ status: 200, messages: messages });
        } catch (error) {
            res.status(500).json({ status: 500, error: error.message });
        }
    }
    async getMessageByPostId(req: Request, res: Response): Promise<void> {
        try {
            const { postId, targetId } = req.body;
            const messages: MessageModel[] = await this.messageUseCase.getMessageByPostId(postId, targetId);
            
            res.status(200).json({ status: 200, messages: messages });
        } catch (error) {
            res.status(500).json({ status: 500, error: error.message });
        }
    }
    
}