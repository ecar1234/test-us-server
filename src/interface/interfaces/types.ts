
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
    data: {
        postTitle: string;
        userId?: string;
        type: string;
    }
    apns?: APNs
    token?: string;
    tokens?: string[];
}