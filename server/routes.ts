import { Express, Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { storage } from './storage';
import { google } from 'googleapis';
import { logger } from './utils/logger';
import { z } from 'zod';
import { APIError } from './middleware/errorHandler';

export function registerRoutes(app: Express) {
  // Registro de usuário
  const registrationSchema = z.object({
    email: z.string().email({ message: "Email inválido" }),
    password: z.string()
      .min(6, { message: "Senha deve ter no mínimo 6 caracteres" })
      .regex(/[A-Z]/, { message: "Senha deve conter pelo menos uma letra maiúscula" })
      .regex(/[a-z]/, { message: "Senha deve conter pelo menos uma letra minúscula" })
      .regex(/[0-9]/, { message: "Senha deve conter pelo menos um número" })
      .regex(/[!@#$%^&*]/, { message: "Senha deve conter pelo menos um caractere especial" })
  });

  app.post('/api/register', async (req: Request, res: Response, next: NextFunction) => {
      try {
        const validationResult = registrationSchema.safeParse(req.body);
        if (!validationResult.success) {
          return res.status(400).json({ errors: validationResult.error.issues });
        }

        const { email, password } = validationResult.data;
        const existing = await storage.findUserByEmail(email);
        if (existing) {
          throw new APIError(400, 'Usuário já existe');
        }
        const newUser = await storage.createUser({ email, password });
        // Return only non-sensitive user data
        res.status(201).json({
          message: 'Usuário registrado com sucesso',
          user: { email: newUser.email }
        });
      } catch (error) {
        next(error);
      }
    });

  // Login
  app.post('/api/login', passport.authenticate('local'), (req: Request, res: Response) => {
    // Return only non-sensitive user data
    const user = req.user as any;
    res.json({
      message: 'Login bem-sucedido',
      user: { email: user.email }
    });
  });

  // Logout
  app.post('/api/logout', (req: Request, res: Response) => {
    req.logout(function(err) {
      if (err) {
        throw new APIError(500, 'Erro ao desconectar');
      }
      res.json({ message: 'Desconectado com sucesso' });
    });
  });

  // Rota protegida para obter informações do usuário
  app.get('/api/user-info', (req: Request, res: Response) => {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
      throw new APIError(401, 'Não autenticado');
    }
    const user = req.user as any;
    res.json({ email: user.email });
  });

  // Exemplo de integração com Google Calendar usando service account
  app.post('/api/appointments',
    validate([
      body('doctorId').notEmpty().withMessage('ID do médico é obrigatório'),
      body('date').isISO8601().withMessage('Data inválida'),
      body('notes').optional().isString().withMessage('Notas devem ser texto')
    ]),
    async (req: Request, res: Response, next: NextFunction) => {
      if (!req.isAuthenticated || !req.isAuthenticated()) {
        throw new APIError(401, 'Não autenticado');
      }

      const { doctorId, date, notes } = req.body;
      try {
        // Verify required environment variables
        if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.GOOGLE_REFRESH_TOKEN) {
          throw new APIError(500, 'Configuração do Google Calendar incompleta');
        }

        const oauth2Client = new google.auth.OAuth2(
          process.env.GOOGLE_CLIENT_ID,
          process.env.GOOGLE_CLIENT_SECRET
        );
        oauth2Client.setCredentials({
          refresh_token: process.env.GOOGLE_REFRESH_TOKEN
        });

        const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
        
        try {
          const event = await calendar.events.insert({
            calendarId: 'primary',
            requestBody: {
              summary: 'Consulta',
              description: notes || 'Agendamento via MVP',
              start: { dateTime: date },
              end: { dateTime: new Date(new Date(date).getTime() + 3600000).toISOString() } // 1 hour duration
            }
          });

          const newAppointment = await storage.createAppointment({
            doctorId,
            date,
            googleEventId: event.data.id
          });

          res.status(201).json({
            message: 'Consulta agendada com sucesso',
            appointment: {
              id: newAppointment.id,
              date: newAppointment.date,
              doctorId: newAppointment.doctorId
            }
          });
        } catch (googleError) {
          throw new APIError(503, 'Erro ao agendar no Google Calendar', googleError);
        }
      } catch (error) {
        logger.error('Erro no agendamento:', error);
        next(error);
      }
    });
}