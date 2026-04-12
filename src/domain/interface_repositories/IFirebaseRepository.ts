import { FirebaseDeviceTokenEntity } from "../../infrastructure/entities/FirebaseDeviceTokenEntity.js";


export interface FirebaseRepository {
    createMessingToken(userId: string, fcmToken: string, deviceType: string): Promise<void>;
    updateMessingToken(userId: string, fcmToken: string, deviceType: string): Promise<void>;
    revmoeMessingToken(userId: string): Promise<void>;
    getMessingToken(userId: string, deviceType: string): Promise<FirebaseDeviceTokenEntity>
    getMessingTokens(ids: string[]): Promise<string[]>
}