import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';
import { ErrorHandler } from './errorMiddleware';

interface DecodedToken {
    id: string;
    role: string;
    iat: number;
    exp: number;
}

declare global {
    namespace Express {
        interface Request {
            user?: IUser;
        }
    }
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return next(new ErrorHandler('Not authorized to access this route', 401));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'my_super_secret_key') as DecodedToken;

        const user = await User.findById(decoded.id);
        if (!user) {
            return next(new ErrorHandler('No user found with this id', 404));
        }

        req.user = user;
        next();
    } catch (error) {
        return next(new ErrorHandler('Not authorized to access this route', 401));
    }
};

export const authorize = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return next(new ErrorHandler('Not authorized', 401));
        }

        if (!roles.includes(req.user.role) && req.user.role !== 'Admin') {
            return next(new ErrorHandler(`User role ${req.user.role} is not authorized to access this route`, 403));
        }
        next();
    };
};
