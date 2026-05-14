import fs from 'fs';
import { AppStoreServerAPIClient, Environment, SignedDataVerifier } from '@apple/app-store-server-library';



export const AppleClientInit = (isProd: boolean): { client: AppStoreServerAPIClient, verifier: SignedDataVerifier } => {
    // console.log(`[Apple Client] initialize start`);
    const issuerId = process.env.APPLE_ISSUER_ID;
    const keyId = process.env.APPLE_KEY_ID;
    const bundleId = process.env.APPLE_BUNDLE_ID;
    const privateKey = fs.readFileSync(process.env.APPLE_P8_PATH!, 'utf-8');
    const environment = isProd ? Environment.PRODUCTION : Environment.SANDBOX;
    // const environment = Environment.PRODUCTION;
    const appId = Number(process.env.APPLE_APP_ID);

    // console.log(`[Apple Client] issUseId: ${issUseId}`);
    // console.log(`[Apple Client] keyId: ${keyId}`);
    // console.log(`[Apple Client] bundleId: ${bundleId}`);
    // console.log(`[Apple Client] encodeFile: ${encodeFile}`);
    // console.log(`[Apple Client] environment: ${environment}`);
    // console.log(`[Apple Client] appId: ${appId}`);
    // console.log(`[Apple Client] privateKey: ${privateKey}`);
    
    const rootCer = [
        fs.readFileSync(process.env.APPLE_CER_PATH!),
        fs.readFileSync(process.env.APPLE_CER_G2_PATH!),
        fs.readFileSync(process.env.APPLE_CER_G3_PATH!),
    ];

    const client = new AppStoreServerAPIClient(privateKey, keyId, issuerId, bundleId, environment);
    const verifier = new SignedDataVerifier(rootCer, isProd, environment, bundleId, appId);
    console.log(`[Apple Client] client: ${client ? 'OK' : 'failed'}`);
    console.log(`[Apple Client] verifier: ${verifier ? 'OK' : 'failed'}`);
    // console.log(`[Apple Client] initialize end`);

    return { client, verifier };
}