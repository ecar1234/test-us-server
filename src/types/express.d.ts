import { JwtPayload } from 'jsonwebtoken';
import { IIosWebhookPayload } from '../domain/entities/interface/appleTypes';

export interface AuthUserPayload extends JwtPayload {
    userId: string;
    email: string
}

declare global {
    namespace Express {
        interface Request {
            user?: AuthUserPayload;
            id?: string;
            applePayload?: IIosWebhookPayload
        }
    }
}

export {}