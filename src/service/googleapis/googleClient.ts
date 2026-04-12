
import { androidpublisher_v3, google } from 'googleapis';



let androidpublisher:androidpublisher_v3.Androidpublisher;

export const getAndroidPublisher = async () => {
    if (!androidpublisher) {
        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: process.env.GOOGLE_CLIENT_EMAIL,
                private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n')
            },
            scopes: ['https://www.googleapis.com/auth/androidpublisher']
        });
        androidpublisher = google.androidpublisher({
            version: 'v3',
            auth: auth
        });
        console.log('[google auth] set new publisher');
    }
    console.log('[google auth] get publisher success');
    return androidpublisher;
}