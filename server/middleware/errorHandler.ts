import { Request, Response, NextFunction } from 'express'
import logger from '../utils/logger'

/**
 * Custom error class for API errors
 */
export class APIError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: any,
  ) {
    super(message)
    this.name = 'APIError'
  }
}

/**
 * Middleware for centralized error handling
 */
export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  // Default to 500 internal server error
  const statusCode = err.statusCode || 500
  const message = err.message || 'Internal Server Error'

  // Enhanced logging with request context
  const logContext = {
    path: req.path,
    method: req.method,
    ip: req.ip,
    userId: req.user?.id,
    timestamp: new Date().toISOString(),
  }

  // Log error with appropriate level based on status code
  if (statusCode >= 500) {
    logger.error(`${statusCode} - ${message}`, {
      ...logContext,
      error: err,
      stack: err.stack,
    })
  } else {
    logger.warn(`${statusCode} - ${message}`, logContext)
  }

  // Prepare error response based on environment
  const errorResponse = {
    error: {
      message: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : message,
      status: statusCode,
    },
  }

  // Add additional debug information in non-production environments
  if (process.env.NODE_ENV !== 'production') {
    Object.assign(errorResponse.error, {
      details: err.details || null,
      stack: err.stack,
      path: req.path,
      timestamp: new Date().toISOString(),
    })
  }

  // Send response
  res.status(statusCode).json(errorResponse)
}
