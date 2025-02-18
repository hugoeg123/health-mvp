import express from 'express'
import session from 'express-session'
import passport from 'passport'
import dotenv from 'dotenv'
import cors from 'cors'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import { Server, createServer } from 'http'
import RedisStore from 'connect-redis'
import morgan from 'morgan'
import { registerRoutes } from './routes'
import { setupPassport } from './passport-config'
import { errorHandler } from './middleware/errorHandler'
import { apiLimiter, authLimiter } from './middleware/rateLimiter'
import redisClient, { connectToRedis } from './config/database'
import { logger } from './utils/logger'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const server = createServer(app)

// Middleware básico
app.use(
  cors({
    origin:
      process.env.NODE_ENV === 'production'
        ? process.env.ALLOWED_ORIGINS?.split(',')
        : 'http://localhost:3001',
    credentials: true,
  }),
)

// Request parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: false }))
app.use(morgan('dev'))

// Apply rate limiting
app.use('/api/', apiLimiter)
app.use('/api/auth', authLimiter)

// Configuração da sessão
const RedisSessionStore = RedisStore(session)

// Initialize server function
const initializeServer = async () => {
  await connectToRedis()

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
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      },
    }),
  )

  // Inicialização do Passport
  setupPassport(passport)
  app.use(passport.initialize())
  app.use(passport.session())

  // Registro das rotas da API
  registerRoutes(app)

  // Serve static files from the client build directory
  const staticPath = resolve(__dirname, '../../../client/dist');
  app.use(
    express.static(staticPath, {
      setHeaders: (res) => {
        res.set('Cache-Control', 'no-store, max-age=0')
      },
    }),
  )

  // SPA fallback route
  app.get('*', (req, res) => {
    res.sendFile(resolve(staticPath, 'index.html'))
  })

  // Middleware de tratamento de erros (sempre ao final)
  app.use(errorHandler)

  const PORT = process.env.PORT || 5000
  server.listen(PORT, () => {
    logger.info(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`)
  })
}

// Graceful shutdown handling
const gracefulShutdown = async (signal: string) => {
  logger.info(`${signal} received. Starting graceful shutdown...`)

  server.close(async () => {
    logger.info('HTTP server closed')

    try {
      await redisClient.disconnect()
      logger.info('Redis connection closed')
      process.exit(0)
    } catch (err) {
      logger.error('Error during shutdown:', err)
      process.exit(1)
    }
  })

  // Force shutdown after 10 seconds
  setTimeout(() => {
    logger.error('Could not close connections in time, forcefully shutting down')
    process.exit(1)
  }, 10000)
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
process.on('SIGINT', () => gracefulShutdown('SIGINT'))

// Global error handling
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error)
  gracefulShutdown('UNCAUGHT_EXCEPTION')
})

// Start the server
initializeServer().catch((err) => {
  logger.error('Failed to initialize server:', err)
  process.exit(1)
})
