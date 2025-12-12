import { Router } from "express";
import { FirebaseController } from "../controllers/FirebaseController";
import { FirebaseUseCase } from "../../app/FirebaseUseCase";
import { FirebaseRepositoryImpl } from "../../infrastructure/repositories/FirebaseRepositoryImpl";
import { authMiddleware } from "../middlewares/AuthMiddleware";


const route = Router();
const firebaseUseCase = new FirebaseUseCase(new FirebaseRepositoryImpl);
const firebaseController = new FirebaseController(firebaseUseCase);


route.post('/createToken', authMiddleware, firebaseController.createMessingToken.bind(firebaseController));
route.post('/updateToken', authMiddleware, firebaseController.updateMessingToken.bind(firebaseController));
route.post('/removeToken', authMiddleware, firebaseController.revmoeMessingToken.bind(firebaseController));
// route.post('/subscribe', firebaseController.subscribe.bind(firebaseController));
// route.post('/unsubscribe', firebaseController.unsubscribe.bind(firebaseController));

export default route;