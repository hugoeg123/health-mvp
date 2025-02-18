import { hashPassword, comparePassword } from './utils/bcrypt';
import { logger } from './middleware/errorHandler';

type User = {
  id: number;
  email: string;
  passwordHash: string;
};

type Appointment = {
  id: number;
  doctorId: number;
  date: string;
  googleEventId?: string;
};

class Storage {
  private users: User[] = [];
  private appointments: Appointment[] = [];
  private userIdCounter = 1;
  private appointmentIdCounter = 1;

  async findUserByEmail(email: string): Promise<User | null> {
    return this.users.find(u => u.email === email) || null;
  }

  async findUserById(id: number): Promise<User | null> {
    return this.users.find(u => u.id === id) || null;
  }

  async createUser({ email, password }: { email: string; password: string }): Promise<User> {
    try {
      const existingUser = await this.findUserByEmail(email);
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      const passwordHash = await hashPassword(password);
    const newUser: User = {
      id: this.userIdCounter++,
      email,
      passwordHash
    };
    this.users.push(newUser);
    logger.info(`Created new user with email: ${email}`);
    return newUser;
    } catch (error) {
      logger.error(`Error creating user: ${error}`);
      throw error;
    }
  }

  async validateUserCredentials(email: string, password: string): Promise<User> {
    const user = await this.findUserByEmail(email);
    if (!user) {
      logger.warn(`Login attempt failed: user not found for email ${email}`);
      throw new Error('Invalid credentials');
    }

    const isValid = await comparePassword(password, user.passwordHash);
    if (!isValid) {
      logger.warn(`Login attempt failed: invalid password for email ${email}`);
      throw new Error('Invalid credentials');
    }

    logger.info(`User logged in successfully: ${email}`);
    return user;
  }

  async createAppointment({
    doctorId,
    date,
    googleEventId
  }: {
    doctorId: number;
    date: string;
    googleEventId?: string;
  }): Promise<Appointment> {
    const newAppointment: Appointment = {
      id: this.appointmentIdCounter++,
      doctorId,
      date,
      googleEventId
    };
    this.appointments.push(newAppointment);
    return newAppointment;
  }
}

export const storage = new Storage();