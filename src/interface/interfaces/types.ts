
export interface FCMPayload {
    notification: {
        title: string;
        body: string;
    };
    data?: {
        postId: string;
    }
    token?: string;
    tokens?: string[];
}