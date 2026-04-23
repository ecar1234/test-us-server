import { AppDataSource } from "../../../config/DataSource.js";
import { PurchaseModel } from "../../../domain/entities/PurchaseModel.js";
import { IPurchaseAosRepository } from "../../../domain/interface_repositories/Purchase/IPurchaseAosRepository.js";
import { PurchaseAosEntity } from "../../entities/PurchaseEntities/PurchaseAosEntity.js";
import { PurchaseState } from "../../entities/PurchaseEntities/PurchaseEntity.js";
import { UserEntity } from "../../entities/UserEntity.js";

export class PurchaseAosRepositoryImpl implements IPurchaseAosRepository {
    private repo = AppDataSource.getRepository(PurchaseAosEntity);

    private toModel(entity: PurchaseAosEntity): PurchaseModel {
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
    private toEntity(model: PurchaseModel, token: string, rootId?: string, prevToken?: string): PurchaseAosEntity {
        const state = this.convertState(model.state);

        const entity = this.repo.create({
            ...(model.id && { id: model.id }),
            plan: model.plan,
            productId: model.productId,
            // store: model.store,
            isActive: model.isActive,
            willRenew: model.willRenew,
            state: state,
            expiresAt: model.expiresAt,
            rootId: rootId ? rootId : token,
            purchaseToken: token,
            linkedPurchaseToken: prevToken ? prevToken : null,
            user: model.userId && { userId: model.userId } as UserEntity
        });

        return entity;
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


    async saveSubscribe(subscribe: PurchaseModel, token: string, linkedToken?: string): Promise<PurchaseModel> {
        if (linkedToken) {
            const prev = await this.repo.findOne({
                where: { purchaseToken: linkedToken }
            });
            
            const entity = this.toEntity(subscribe, token, prev.rootId, prev.purchaseToken);
            const newSubscribes = await this.repo.save(entity);
            return this.toModel(newSubscribes);
        }
        const entity = this.toEntity(subscribe, token);
        const newSubscribe = await this.repo.save(entity);
        return this.toModel(newSubscribe);
    }
    async updateSubcribe(subscribe: PurchaseModel, purchaseToken: string, linkedToken: string): Promise<PurchaseModel> {
        if (linkedToken) {
            const prev = await this.repo.findOne({
                where: { purchaseToken: linkedToken }
            });
            
            if (prev) {
                const entity = this.toEntity(subscribe, purchaseToken, prev.rootId, prev.purchaseToken);
                const saved = await this.repo.save(entity);
                return this.toModel(saved);
            }
        }
        const entity = this.toEntity(subscribe, purchaseToken);
        const update = await this.repo.save(entity);
        return this.toModel(update);
    }

    async getSubscribeByToken(token: string): Promise<PurchaseModel | null> {
        let subscribe: PurchaseAosEntity = await this.repo.findOne({
            where: { purchaseToken: token },
            relations: ['user']
        });

        if (!subscribe) {
            return null;
        }
        return this.toModel(subscribe);
    }

}