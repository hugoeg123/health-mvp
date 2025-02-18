import { AxiosError } from 'axios';

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export class NetworkError extends AppError {
  constructor(message = 'Network error occurred') {
    super(message, 503, true);
    this.name = 'NetworkError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, true);
    this.name = 'ValidationError';
  }
}

export function handleApiError(error: unknown): AppError {
  if (error instanceof AppError) return error;

  if (error instanceof AxiosError) {
    const statusCode = error.response?.status || 500;
    const message = error.response?.data?.message || error.message;
    return new AppError(message, statusCode);
  }

  if (error instanceof Error) {
    return new AppError(error.message);
  }

  return new AppError('An unexpected error occurred');
}

export function isNetworkError(error: unknown): boolean {
  if (error instanceof AxiosError) {
    return !error.response && !!error.request;
  }
  return false;
}

export const errorMessages = {
  NETWORK_ERROR: 'Unable to connect to the server. Please check your internet connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SERVER_ERROR: 'An unexpected error occurred. Please try again later.',
  SESSION_EXPIRED: 'Your session has expired. Please log in again.',
};
