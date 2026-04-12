import { AppDataSource } from "../../config/DataSource.js";
import { PurchaseModel } from "../../domain/entities/PurchaseModel.js";
import { IPurchaseRepository } from "../../domain/interface_repositories/IPurchaseRepository.js";
import { PurchaseEntity, PurchaseState } from "../entities/PurchaseEntity.js";
import { UserEntity } from "../entities/UserEntity.js";

export class PurchaseRepositoryImpl implements IPurchaseRepository {
    private purchaseRepo = AppDataSource.getRepository(PurchaseEntity);

    private toModel(entity: PurchaseEntity): PurchaseModel {
        return new PurchaseModel({
            id: entity.id,
            plan: entity.plan,
            productId: entity.productId,
            store: entity.store,
            isActive: entity.isActive,
            willRenew: entity.willRenew,
            state: entity.state,
            expiresAt: entity.expiresAt,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
            userId: entity.user.userId
        });
    }
    private toEntity(model: PurchaseModel, tokenOrReceipt: string): PurchaseEntity {
        
        const entity = new PurchaseEntity();
        entity.id = model.id ? model.id : null;
        entity.plan = model.plan;
        entity.productId = model.productId;
        entity.store = model.store;
        entity.isActive = model.isActive;
        entity.willRenew = model.willRenew;
        entity.expiresAt = model.expiresAt;
        entity.createdAt = model.createdAt ? model.createdAt : null;
        entity.updatedAt = model.updatedAt ? model.updatedAt : null;
        entity.user = { userId: model.userId } as UserEntity;
        entity.verificationData = tokenOrReceipt;
        return entity;
    }
    // Save & Update
    async saveSubscribe(subscribe: PurchaseModel, tokenOrReceipt: string): Promise<PurchaseModel> {
        const entity = this.toEntity(subscribe, tokenOrReceipt);
        const newSubscribes = await this.purchaseRepo.save(entity);
        
        return this.toModel(newSubscribes);
    }
    async updateSubcribe(subscribe: PurchaseModel, tokenOrReceipt: string): Promise<PurchaseModel> {
        const entity = this.toEntity(subscribe, tokenOrReceipt);
        const newSubscribes = await this.purchaseRepo.save(entity);
        
        return this.toModel(newSubscribes);
    }
    // Get subscribes histories
    async getSubscriptions(userId: string): Promise<PurchaseModel[]> {
        const subscribes = await this.purchaseRepo.find({
            where: { user: { userId: userId } },
            relations: ['user']
        });
        if (!subscribes) {
            return [];
        }
        return subscribes.map(entity => this.toModel(entity));
    }
    
    // sub api
    async getSubscribeByToken(token: string): Promise<PurchaseModel | null> {
        const subscribe = await this.purchaseRepo.findOne({
            where: { verificationData: token },
            relations: ['user']
        });
        if (!subscribe) {
            return null;
        }
        return this.toModel(subscribe);
    }
    async getIsActiveSubscription(userId: string): Promise<PurchaseModel | null> {
        const subscribe = await this.purchaseRepo.findOne({
            where: { user: { userId: userId }, isActive: true },
            relations: ['user']
        });
        if(subscribe){
            return this.toModel(subscribe);
        }
        return null;
    }
}