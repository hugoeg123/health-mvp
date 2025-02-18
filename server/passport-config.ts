import { Strategy as LocalStrategy } from 'passport-local'
import passport from 'passport'
import bcrypt from 'bcrypt'
import { storage } from './storage'
import { APIError } from './middleware/errorHandler'

interface User {
  id: number
  email: string
  passwordHash: string
}

/**
 * Configuração do Passport com a estratégia Local.
 * Utiliza bcrypt para comparar senhas com hash.
 */
export function setupPassport(passportInstance: typeof passport) {
  passportInstance.use(
    new LocalStrategy(
      { usernameField: 'email', passwordField: 'password' },
      async (email, password, done) => {
        try {
          const user = await storage.findUserByEmail(email)
          if (!user) {
            return done(null, false, { message: 'Usuário não encontrado' })
          }
          // Compara a senha usando bcrypt
          const match = await bcrypt.compare(password, user.passwordHash)
          if (!match) {
            return done(null, false, { message: 'Senha incorreta' })
          }
          return done(null, user)
        } catch (err) {
          return done(err)
        }
      },
    ),
  )

  passportInstance.serializeUser((user: User, done) => {
    done(null, user.id)
  })

  passportInstance.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.findUserById(id)
      if (!user) {
        return done(new APIError(401, 'Session inválida - usuário não encontrado'))
      }
      done(null, user)
    } catch (err) {
      done(new APIError(500, 'Erro ao recuperar usuário', err))
    }
  })
}
