import { Request, Response, NextFunction } from 'express';
import { Loan } from '../models/Loan';
import { ErrorHandler } from '../middlewares/errorMiddleware';

export const getLoansByStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { status } = req.query;
        let query = {};
        if (status) {
            query = { status };
        }
        
        // RBAC filtering if needed based on role
        if (req.user?.role === 'Sales') query = { status: 'Applied' };
        if (req.user?.role === 'Sanction') query = { status: 'Applied' }; // Or Sanctioned
        if (req.user?.role === 'Disbursement') query = { status: 'Sanctioned' };
        if (req.user?.role === 'Collection') query = { status: 'Disbursed' };

        const loans = await Loan.find(query).populate('borrowerId', 'name email personalDetails');

        res.status(200).json({
            success: true,
            data: loans
        });
    } catch (error) {
        next(error);
    }
};

export const updateLoanStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const loan = await Loan.findById(id);
        if (!loan) {
            return next(new ErrorHandler('Loan not found', 404));
        }

        // Add basic RBAC checks
        if (req.user?.role === 'Sales' && status !== 'Rejected') {
            // Sales can maybe only reject or recommend? Let's say they can move to Sanctioned
        }

        loan.status = status;
        await loan.save();

        res.status(200).json({
            success: true,
            message: `Loan status updated to ${status}`,
            data: loan
        });
    } catch (error) {
        next(error);
    }
};

export const recordPayment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { utr, amount, date } = req.body;

        if (!utr || !amount) {
            return next(new ErrorHandler('UTR and amount are required', 400));
        }

        const loan = await Loan.findById(id);
        if (!loan) {
            return next(new ErrorHandler('Loan not found', 404));
        }

        if (loan.status !== 'Disbursed') {
            return next(new ErrorHandler('Can only record payments for disbursed loans', 400));
        }

        // Check unique UTR
        const utrExists = loan.payments.find(p => p.utr === utr);
        if (utrExists) {
            return next(new ErrorHandler('Payment with this UTR already recorded', 400));
        }

        loan.payments.push({
            utr,
            amount: Number(amount),
            date: date ? new Date(date) : new Date()
        });

        loan.amountPaid += Number(amount);

        if (loan.amountPaid >= loan.totalRepayment) {
            loan.status = 'Closed';
        }

        await loan.save();

        res.status(200).json({
            success: true,
            message: 'Payment recorded successfully',
            data: loan
        });
    } catch (error) {
        next(error);
    }
};
