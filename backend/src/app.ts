import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import { errorHandler } from './middlewares/errorMiddleware';

dotenv.config();

const app = express();

// Connect Database
connectDB();

app.use(cors());
app.use(express.json());

import authRoutes from './routes/authRoutes';
import borrowerRoutes from './routes/borrowerRoutes';
import adminRoutes from './routes/adminRoutes';
import path from 'path';

// Serve static files for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Add routes here
app.use('/api/auth', authRoutes);
app.use('/api/borrower', borrowerRoutes);
app.use('/api/admin', adminRoutes);

// Error Middleware
app.use(errorHandler);

export default app;
