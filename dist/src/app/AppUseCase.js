"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppUseCase = void 0;
const ApplicationModel_1 = require("../domain/entities/ApplicationModel");
class AppUseCase {
    constructor(applicationRepository) {
        this.applicationRepository = applicationRepository;
    }
    createApplication(userId_1, postId_1, platform_1) {
        return __awaiter(this, arguments, void 0, function* (userId, postId, platform, status = 'pending') {
            const application = new ApplicationModel_1.ApplicationModel(null, platform, status, null, null, postId, userId);
            return this.applicationRepository.create(application);
        });
    }
    updateApplication(postId, userId, platform, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const application = new ApplicationModel_1.ApplicationModel(null, platform, status, null, null, postId, userId);
            return this.applicationRepository.update(application);
        });
    }
    deleteApplication(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.applicationRepository.delete(id);
        });
    }
    acceptUser(userId, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.applicationRepository.acceptUser(userId, postId);
        });
    }
    rejectUser(userId, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.applicationRepository.rejectUser(userId, postId);
        });
    }
}
exports.AppUseCase = AppUseCase;
