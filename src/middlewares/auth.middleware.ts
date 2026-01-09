import { Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { AuthRequest } from "../interfaces/auth.interface";

export const authenticateUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = (req.headers['token'] || req.cookies?.token) as string;

    if (!token) {
      return res.status(401).json({
        status: false,
        message: "Unauthorized user. Please login first",
      });
    }

    const decodeToken: any = await verifyToken(token);

    if (!decodeToken) {
      return res.status(401).json({
        status: false,
        message: "Invalid or expired token. Please log in again.",
      });
    }

    req.user = {
      _id: decodeToken._id,
      email: decodeToken.email,
      role: decodeToken.role,
    };

    next();
  } catch (e: any) {
    return res.status(401).json({
      status: false,
      message: "Authentication failed",
      error: e.message,
    });
  }
};