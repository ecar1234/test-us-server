
import { Server, Socket } from "socket.io";
import { FirebaseRepositoryImpl } from "../../../infrastructure/repositories/FirebaseRepositoryImpl";
import { sendNotificationToUser } from "../../firebase/FcmService";
import { FCMPayload } from "../../../interface/interfaces/types";
import { MessageModel } from "../../../domain/entities/MessagesModels/MessageModel";
import { FirebaseDeviceTokenEntity } from "../../../infrastructure/entities/FirebaseDeviceTokenEntity";

export const notificationHandler = async(token: FirebaseDeviceTokenEntity, message: MessageModel):Promise<void> => {
    const fcmPayload = {
        token: token.token,
        notification: {
            title: '새로운 메시지',
            body: `${message.sender.nickname}이 메시지를 보냈습니다.`
        },
        data: {
            type: 'chat',
            roomId: message.roomId.toString(),
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