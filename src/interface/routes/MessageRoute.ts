
import { Router } from "express";
import { MessageUseCase } from "../../app/MessageUseCase.js";
import { MessageRepositoryImpl } from "../../infrastructure/repositories/Message/MessageRepositoryImpl.js";
import { MessageController } from "../controllers/MessageController.js";
import { RoomMemberRepositoryImpl } from "../../infrastructure/repositories/Message/RoomMemberRepositoryImpl.js";
import { RoomRepositoryImpl } from "../../infrastructure/repositories/Message/RoomRepositoryImpl.js";
import { TypeOrmUnitOfWork } from "../../infrastructure/repositories/Message/UnitOfWorkImpl.js"; 
import { AppDataSource } from "../../config/DataSource.js";
import { authMiddleware } from "../middlewares/AuthMiddleware.js";

const router: Router = Router();

const messageUseCase = new MessageUseCase(new MessageRepositoryImpl(), new RoomRepositoryImpl(new RoomMemberRepositoryImpl(), new MessageRepositoryImpl()), new RoomMemberRepositoryImpl(), new TypeOrmUnitOfWork(AppDataSource));
const messageController = new MessageController(messageUseCase);


// room
router.get('/getRoomList/:userId', authMiddleware, messageController.getRoomList.bind(messageController));
router.get('/getRoomById/:roomId', authMiddleware, messageController.getRoomById.bind(messageController));
router.post('/resetUnreadCount', authMiddleware, messageController.resetUnreadCount.bind(messageController));

// room roomMember
router.post('/deleteRoomMember', authMiddleware, messageController.deleteRoomMember.bind(messageController));

// message
router.post('/getMessageByRoomId/', authMiddleware, messageController.getMessageByRoomId.bind(messageController));
router.post('/getMessageByPostId/', authMiddleware, messageController.getMessageByPostId.bind(messageController));


export default router;