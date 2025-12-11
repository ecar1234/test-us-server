import { FirebaseRepositoryImpl } from "../infrastructure/repositories/FirebaseRepositoryImpl";


export class FirebaseUseCase {
    constructor(private firebaseRepository: FirebaseRepositoryImpl) { }

    async createMessingToken(userId: string, fcmToken: string, deviceType: string): Promise<void> {
        await this.firebaseRepository.createMessingToken(userId, fcmToken, deviceType);
    }
    async updateMessingToken(userId: string, fcmToken: string, deviceType: string): Promise<void> {
        await this.firebaseRepository.updateMessingToken(userId, fcmToken, deviceType);
    }
    async revmoeMessingToken(userId: string, fcmToken: string): Promise<void> {
        await this.firebaseRepository.revmoeMessingToken(userId, fcmToken);

    }


}