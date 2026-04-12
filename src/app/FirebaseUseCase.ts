import { FirebaseRepositoryImpl } from "../infrastructure/repositories/FirebaseRepositoryImpl.js";


export class FirebaseUseCase {
    constructor(private firebaseRepository: FirebaseRepositoryImpl) { }

    async createMessingToken(userId: string, fcmToken: string, deviceType: string): Promise<void> {
        const token = await this.firebaseRepository.getMessingToken(userId);
        if (token) {
            await this.firebaseRepository.updateMessingToken(userId, fcmToken, deviceType);
            return;
        }

        await this.firebaseRepository.createMessingToken(userId, fcmToken, deviceType);
        return;
    }
    async updateMessingToken(userId: string, fcmToken: string, deviceType: string): Promise<void> {
        await this.firebaseRepository.updateMessingToken(userId, fcmToken, deviceType);
    }
    async revmoeMessingToken(userId: string): Promise<void> {
        await this.firebaseRepository.revmoeMessingToken(userId);

    }


}