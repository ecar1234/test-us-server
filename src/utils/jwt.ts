import { Env } from "../config/env.js";
import jwt  from "jsonwebtoken";
import { UserModel } from "../domain/entities/UserModel.js";

const JWT_SECRET = Env.JWT_SECRET;
const { sign, verify, decode } = jwt;

export function generateToken (user: UserModel): string {
    const payload = {
        userId: user.userId,
        email: user.email,
    };

    return sign(payload, JWT_SECRET, { expiresIn: '30d' });
}

export function verifyToken(token: string): any {
    try {
        const decoded = verify(token, JWT_SECRET);
        return decoded;
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new Error('jwt expired');
        }
        throw new Error('Invalid or expired token');
    }
}

export function decodeToken(token: string): any {
    try {
        const decoded = decode(token);
        return decoded;
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
}