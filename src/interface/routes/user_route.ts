import { UserUseCase } from "../../app/user_use_case";
import { Router } from 'express';
import { UserController } from "../controllers/user_controller";
import { UserRepository } from "../../infrastructure/repositories/user_repo";

const router = Router();
const userUseCase: UserUseCase = new UserUseCase(new UserRepository());
const userController: UserController = new UserController(userUseCase);

router.post('/update', userController.update.bind(userController));

export default router;