import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';
import { ErrorHandler } from '../middlewares/errorMiddleware';

const generateToken = (id: string, role: string) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET || 'my_super_secret_key', {
        expiresIn: (process.env.JWT_EXPIRES || '30d') as any,
    });
};

const sendTokenResponse = (user: any, statusCode: number, res: Response, message: string) => {
    const token = generateToken(String(user._id), user.role);

    const cookieExpireDays = parseInt(process.env.COOKIE_EXPIRE || '30', 10);
    const options = {
        expires: new Date(Date.now() + cookieExpireDays * 24 * 60 * 60 * 1000),
        httpOnly: true,
    };

    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        message,
        token,
        data: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            personalDetails: user.personalDetails
        }
    });
};

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password || !role) {
            return next(new ErrorHandler('Please provide all required fields', 400));
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return next(new ErrorHandler('User already exists', 400));
        }

        const user = await User.create({
            name,
            email,
            password,
            role
        });

        sendTokenResponse(user, 201, res, 'User registered successfully');
    } catch (error) {
        next(error);
    }
};

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new ErrorHandler('Please provide an email and password', 400));
        }

        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return next(new ErrorHandler('Invalid credentials', 401));
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return next(new ErrorHandler('Invalid credentials', 401));
        }

        sendTokenResponse(user, 200, res, 'Login successful');
    } catch (error) {
        next(error);
    }
};

export const getUserProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(req.user?._id);
        if (!user) {
            return next(new ErrorHandler('User not found', 404));
        }
        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
};
