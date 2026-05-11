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
        if (!req.body) {
            req.body = {
                username: "null"
            }
        }
        req.body.userId = (decoded as any).userId;
        req.body.userId = (decoded as any).userId;

        next();

    } catch (error) {


        return res.status(401).json({
            message: "Invalid token",
            error: error
        });
    }
}