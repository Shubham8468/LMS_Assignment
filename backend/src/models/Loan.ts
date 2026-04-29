import mongoose, { Document, Schema } from 'mongoose';

export interface ILoan extends Document {
    borrowerId: mongoose.Types.ObjectId;
    loanAmount: number;
    tenure: number;
    interestRate: number;
    simpleInterest: number;
    totalRepayment: number;
    amountPaid: number;
    salarySlipUrl: string;
    status: 'Applied' | 'Sanctioned' | 'Disbursed' | 'Closed' | 'Rejected';
    payments: Array<{ utr: string, amount: number, date: Date }>;
}

const LoanSchema: Schema = new Schema({
    borrowerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    loanAmount: { type: Number, required: true },
    tenure: { type: Number, required: true }, // in months
    interestRate: { type: Number, required: true, default: 12 }, // Annual 12%
    simpleInterest: { type: Number, required: true },
    totalRepayment: { type: Number, required: true },
    amountPaid: { type: Number, default: 0 },
    salarySlipUrl: { type: String, required: true },
    status: {
        type: String,
        required: true,
        enum: ['Applied', 'Sanctioned', 'Disbursed', 'Closed', 'Rejected'],
        default: 'Applied'
    },
    payments: [{
        utr: { type: String, required: true },
        amount: { type: Number, required: true },
        date: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

export const Loan = mongoose.model<ILoan>('Loan', LoanSchema);
