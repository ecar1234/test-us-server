import { FirebaseRepositoryImpl } from "../../infrastructure/repositories/FirebaseRepositoryImpl";
import { FCMPayload } from "../../interface/interfaces/types";
import { messaging } from "../../service/firebase/Firebase";

export async function sendNotificationToUser(payload: FCMPayload, targetId: string): Promise<object> {
    const message = {
        token: payload.token,
        notification: payload.notification,
        data: payload.data,
        apns: payload.apns ? payload.apns : undefined
    };
    try {
        const res = await messaging.send(message);
        console.log(`FCM send success : ${res}`);
        return { 'success': true, 'result': res };

    } catch (error) {
        console.log(error);
        if (error.code === 'messaging/registration-token-not-registered') {
            console.log('❌ Invalid FCM token. Removing from DB');
            const fmcRepo = new FirebaseRepositoryImpl();
    
            await fmcRepo.revmoeMessingToken(targetId);
            console.log('FCM token removed from DB');
        }
        return { 'success': false, 'result': error };
    }
}

export async function sendNotificationToMultiUser(payload: FCMPayload): Promise<string[] | undefined> {
    const message = {
        tokens: payload.tokens,
        notification: payload.notification,
        data: payload.data
    }
    try {
        const res = await messaging.sendEachForMulticast(message);
        console.log(`FCM multi cast end success : ${res}`);

        const failedTokens: string[] = [];
        if (res.failureCount > 0) {
            res.responses.forEach((response, index) => {
                if (!response.success) {
                    const failedToken = message.tokens[index];
                    failedTokens.push(failedToken);
                    // 'messaging/registration-token-not-registered' 에러 코드를 확인하여,
                    // 데이터베이스에서 해당 토큰을 삭제하는 로직을 여기에 추가하는 것이 좋습니다.
                    // 예: if (response.error?.code === 'messaging/registration-token-not-registered') {
                    //      await deleteTokenFromDB(failedToken);
                    // }
                }
            });
            console.log("Failed tokens:", failedTokens);
            return failedTokens;
        }
        return [];
    } catch (error) {
        console.log("Error sending multicast message:", error);
        return undefined; // 또는 오류 상황에 맞는 다른 값을 반환합니다.
    }
}