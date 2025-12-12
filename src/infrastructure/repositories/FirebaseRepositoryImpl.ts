import { In } from "typeorm";
import { AppDataSource } from "../../config/DataSource";
import { FirebaseRepository } from "../../domain/interface_repositories/IFirebaseRepository";
import { FirebaseDeviceTokenEntity } from "../entities/FirebaseDeviceTokenEntity";


export class FirebaseRepositoryImpl implements FirebaseRepository {
    private tokenRepo = AppDataSource.getRepository(FirebaseDeviceTokenEntity);

    async createMessingToken(userId: string, fcmToken: string, deviceType: string): Promise<void> {
        const findToken = await this.tokenRepo.findOne({
            where: {
                user: { userId },
                token: fcmToken
            }
        });
        if (findToken) {
            throw new Error('Token already exists');
        }
        const newToken = this.tokenRepo.create();
        newToken.token = fcmToken;
        newToken.deviceType = deviceType;
        await this.tokenRepo.save({ ...newToken, user: { userId: userId } });
        return;
    }
    async updateMessingToken(userId: string, fcmToken: string, deviceType: string): Promise<void> {
        const findToken = await this.tokenRepo.findOne({
            where: {
                user: { userId },
                token: fcmToken
            }
        });
        if (!findToken) {
            throw new Error('Token not found');
        }
        findToken.deviceType = deviceType;
        this.tokenRepo.save(findToken);
        return;
    }
    async revmoeMessingToken(userId: string, fcmToken: string): Promise<void> {
        const findToken = await this.tokenRepo.delete({
            user: { userId },
            token: fcmToken
        });
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
    async getMessingToken(userId: string): Promise<string> {
        const findToken = await this.tokenRepo.findOne({
            where: {
                user: { userId }
            }
        });
        if (!findToken) {
            throw new Error('Token not found');
        }
        return findToken.token;
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