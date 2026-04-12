import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../../utils/jwt.js";


export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  // console.log(authHeader);

  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header is missing' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = verifyToken(token);
    req.user = decoded; 
    next();
  } catch (error) {
    if (error.message === 'jwt expired') {
      return res.status(401).json({ message: 'Token expired', code: 'TOKEN_EXPIRED' });
    }
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};