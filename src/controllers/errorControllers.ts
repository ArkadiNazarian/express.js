import type { NextFunction, Request, Response } from "express"

export const globalErrorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
    res.status(error.statusCode).json({
        success: error.success,
        message: error.message
    })
}