import { Request, Response, NextFunction } from "express";
import { IIosWebhookPayload } from "../../domain/entities/interface/appleTypes.js";
import * as jose from 'jose';

export const iosWebhookMiddleware = async (req: Request, res: Response, next: NextFunction) => {
   try {
     const { signedPayload } = req.body;
 
     if (!signedPayload) {
         return res.status(400).json({ status: 400, message: 'ios web hook no data found' });
     }
 
     // 1. JWT 헤더에서 x5c 추출
     const decodedHeader = jose.decodeProtectedHeader(signedPayload);
     const x5c = decodedHeader.x5c;
 
     // 2. x5c[0]을 PEM 형식의 인증서로 변환
     const certificate = `-----BEGIN CERTIFICATE-----\n${x5c[0]}\n-----END CERTIFICATE-----`;
 
     // 3. 인증서에서 공개 키(publicKey) 추출
     const publicKey = await jose.importX509(certificate, 'ES256');
 
     const { payload } = await jose.jwtVerify<IIosWebhookPayload>(signedPayload, publicKey);
     req.applePayload = payload as IIosWebhookPayload;
     next();
   } catch (error) {
    res.status(401).json({ status: 401, message: error.message });
    return;
   }

}