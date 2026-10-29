import { FirebaseDeviceTokenEntity } from "../infrastructure/entities/FirebaseDeviceTokenEntity.js";
import { APNs, FCMPayload } from "../interface/interfaces/types.js";

export const getAndroidMessage = (token: FirebaseDeviceTokenEntity, title: string, content: string, type: string, postTitle: string, targetId: string): FCMPayload => {
    // const content = `${postTitle}에 새로운 신청이 등록 됐습니다.\n신청관리에서 확인해 주세요.`;
    const message: FCMPayload = {
        token: token.token,
        notification: {
            title: title,
            body: content
        },
        data: {
            type: type,
            title: postTitle,
            userId: targetId
        },
    };
    return message;
}

export const getIosMessage = (token: FirebaseDeviceTokenEntity, title: string, content: string, type: string, postTitle: string, targetId: string): FCMPayload => {
    // const content = `${postTitle}에 새로운 신청이 등록 됐습니다.\n신청관리에서 확인해 주세요.`;
    const message: FCMPayload = {
        token: token.token,
        notification: {
            title: title,
            body: content
        },
        data: {
            type: type,
            title: postTitle,
            userId: targetId
        },
        apns: {
            headers: {
                'apns-priority': '10'
            },
            payload: {
                aps: {
                    alert: {
                        title: "TESTUS",
                        body: content
                    },
                    sound: 'default',
                }
            }
        }
    };
    return message;
}