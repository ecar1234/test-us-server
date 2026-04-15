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
    private toEntity(model: PurchaseModel, token: string, rootId?: string): PurchaseAosEntity {
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
            linkedPurchaseToken: '',
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
            case 'renewe':
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
                where: { linkedPurchaseToken: linkedToken }
            });
            const entity = this.toEntity(subscribe, token, prev.rootId);
            const newSubscribes = await this.repo.save(entity);
            return this.toModel(newSubscribes);
        }
        const entity = this.toEntity(subscribe, token, null);
        const newSubscribe = await this.repo.save(entity);
        return this.toModel(newSubscribe);
    }
    async updateSubcribe(subscribe: PurchaseModel, linkedToken?: string): Promise<PurchaseModel> {
        const product = await this.repo.findOne({
            where: { purchaseToken: linkedToken },
            relations: ['user']
        });
        if (!product) {
            throw new Error('Product not found');
        }

        product.isActive = subscribe.isActive;
        product.willRenew = subscribe.willRenew;
        product.state = this.convertState(subscribe.state);

        const updateSubscribe = await this.repo.save(product);
        return this.toModel(updateSubscribe);
    }

    async getSubscribeByToken(token: string): Promise<PurchaseModel | null> {
        const subscribe = await this.repo.findOne({
            where: { purchaseToken: token },
            relations: ['user']
        });
        if (!subscribe) {
            return null;
        }
        return this.toModel(subscribe);
    }

}