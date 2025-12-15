
export interface APNs {
    headers: {
        'apns-priority': string;
    };
    payload: {
        aps: {
            alert: {
                title: string;
                body: string;
            };
            sound: string;
        };
    };
}

export interface FCMPayload {
    notification: {
        title: string;
        body: string;
    };
    data?: {
        postId?: string;
        userId?: string;
    }
    apns?: APNs
    token?: string;
    tokens?: string[];
}