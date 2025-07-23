
import { Router } from "express";
import { MessageUseCase } from "../../app/MessageUseCase";
import { MessageRepositoryImpl } from "../../infrastructure/repositories/MessageRepositoryImpl";
import { MessageController } from "../controllers/MessageController";

const router: Router = Router();

const messageUseCase = new MessageUseCase(new MessageRepositoryImpl);
const messageController = new MessageController(messageUseCase);

router.post('/sendMessage', messageController.sendMessage.bind(messageController));
router.post('/getMessage', messageController.getMessage.bind(messageController));
router.get('/getSendMessages/:userId', messageController.getAllSendMessage.bind(messageController));
router.get('/getReceiveMessages/:userId', messageController.getAllReceiveMessage.bind(messageController));
router.post('deleteMessage', messageController.deleteMessage.bind(messageController));

export default router;