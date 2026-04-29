import express, { type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import { errorHandler } from './middlewares/errorMiddleware';

dotenv.config();

const app = express();

// Connect Database
connectDB();

// CORS Configuration for Production
const allowedOrigins = [
  'https://lms-assignment-five.vercel.app',
  'http://localhost:3000',
  'http://localhost:3001'
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

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
