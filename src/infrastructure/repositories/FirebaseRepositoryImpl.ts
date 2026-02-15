import { In } from "typeorm";
import { AppDataSource } from "../../config/DataSource";
import { FirebaseRepository } from "../../domain/interface_repositories/IFirebaseRepository";
import { FirebaseDeviceTokenEntity } from "../entities/FirebaseDeviceTokenEntity";


export class FirebaseRepositoryImpl implements FirebaseRepository {
    private tokenRepo = AppDataSource.getRepository(FirebaseDeviceTokenEntity);

    async createMessingToken(userId: string, fcmToken: string, deviceType: string): Promise<void> {
        const newToken = this.tokenRepo.create({
            user: { userId },
            token: fcmToken,
            deviceType: deviceType
        });
        await this.tokenRepo.save(newToken);
        return;
    }
    async updateMessingToken(userId: string, fcmToken: string, deviceType: string): Promise<void> {
        const findToken = await this.tokenRepo.findOne({
            where: {
                user: { userId },
            }
        });
        if (!findToken) {
            throw new Error('Token not found');
        }
        findToken.deviceType = deviceType;
        if (findToken.token !== fcmToken) {
            findToken.token = fcmToken;
        }

        this.tokenRepo.save(findToken);
        return;
    }
    async revmoeMessingToken(userId: string): Promise<void> {
        const findToken = await this.tokenRepo.createQueryBuilder()
            .delete()
            .where("userId = :userId", { userId })
            .execute();
        if (findToken.affected === 0) {
            throw new Error('Token not found');
        }
        return;
    }
    async revmoeMessingTokens(fcmTokens: string[]): Promise<void> {
        const findToken = await this.tokenRepo.delete({
            token: In(fcmTokens)
        });
        if (findToken.affected === 0) {
            throw new Error('Token not found');
        }
        return;
    }
    async getMessingToken(userId: string): Promise<FirebaseDeviceTokenEntity> {
        const findToken = await this.tokenRepo.findOne({
            where: {
                user: { userId }
            },
            relations: ['user']
        });
        if (!findToken) {
            return new FirebaseDeviceTokenEntity();
        }
        return findToken;
    }

    async getMessingTokens(ids: string[]): Promise<string[]> {
        const findTokens = await this.tokenRepo.find({
            where: {
                user: { userId: In(ids) }
            }
        });
        if (!findTokens) {
            throw new Error('Token not found');
        }
        return findTokens.map(token => token.token);
    }
}