import { EntityManager } from "typeorm";
import { AppDataSource } from "../../../config/DataSource.js";
import { PurchaseModel } from "../../../domain/entities/PurchaseModel.js";
import { IPurchaseIosRepository } from "../../../domain/interface_repositories/Purchase/IPurchaseIosRepository.js";
import { PurchaseState } from "../../entities/PurchaseEntities/PurchaseEntity.js";
import { PurchaseIosEntity } from "../../entities/PurchaseEntities/PurchaseIosEntity.js";

export class PurchaseIosRepositoryImpl implements IPurchaseIosRepository {

    private repo = AppDataSource.getRepository(PurchaseIosEntity);

    private toEntity(model: PurchaseModel, transactionId: string, originalId?: string): PurchaseIosEntity {
        const state = this.convertState(model.state);

        const entity = this.repo.create({
            ...(model.id && { id: model.id }),
            plan: model.plan,
            productId: model.productId,
            isActive: model.isActive,
            willRenew: model.willRenew,
            state: state,
            expiresAt: model.expiresAt,
            transactionId: transactionId,
            ...(originalId && { originalTransactionId: originalId }),
            user: model.userId && { userId: model.userId }
        });
        return entity;
    }
    private toModel(entity: PurchaseIosEntity): PurchaseModel {
        const state = this.convertStateToString(entity.state);
        return new PurchaseModel({
            id: entity.id,
            plan: entity.plan,
            productId: entity.productId,
            store: 'app-store',
            isActive: entity.isActive,
            willRenew: entity.willRenew,
            state: state,
            expiresAt: entity.expiresAt,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
            userId: entity.user?.userId ?? (entity as any).userId
        });
    }
    private convertState(state: string): PurchaseState {
        switch (state) {
            case 'purchased':
                return PurchaseState.PURCHASED;
            case 'canceled':
                return PurchaseState.CANCELED;
            case 'expired':
                return PurchaseState.EXPIRED;
            case 'renew':
                return PurchaseState.RENEW;
            case 'refund':
                return PurchaseState.REFUND;
            default:
                return PurchaseState.PURCHASED;
        }
    }
    private convertStateToString(state: PurchaseState): string {
        switch (state) {
            case PurchaseState.PURCHASED:
                return 'purchased';
            case PurchaseState.CANCELED:
                return 'canceled';
            case PurchaseState.EXPIRED:
                return 'expired';
            case PurchaseState.RENEW:
                return 'renewe';
            case PurchaseState.REFUND:
                return 'refund';
            default:
                return 'purchased';
        }

    }


    async saveSubscribe(subscribe: PurchaseModel, transactionId: string, originalId: string, manager?: EntityManager): Promise<PurchaseModel> {
        const repo = manager ? manager.getRepository(PurchaseIosEntity) : this.repo;
        const entity = this.toEntity(subscribe, transactionId, originalId);
        const newSubscribes = await repo.save(entity);
        return this.toModel(newSubscribes);
    }
    async updateSubcribe(subscribe: PurchaseModel, transactionId: string, originalId: string, manager?: EntityManager):Promise<PurchaseModel> {
        const repository = manager ? manager.getRepository(PurchaseIosEntity) : this.repo;
        const entity = await this.toEntity(subscribe, originalId, transactionId);
        const updateSubscribe = await repository.save(entity);
        return this.toModel(updateSubscribe);
    }
    async getSubscriptionByTransactionId(transactionId: string): Promise<PurchaseModel | null> {
        const product = await this.repo.findOne({
            where: { transactionId: transactionId },
            relations: ['user']
        });
        if (!product) {
            return null;
        }
        return this.toModel(product);
    }
    async getCurrentActiveSubscriptionByOriginalId(originalId: string, manager?: EntityManager): Promise<PurchaseModel | null> {
        const repo = manager ? manager.getRepository(PurchaseIosEntity) : this.repo;
       const product = await repo.findOne({
        where: { originalTransactionId: originalId, isActive: true },
        relations: ['user']
       });
       if(!product){
        return null;
       }
       return this.toModel(product);
    }
}