import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { Loan } from '../models/Loan';
import { runBRE } from '../utils/bre';
import { ErrorHandler } from '../middlewares/errorMiddleware';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

export const updatePersonalDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { pan, dob, monthlySalary, employmentMode } = req.body;

        if (!pan || !dob || !monthlySalary || !employmentMode) {
            return next(new ErrorHandler('All fields are required', 400));
        }

        const user = await User.findById(req.user?._id);
        if (!user) {
            return next(new ErrorHandler('User not found', 404));
        }

        user.personalDetails = { pan, dob, monthlySalary, employmentMode };
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Personal details updated successfully',
            data: user.personalDetails
        });
    } catch (error) {
        next(error);
    }
};

export const uploadSalarySlip = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.file) {
            return next(new ErrorHandler('Please upload a salary slip', 400));
        }

        // Configure cloudinary (ideally in app.ts, but safe here too)
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        });

        // Upload to cloudinary
        const cloudinaryResponse = await cloudinary.uploader.upload(req.file.path, {
            folder: 'lms_assignment_slips'
        });

        // Delete the local file after upload
        fs.unlinkSync(req.file.path);

        res.status(200).json({
            success: true,
            message: 'Salary slip uploaded successfully to Cloudinary',
            data: { salarySlipUrl: cloudinaryResponse.secure_url }
        });
    } catch (error) {
        next(error);
    }
};

export const applyForLoan = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { loanAmount, tenure, salarySlipUrl } = req.body;

        if (!loanAmount || !tenure || !salarySlipUrl) {
            return next(new ErrorHandler('Loan amount, tenure, and salary slip are required', 400));
        }

        const user = await User.findById(req.user?._id);
        if (!user) {
            return next(new ErrorHandler('User not found', 404));
        }

        // Check if there is an active application
        const existingLoan = await Loan.findOne({
            borrowerId: user._id,
            status: { $in: ['Applied', 'Sanctioned', 'Disbursed'] }
        });

        if (existingLoan) {
            return next(new ErrorHandler('You already have an active loan application', 400));
        }

        // Run BRE
        const breResult = runBRE(user);
        if (!breResult.passed) {
            return res.status(422).json({
                success: false,
                message: 'Loan application rejected by Business Rules Engine',
                data: { errors: breResult.errors }
            });
        }

        const interestRate = 12; // Fixed 12%
        const parsedLoanAmount = Number(loanAmount);
        const parsedTenure = Number(tenure);
        
        // Simple Interest = (P * R * T) / 100 , T is in years. tenure is in months.
        const timeInYears = parsedTenure / 12;
        const simpleInterest = (parsedLoanAmount * interestRate * timeInYears) / 100;
        const totalRepayment = parsedLoanAmount + simpleInterest;

        const loan = await Loan.create({
            borrowerId: user._id,
            loanAmount: parsedLoanAmount,
            tenure: parsedTenure,
            salarySlipUrl,
            interestRate,
            simpleInterest,
            totalRepayment
        });

        res.status(201).json({
            success: true,
            message: 'Loan application submitted successfully',
            data: loan
        });
    } catch (error) {
        next(error);
    }
};

export const getLoanStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const loan = await Loan.findOne({ borrowerId: req.user?._id }).sort({ createdAt: -1 });

        if (!loan) {
            return next(new ErrorHandler('No loan application found', 404));
        }

        res.status(200).json({
            success: true,
            data: loan
        });
    } catch (error) {
        next(error);
    }
};
