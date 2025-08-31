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
exports.ApplicationController = void 0;
class ApplicationController {
    constructor(appUseCase) {
        this.appUseCase = appUseCase;
    }
    createApplication(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, postId, platfrom } = req.body;
                const application = yield this.appUseCase.createApplication(userId, postId, platfrom);
                res.status(200).json({ status: 200, application: application });
            }
            catch (error) {
                res.status(500).json({ status: 500, error: error.message });
            }
        });
    }
    updateApplication(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, postId, platform, status } = req.body;
                const updatedApplication = yield this.appUseCase.updateApplication(postId, userId, platform, status);
                res.status(200).json({ stuatus: 200, updatedApplication: updatedApplication });
            }
            catch (error) {
                res.status(500).json({ status: 500, error: error.message });
            }
        });
    }
    deleteApplication(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const applicationId = req.params.id;
                const result = yield this.appUseCase.deleteApplication(applicationId);
                if (result) {
                    res.status(200).json({ stauts: 200, success: result });
                }
                else {
                    res.status(404).json({ status: 404, error: "Application not found" });
                }
            }
            catch (error) {
                res.status(500).json({ status: 500, error: error.message });
            }
        });
    }
    acceptUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, postId } = req.body;
                const application = yield this.appUseCase.acceptUser(userId, postId);
                res.status(200).json({ status: 200, application: application });
            }
            catch (error) {
                res.status(500).json({ status: 500, error: error.message });
            }
        });
    }
    rejectUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, postId } = req.body;
                const application = yield this.appUseCase.rejectUser(userId, postId);
                res.status(200).json({ status: 200, application: application });
            }
            catch (error) {
                res.status(500).json({ status: 500, error: error.message });
            }
        });
    }
}
exports.ApplicationController = ApplicationController;
