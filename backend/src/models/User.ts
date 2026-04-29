import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    role: 'Admin' | 'Sales' | 'Sanction' | 'Disbursement' | 'Collection' | 'Borrower';
    personalDetails?: {
        pan: string;
        dob: string;
        monthlySalary: number;
        employmentMode: 'Salaried' | 'Self-Employed' | 'Unemployed';
    };
    comparePassword(password: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, select: false },
    role: { 
        type: String, 
        required: true,
        enum: ['Admin', 'Sales', 'Sanction', 'Disbursement', 'Collection', 'Borrower']
    },
    personalDetails: {
        pan: { type: String },
        dob: { type: String }, // Storing as string or Date
        monthlySalary: { type: Number },
        employmentMode: { type: String, enum: ['Salaried', 'Self-Employed', 'Unemployed'] }
    }
}, { timestamps: true });

UserSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password as string, salt);
});

UserSchema.methods.comparePassword = async function(password: string): Promise<boolean> {
    if (!this.password) return false;
    return await bcrypt.compare(password, this.password);
};

export const User = mongoose.model<IUser>('User', UserSchema);
