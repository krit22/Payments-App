import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export function authMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        res.status(401).json({
            message: "Token missing"
        });
        return;
    }

    try {
        const decoded = jwt.verify(
            authHeader,
            process.env.JWT_SECRET as string
        );

        req.body.userId = (decoded as any).userId;

        next();

    } catch (error) {
        res.status(401).json({
            message: "Invalid token"
        });
        return;
    }
}