import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export interface AuthRequest extends Request {
  user?: any;
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch {
      res.status(401).json({
        message: "Your session expired. Please sign in again.",
      });
    }
  } else {
    res.status(401).json({ message: "Please sign in to continue." });
  }
};
