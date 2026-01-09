

import express, { Application, Request, Response, NextFunction } from 'express';
import cors, { CorsOptions } from 'cors';
import 'dotenv/config';
import helmet from 'helmet';
import hpp from 'hpp';
import mongoose from 'mongoose';
import { rateLimit } from 'express-rate-limit';
import authRoutes from './routes/auth.route';
import jobRoutes from './routes/job.route';

const app: Application = express();

const corsOptions: CorsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true
};

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  message: "Too many requests from this IP, please try again after 15 minutes"
});

app.use(limiter);
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// 1. Security Headers
app.use(helmet());
app.use(cors(corsOptions));


// 3. Prevent HTTP Parameter Pollution
app.use(hpp());
app.use(limiter);

// Routes
app.use('/api/v1', authRoutes);
app.use('/api/v1', jobRoutes);

app.get('/api/v1/health', (req: Request, res: Response) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
  res.status(200).json({ 
    status: true,
    timestamp: new Date().toISOString(),
    database: dbStatus
  });
});

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    status: true,
    message: "Welcome to the HireMe - Job Posting Platform API!"
  });
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    status: false,
    error: 'Internal Server Error',
    message: err.message || 'Something went wrong!'
  });
});

app.use((req: Request, res: Response) => {
  res.status(404).json({ 
    status: false,
    error: 'Route not found' 
  });
});

export default app;