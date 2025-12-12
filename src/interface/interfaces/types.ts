
export interface FCMPayload {
    notification: {
        title: string;
        body: string;
    };
    data?: {
        postId?: string;
        userId?: string;
    }
    token?: string;
    tokens?: string[];
}