import { IUser } from '../models/User';

export const runBRE = (user: IUser) => {
    const errors: string[] = [];

    if (!user.personalDetails) {
        return { passed: false, errors: ['Personal details are incomplete.'] };
    }

    const { dob, monthlySalary } = user.personalDetails;

    if (monthlySalary < 25000) {
        errors.push('Salary must be at least ₹25,000 per month.');
    }

    // Calculate age
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    if (age < 23 || age > 50) {
        errors.push('Age must be between 23 and 50 years.');
    }

    return {
        passed: errors.length === 0,
        errors
    };
};
