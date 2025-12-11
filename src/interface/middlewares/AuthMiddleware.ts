import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../../utils/jwt";


export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  // console.log(authHeader);

  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header is missing' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = verifyToken(token);
    req.user = decoded; // 요청 객체에 사용자 정보 추가
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};