import { Request, Response, NextFunction } from 'express';

const jwt = require('jsonwebtoken');

interface JwtPayload {
    userId: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload | undefined;
        }
    }
}

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.JWT_SECRET as string, (err: any, decoded: JwtPayload) => {
            if (err) {
                return res.sendStatus(403); // Forbidden
            }

            req.user = decoded as JwtPayload;
            next();
        });
    } else {
        res.sendStatus(401); // Unauthorized
    }
};

export default verifyToken;