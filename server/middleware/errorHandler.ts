import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

/**
 * Custom error class for API errors
 */
export class APIError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

/**
 * Middleware for centralized error handling
 */
export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  // Default to 500 internal server error
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Log error with appropriate level based on status code
  if (statusCode >= 500) {
    logger.error(`${statusCode} - ${message}`, {
      error: err,
      stack: err.stack,
      path: req.path,
      method: req.method,
      ip: req.ip
    });
  } else {
    logger.warn(`${statusCode} - ${message}`, {
      path: req.path,
      method: req.method,
      ip: req.ip
    });
  }

  // Send response
  res.status(statusCode).json({
    error: {
      message,
      details: process.env.NODE_ENV === 'development' ? err.details || err.stack : undefined
    }
  });
}