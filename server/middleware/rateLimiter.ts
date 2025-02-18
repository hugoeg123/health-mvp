import rateLimit from 'express-rate-limit'
import { logger } from '../utils/logger'

// Rate limiter for general API endpoints
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests, please try again later.' },
  handler: (req, res, next, options) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip}`)
    res.status(429).json(options.message)
  },
})

// Stricter rate limiter for authentication endpoints
export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 requests per windowMs
  message: { error: 'Too many login attempts, please try again later.' },
  handler: (req, res, next, options) => {
    logger.warn(`Auth rate limit exceeded for IP: ${req.ip}`)
    res.status(429).json(options.message)
  },
})
