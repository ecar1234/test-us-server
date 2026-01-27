
import { Router } from "express";
import { MessageUseCase } from "../../app/MessageUseCase";
import { MessageRepositoryImpl } from "../../infrastructure/repositories/Message/MessageRepositoryImpl";
import { MessageController } from "../controllers/MessageController";
import { RoomMemberRepositoryImpl } from "../../infrastructure/repositories/Message/RoomMemberRepositoryImpl";
import { RoomRepositoryImpl } from "../../infrastructure/repositories/Message/RoomRepositoryImpl";
import { TypeOrmUnitOfWork } from "../../infrastructure/repositories/Message/UnitOfWorkImpl"; 
import { AppDataSource } from "../../config/DataSource";
import { authMiddleware } from "../middlewares/AuthMiddleware";

const router: Router = Router();

const messageUseCase = new MessageUseCase(new MessageRepositoryImpl(), new RoomRepositoryImpl(), new RoomMemberRepositoryImpl(), new TypeOrmUnitOfWork(AppDataSource));
const messageController = new MessageController(messageUseCase);


// room
router.get('/getRoomList/:userId', authMiddleware, messageController.getRoomList.bind(messageController));

// room roomMember
// message
// router.post('/sendMessage', messageController.sendMessage.bind(messageController));
// router.post('/markAsRead', messageController.markAsRead.bind(messageController));
router.post('/getMessageByRoomId/', messageController.getMessageByRoomId.bind(messageController));
router.post('/getMessageByPostId/', messageController.getMessageByPostId.bind(messageController));


export default router;