import { MessageUseCase } from "../../app/MessageUseCase.js";
import { Request, Response } from "express";
import { MessageModel } from "../../domain/entities/MessagesModels/MessageModel.js";

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
            const room = await this.messageUseCase.resetUnreadCount(roomId, userId);
            res.status(200).json({ status: 200, room: room});
        } catch (error) {
            res.status(500).json({ status: 500, error: error.message });
        }
    }

    // member
    async deleteRoomMember(req: Request, res: Response): Promise<void> {
        // room에서 삭제 하는게 아니라. member에서 삭제 후 room을 리턴해야 한다.(수정 필요.)
        const { roomId, userId } = req.body;
        try {
            const room = await this.messageUseCase.removeMemberOnRoom(roomId, userId);
            if (!room) {
                res.status(200).json({status: 200, room: null});
                return ;
            }
            res.status(200).json({ status: 200, room: room });

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
            if(messages === null) {
                res.status(404).json({ status: 404, messages: null });
                return ;
            }
            res.status(200).json({ status: 200, messages: messages });
        } catch (error) {
            res.status(500).json({ status: 500, error: error.message });
        }
    }
    
}