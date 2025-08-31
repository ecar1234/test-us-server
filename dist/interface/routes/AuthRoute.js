"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UserRepositoryImpl_1 = require("../../infrastructure/repositories/UserRepositoryImpl");
const UserUseCase_1 = require("../../app/UserUseCase");
const UserController_1 = require("../controllers/UserController");
const PostRepositoryImpl_1 = require("../../infrastructure/repositories/PostRepositoryImpl");
const route = express_1.default.Router();
// post, app, message, review useCase 추가해서 user usecase에 주입 해야함.(목록 조회용)
const userUseCase = new UserUseCase_1.UserUseCase(new UserRepositoryImpl_1.UserRepositoryImpl(), new PostRepositoryImpl_1.PostRepositoryImpl);
const userController = new UserController_1.UserController(userUseCase);
route.post('/register', userController.register.bind(userController));
route.post('/login', userController.login.bind(userController));
route.post('/delete', userController.delete.bind(userController));
exports.default = route;
