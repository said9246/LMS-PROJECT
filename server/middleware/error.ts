    import ErrorHandler from '../utils/ErrorHandler'
    import { Request, Response, NextFunction } from 'express'
const errorMiddleware= (
        err: any, 
        req: Request, 
        res: Response,
        next: NextFunction
        ) => {
        err.statusCode = err.statusCode || 500
        err.message = err.message || 'Internal Server Error'

        // Wrong Mongoose Object ID Error
        if (err.name === 'CastError') {
            const message = `Resource not found. Invalid: ${err.path}`
            err = new ErrorHandler(message, 400)
        }

        // Handling Mongoose Validation Error
        if (err.name === 'ValidationError') {
            const message = Object.values(err.errors).map((value: any) => value.message)
            err = new ErrorHandler(message as unknown as string, 400)
        }

        // Handling Mongoose duplicate key errors
        if ((err as any).code === 11000) {
            const message = `Duplicate ${Object.keys((err as any).keyValue)} entered`
            err = new ErrorHandler(message, 400)
        }

        // Handling wrong JWT error
        if (err.name === 'JsonWebTokenError') {
            const message = 'JSON Web Token is invalid. Try Again!!!'
            err = new ErrorHandler(message, 400)
        }

        // Handling Expired JWT error
        if (err.name === 'TokenExpiredError') {
            const message = 'JSON Web Token is expired. Try Again!!!'
            err = new ErrorHandler(message, 400)
        }

        res.status(err.statusCode).json({
            success: false,
            message: err.message,
        })
    }

export default errorMiddleware;