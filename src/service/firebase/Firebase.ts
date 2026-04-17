import admin from 'firebase-admin';
import { FirebaseEnv } from '../../config/env.js';
import path from 'path';
import { readFileSync } from 'fs';


const firebaseKeyPath = path.join(process.cwd(), FirebaseEnv.FIREBASE_ADMIN_ACCOUNT);
const serviceAccount = JSON.parse(readFileSync(firebaseKeyPath, 'utf-8'));

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

export const messaging = admin.messaging();

console.log("Firebase Admin SDK 초기화 완료");

