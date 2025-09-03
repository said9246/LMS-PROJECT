// app.ts
import express, { NextFunction, Request, Response } from 'express';
export const app = express();
import cookieParser from 'cookie-parser';
import cors from 'cors';
// import { redis } from './utils/redis';
import errorMiddleware from './middleware/error';






// // Example usage
// redis.set("testKey", "Hello Redis!");
// redis.get("testKey").then(value => console.log(value));


// body parser middleware
app.use(express.json({ limit: '50mb' }));
// cookie parser middleware  
app.use(cookieParser());
// cors middleware
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,   
  })
);



import userRoutes from './routes/userRoute';
import CourseRoute from './routes/courseRoute';
// import orderRouter from './routes/orderRoute';
import notificationRouter from './routes/notificationRoute';
import analyticsRouter from './routes/analyticsRoute';
import layoutRouter from './routes/layoutRoute';



app.use('/api/v1', userRoutes);
app.use('/api/v1', CourseRoute);
// app.use("/api/v1", orderRouter);
app.use("/api/v1", notificationRouter);
app.use("/api/v1", analyticsRouter);
app.use("/api/v1", layoutRouter);
















// unknown route handler
app.use((req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} not found`) as any;
  err.statusCode = 404;
  next(err);
});


// global error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});


app.use(errorMiddleware);