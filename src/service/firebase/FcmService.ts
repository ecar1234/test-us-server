import { FCMPayload } from "../../interface/interfaces/types";
import { messaging } from "../../service/firebase/Firebase";

export async function sendNotificationToUser(payload: FCMPayload): Promise<object>{
    const message = {
        token: payload.token,
        notification: payload.notification,
        data: payload.data
    };
    try {
        const res = await messaging.send(message);
        console.log(res);
        return {'success': true, 'result': res};
    
    } catch (error) {
        console.log(error);
        return {'success': false, 'result': error};
    }

}

export async function sendNotificationToMultiUser(payload: FCMPayload): Promise<string[]>{
    const message = {
        tokens: payload.tokens,
        notification: payload.notification,
        data: payload.data
    }
    try {
        const res = await messaging.sendEachForMulticast(message);
        console.log(res);

        const failedToken = [];
        if(res.failureCount > 0){
            res.responses.forEach((response, index) => {
                if(!response.success){
                    failedToken.push(message.tokens[index]);
                }
            });
            console.log(failedToken);
            return failedToken;
        }
        return [];
        
    } catch (error) {

    }
}