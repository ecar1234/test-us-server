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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationRepositoryImpl = void 0;
const ApplicationEntity_1 = require("../entities/ApplicationEntity");
const DataSource_1 = require("../../config/DataSource");
const ApplicationModel_1 = require("../../domain/entities/ApplicationModel");
const http_errors_1 = __importDefault(require("http-errors"));
class ApplicationRepositoryImpl {
    constructor() {
        this.applicationRepository = DataSource_1.AppDataSource.getRepository(ApplicationEntity_1.ApplicationEntity);
    }
    toDomainApplication(applicationEntity) {
        return new ApplicationModel_1.ApplicationModel(applicationEntity.appId, applicationEntity.platform === ApplicationEntity_1.ApplicationsPlatform.WEB ? 'web' : (applicationEntity.platform === ApplicationEntity_1.ApplicationsPlatform.IOS ? 'ios' : 'android'), applicationEntity.status === ApplicationEntity_1.ApplicationStatus.PENDING ? 'pending' :
            (applicationEntity.status === ApplicationEntity_1.ApplicationStatus.ACCEPTED ? 'accepted' :
                (applicationEntity.status === ApplicationEntity_1.ApplicationStatus.REJECTED ? 'rejected' : 'cancel')), applicationEntity.appliedAt, applicationEntity.updatedAt, applicationEntity.post.postId, applicationEntity.applicant.userId);
    }
    toEntityApplication(application) {
        return this.applicationRepository.create(Object.assign(Object.assign({}, (application.id && { appId: application.id })), { platform: application.platform === 'web' ? ApplicationEntity_1.ApplicationsPlatform.WEB : (application.platform === 'ios' ? ApplicationEntity_1.ApplicationsPlatform.IOS : ApplicationEntity_1.ApplicationsPlatform.ANDROID), status: application.status === 'pending' ? ApplicationEntity_1.ApplicationStatus.PENDING :
                (application.status === 'accepted' ? ApplicationEntity_1.ApplicationStatus.ACCEPTED :
                    (ApplicationEntity_1.ApplicationStatus.REJECTED ? ApplicationEntity_1.ApplicationStatus.REJECTED : ApplicationEntity_1.ApplicationStatus.CANCEL)), post: { postId: application.postId }, applicant: { userId: application.applicantId } }));
    }
    create(application) {
        return __awaiter(this, void 0, void 0, function* () {
            const entity = yield this.applicationRepository.findOne({ where: { post: { postId: application.postId }, applicant: { userId: application.applicantId } }, relations: ['post', 'applicant'] });
            if (entity) {
                throw (0, http_errors_1.default)(409, "Application already exists");
            }
            const appEntity = this.toEntityApplication(application);
            const savedEntity = yield this.applicationRepository.save(appEntity);
            return this.toDomainApplication(savedEntity);
        });
    }
    update(application) {
        return __awaiter(this, void 0, void 0, function* () {
            const entity = yield this.applicationRepository.findOne({ where: { post: { postId: application.postId }, applicant: { userId: application.applicantId } }, relations: ['post', 'applicant'] });
            entity.platform = application.platform === 'web' ? ApplicationEntity_1.ApplicationsPlatform.WEB : (application.platform === 'ios' ? ApplicationEntity_1.ApplicationsPlatform.IOS : ApplicationEntity_1.ApplicationsPlatform.ANDROID);
            entity.status = application.status === 'pending' ? ApplicationEntity_1.ApplicationStatus.PENDING :
                (application.status === 'accepted' ? ApplicationEntity_1.ApplicationStatus.ACCEPTED :
                    (application.status === 'rejected' ? ApplicationEntity_1.ApplicationStatus.REJECTED : ApplicationEntity_1.ApplicationStatus.CANCEL));
            yield this.applicationRepository.save(entity);
            return this.toDomainApplication(entity);
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.applicationRepository.delete(id).then(result => {
                if (result.affected === 0) {
                    throw new Error(`Application with id ${id} not found`);
                }
                return true;
            });
        });
    }
    acceptUser(userId, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.applicationRepository.findOne({
                where: {
                    applicant: { userId },
                    post: { postId },
                    status: ApplicationEntity_1.ApplicationStatus.PENDING
                },
                relations: ['applicant', 'post', 'reviews']
            }).then(applicationEntity => {
                if (!applicationEntity) {
                    throw new Error(`Application not found for user ${userId} and post ${postId}`);
                }
                applicationEntity.status = ApplicationEntity_1.ApplicationStatus.ACCEPTED;
                return this.applicationRepository.save(applicationEntity).then(savedEntity => {
                    return this.toDomainApplication(savedEntity);
                });
            });
        });
    }
    rejectUser(userId, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.applicationRepository.findOne({
                where: {
                    applicant: { userId },
                    post: { postId },
                    status: ApplicationEntity_1.ApplicationStatus.PENDING
                },
                relations: ['applicant', 'post', 'reviews']
            }).then(applicationEntity => {
                if (!applicationEntity) {
                    throw new Error(`Application not found for user ${userId} and post ${postId}`);
                }
                applicationEntity.status = ApplicationEntity_1.ApplicationStatus.REJECTED;
                return this.applicationRepository.save(applicationEntity).then(savedEntity => {
                    return this.toDomainApplication(savedEntity);
                });
            });
        });
    }
}
exports.ApplicationRepositoryImpl = ApplicationRepositoryImpl;
