import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { User } from './src/models/User';

dotenv.config();

const users = [
    { name: 'Admin User', email: 'admin@lms.com', password: 'password123', role: 'Admin' },
    { name: 'Sales Executive', email: 'sales@lms.com', password: 'password123', role: 'Sales' },
    { name: 'Sanction Executive', email: 'sanction@lms.com', password: 'password123', role: 'Sanction' },
    { name: 'Disbursement Executive', email: 'disbursement@lms.com', password: 'password123', role: 'Disbursement' },
    { name: 'Collection Executive', email: 'collection@lms.com', password: 'password123', role: 'Collection' },
    { name: 'Test Borrower', email: 'borrower@lms.com', password: 'password123', role: 'Borrower', personalDetails: { pan: 'ABCDE1234F', dob: '1995-05-15', monthlySalary: 50000, employmentMode: 'Salaried' } }
];



const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/lms_assignment');
        console.log('MongoDB Connected');

        await User.deleteMany(); // Clear existing users

        for (const user of users) {
            await User.create({
                ...(user as any)
            });
        }

        console.log('Database Seeded Successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDB();
