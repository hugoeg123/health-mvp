import express from 'express';
import session from 'express-session';
import passport from 'passport';
import cors from 'cors';
import { setupPassport } from './passport-config';
import { registerRoutes } from './routes';
import { errorHandler } from './utils/error-handler';
import { logger } from './utils/logger';

const app = express();

// Middleware básico
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Configuração da sessão
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Ajuste para true em produção com HTTPS
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
app.listen(PORT, () => {
  logger.info(`Servidor rodando na porta ${PORT}`);
});