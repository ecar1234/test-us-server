

export interface FirebaseRepository {
    createMessingToken(userId: string, fcmToken: string, deviceType: string): Promise<void>;
    updateMessingToken(userId: string, fcmToken: string, deviceType: string): Promise<void>;
    revmoeMessingToken(userId: string, fcmToken: string): Promise<void>;
}