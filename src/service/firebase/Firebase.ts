import * as admin from 'firebase-admin';
import { FirebaseEnv } from '../../config/env';
import path from 'path';


const firebaseKeyPath = path.join(process.cwd(), FirebaseEnv.FIREBASE_ADMIN_ACCOUNT);
const serviceAccount = require(firebaseKeyPath);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

export const messaging = admin.messaging();

console.log("Firebase Admin SDK 초기화 완료");

