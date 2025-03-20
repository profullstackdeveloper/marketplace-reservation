import HttpStatusCodes from '@src/common/HttpStatusCodes';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticate = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).json({ error: 'Authorization header missing' });
    } else {
        const token = authHeader.split(' ')[1];
        if (!token) {
            res.status(401).json({ error: 'Token missing' });
        } else {
            try {
                const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret');
                (req as any).user = payload;
                next();
            } catch (error) {
                res.status(401).json({ error: 'Invalid token' });
            }
        }
    }
};

export const roleGuard = (req: Request, res: Response, next: NextFunction) => {
    const adminKey = req.headers["X-ADMIN-KEY"];
    if (adminKey && adminKey === process.env.X_ADMIN_KEY) {
        next();
    } else {
        res.status(HttpStatusCodes.FORBIDDEN).json({ error: 'Invalid access!' });
    }
}