import { JwtPayload } from 'jsonwebtoken';
import { IIosWebhookPayload } from '../domain/entities/interface/appleTypes';

declare global {
    namespace Express {
        interface Request {
            user?: string | JwtPayload;
            id?: string;
            applePayload?: IIosWebhookPayload
        }
    }
}

export {}