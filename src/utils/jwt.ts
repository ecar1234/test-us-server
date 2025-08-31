import { Env } from "../config/env";
import * as jwt from "jsonwebtoken";
import { UserModel } from "../domain/entities/UserModel";

const JWT_SECRET = Env.JWT_SECRET;

export function generateToken (user: UserModel): string {
    const payload = {
        userId: user.userId,
        email: user.email,
    };


    return jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' });
}

export function verifyToken(token: string): any {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
}