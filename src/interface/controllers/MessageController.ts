import { MessageUseCase } from "../../app/MessageUseCase";
import { Request, Response } from "express";
import { MessageModel } from "../../domain/entities/MessageModel";

export class MessageController {
    constructor(
        private messageUseCase: MessageUseCase
    ) { }

    async sendMessage(req: Request, res: Response): Promise<void> {
        const { content, senderId, receiverId } = req.body;
        const newMessage: MessageModel = new MessageModel(
            null, content, new Date(), null, false, false, senderId, receiverId
        );

        const result = await this.messageUseCase.sendMessage(newMessage);

        res.status(200).json({ sendData: result });
    }
    async getMessage(req: Request, res: Response): Promise<void> {
        const { messageId, readAtDate } = req.body;
        const readAt = new Date(readAtDate);
        const result = await this.messageUseCase.updateReadAt(messageId, readAt);

        res.status(result[0] ? 200 : 404).json({ result: result[0], message: result[1] });
    }
    async getAllSendMessage(req: Request, res: Response): Promise<void> {
        const senderId: string = req.params.userId;

        const result: MessageModel[] = await this.messageUseCase.getSendMessageList(senderId);
        res.status(200).json({ sendMessageList: result });
    }
    async getAllReceiveMessage(req: Request, res: Response): Promise<void> {
        const receiverId: string = req.params.userId;
        const result: MessageModel[] = await this.messageUseCase.getReceiveMessageList(receiverId);
        
        res.status(200).json({ receiveMessageList: result });
    }
    async deleteMessage(req: Request, res: Response):Promise<void>{
        const { messageId, userId } = req.body;
        const result: MessageModel[] = await this.messageUseCase.deleteMessage(messageId, userId);

        res.status(200).json({ messageList: result });
    }
}