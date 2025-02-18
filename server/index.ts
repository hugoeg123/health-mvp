import express from 'express';
import session from 'express-session';
import passport from 'passport';
import dotenv from 'dotenv';
import cors from 'cors';
import { registerRoutes } from './routes';
import { setupPassport } from './passport-config';
import { errorHandler } from './middleware/errorHandler';
import { apiLimiter, authLimiter } from './middleware/rateLimiter';
import RedisStore from 'connect-redis';
import redisClient, { connectToRedis } from './config/database';
import { logger } from './utils/logger';
import { Server } from 'http';

const app = express();

// Middleware básico
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.ALLOWED_ORIGINS?.split(',') 
    : 'http://localhost:3001',
  credentials: true
}));

// Request parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false }));

// Apply rate limiting
app.use('/api/', apiLimiter);
app.use('/api/auth', authLimiter);

// Configuração da sessão
const RedisSessionStore = RedisStore(session);

// Initialize server function
const initializeServer = async () => {
  await connectToRedis();

  // Session configuration
  app.use(
  session({
    store: new RedisSessionStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET || 'mvp-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  })
);

// Inicialização do Passport
setupPassport(passport);
app.use(passport.initialize());
app.use(passport.session());

// Registro das rotas da API
registerRoutes(app);

// Middleware de tratamento de erros (sempre ao final)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server: Server = app.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Graceful shutdown handling
const gracefulShutdown = async (signal: string) => {
  logger.info(`${signal} received. Starting graceful shutdown...`);

  server.close(async () => {
    logger.info('HTTP server closed');
    
    try {
      await redisClient.disconnect();
      logger.info('Redis connection closed');
      process.exit(0);
    } catch (err) {
      logger.error('Error during shutdown:', err);
      process.exit(1);
    }
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    logger.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Start the server
initializeServer().catch(err => {
  logger.error('Failed to initialize server:', err);
  process.exit(1);
});