import fs from 'fs';
import { AppStoreServerAPIClient, Environment, SignedDataVerifier } from '@apple/app-store-server-library';



export const AppleClientInit = (isProd: boolean): { client: AppStoreServerAPIClient, verifer: SignedDataVerifier } => {
    const issUseId = process.env.APPLE_ISSUSEID;
    const keyId = process.env.APPLE_KEY_ID;
    const bundleId = process.env.APPLE_BUNDLE_ID;
    const encodeFile = fs.readFileSync(process.env.APPLE_P8_PATH!, 'utf-8');
    const environment = isProd ? Environment.PRODUCTION : Environment.SANDBOX;
    const appId = Number(process.env.APPLE_APP_ID);

    const rootCer = [
        fs.readFileSync(process.env.APPLE_CER_PATH!),
        fs.readFileSync(process.env.APPLE_CER_G2_PATH!),
        fs.readFileSync(process.env.APPLE_CER_G3_PATH!),
    ];

    const client = new AppStoreServerAPIClient(encodeFile, keyId, issUseId, bundleId, environment);
    const verifer = new SignedDataVerifier(rootCer, isProd, environment, bundleId, appId);

    return { client, verifer };
}