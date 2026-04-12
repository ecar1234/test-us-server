import express from 'express';
import { PurchaseController } from '../controllers/PurchaseController';
import { PurchaseUseCase } from '../../app/PurchaseUseCase';
import { PurchaseRepositoryImpl } from '../../infrastructure/repositories/PurchaseRepositoryImpl';
import { iosWebhookMiddleware } from '../middlewares/IosWebhookMiddleware';
import { authMiddleware } from '../middlewares/AuthMiddleware';


const route = express.Router();
const purchaseRepo = new PurchaseRepositoryImpl();
const purchaseUseCase = new PurchaseUseCase(purchaseRepo);
const purchaseController = new PurchaseController(purchaseUseCase);
// web hook
// web hook middleware jwt 만들기(google만)
// web hook 설정 완성
// 구매 인증 api 완성
route.post('/webhook/google', purchaseController.handleWebhookGoogle.bind(purchaseController));
route.post('/webhook/apple', iosWebhookMiddleware, purchaseController.handleWebhookApple.bind(purchaseController));
// debug
route.post('/debug/eventLog', purchaseController.logDebugEvent.bind(purchaseController));
route.post('/debug/errorLog', purchaseController.errorlogEvent.bind(purchaseController));
// data
route.post('/refresh', authMiddleware, purchaseController.refreshPurchaseStatus.bind(purchaseController));
route.get('/subscribes/:userId', authMiddleware, purchaseController.getSubscribes.bind(purchaseController));

route.post('/purchaseAOS', authMiddleware, purchaseController.purchaseAOS.bind(purchaseController));
route.post('/purchaseIOS', authMiddleware, purchaseController.purchaseIOS.bind(purchaseController));


// route.post('/verifyPurchaseAOS', authMiddleware, purchaseController.verifyPurchaseIOS.bind(purchaseController));
// route.post('/verifyPurchaseIOS', authMiddleware, purchaseController.verifyPurchaseAOS.bind(purchaseController));

export default route;