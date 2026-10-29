import { Router } from "express";
import { CoffeeChatUseCase } from "../../../app/posts/CoffeeChatUseCase.js";
import { CoffeeChatController } from "../../controllers/posts/CoffeeChatController.js";


const route = Router();

const coffeeChatUseCase = new CoffeeChatUseCase();
const coffeeChatController = new CoffeeChatController();





export default route;