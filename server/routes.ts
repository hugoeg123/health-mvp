import { Express, Request, Response } from 'express';
import passport from 'passport';
import { storage } from './storage';
import { google } from 'googleapis';
import { logger } from './utils/logger';

export function registerRoutes(app: Express) {
  // Registro de usuário
  app.post('/api/register', async (req: Request, res: Response, next) => {
    try {
      const { email, password } = req.body;
      const existing = await storage.findUserByEmail(email);
      if (existing) {
        return res.status(400).json({ error: 'Usuário já existe' });
      }
      const newUser = await storage.createUser({ email, password });
      res.json(newUser);
    } catch (error) {
      next(error);
    }
  });

  // Login
  app.post('/api/login', passport.authenticate('local'), (req: Request, res: Response) => {
    res.json({ message: 'Login bem-sucedido', user: req.user });
  });

  // Logout
  app.post('/api/logout', (req: Request, res: Response) => {
    req.logout(function(err) {
      if (err) {
        return res.status(500).json({ error: 'Erro ao desconectar' });
      }
      res.json({ message: 'Desconectado com sucesso' });
    });
  });

  // Rota protegida para obter informações do usuário
  app.get('/api/user-info', (req: Request, res: Response) => {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
      return res.status(401).json({ error: 'Não autenticado' });
    }
    res.json(req.user);
  });

  // Exemplo de integração com Google Calendar usando service account
  app.post('/api/appointments', async (req: Request, res: Response, next) => {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
      return res.status(401).json({ error: 'Não autenticado' });
    }
    const { doctorId, date, notes } = req.body;
    try {
      const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET
      );
      oauth2Client.setCredentials({
        refresh_token: process.env.GOOGLE_REFRESH_TOKEN
      });
      const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
      const event = await calendar.events.insert({
        calendarId: 'primary',
        requestBody: {
          summary: 'Consulta',
          description: notes || 'Agendamento via MVP',
          start: { dateTime: date },
          end: { dateTime: date }
        }
      });

      const newAppointment = await storage.createAppointment({
        doctorId,
        date,
        googleEventId: event.data.id
      });
      res.status(201).json(newAppointment);
    } catch (err) {
      logger.error(err);
      next(err);
    }
  });
}