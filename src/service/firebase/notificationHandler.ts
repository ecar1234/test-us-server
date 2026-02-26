import { MessageModel } from "../../domain/entities/MessagesModels/MessageModel";
import { FirebaseDeviceTokenEntity } from "../../infrastructure/entities/FirebaseDeviceTokenEntity";
import { FCMPayload } from "../../interface/interfaces/types";
import { sendNotificationToUser } from "./FcmService";


export const notificationHandler = async (token: FirebaseDeviceTokenEntity, message: MessageModel): Promise<void> => {
    const fcmPayload: FCMPayload = {
        token: token.token,
        notification: {
            title: '새로운 메시지',
            body: `${message.sender.nickname}이 메시지를 보냈습니다.`
        },
        data: {
            type: 'chat',
            roomId: message.roomId.toString(),
            title: `${message.sender.nickname}님 메시지`
        }
    };
    if (token.deviceType === 'ios') {
        fcmPayload['apns'] = {
            headers: {
                'apns-priority': '10'
            },
            payload: {
                aps: {
                    alert: {
                        title: '새로운 메시지',
                        body: `${message.sender.nickname}이 메시지를 보냈습니다.`
                        // sound: 'default'
                    },
                    sound: 'default'
                }
            }
        };
    }
    console.log('[FCM] set payload completed');
    await sendNotificationToUser(fcmPayload, token.user.userId);
};

export const expiredPostNotificationHandler = async (token: FirebaseDeviceTokenEntity, postTitle: string, type: string): Promise<void> => {
    const title = type === 'recruit'
        ? `${postTitle}의 게시가 종료되었습니다. 테스트 종료 후 테트터들에게 리뷰를 남겨주세요.`
        : `${postTitle}의 게시가 종료되었습니다. 새로운 홍보글을 작성해 보세요.`
    const fcmPayload: FCMPayload = {
        token: token.token,
        notification: {
            title: 'TESTUS',
            body: `${postTitle}의 게시가 종료되었습니다.`
        },
        data: {
            type: type,
            title: title
        }
    };
    if (token.deviceType === 'ios') {
        fcmPayload['apns'] = {
            headers: {
                'apns-priority': '10'
            },
            payload: {
                aps: {
                    alert: {
                        title: 'TESTUS',
                        body: `${postTitle}의 게시가 종료되었습니다.`
                        // sound: 'default'
                    },
                    sound: 'default'
                }
            }
        }
    }
    await sendNotificationToUser(fcmPayload, token.user.userId);
}