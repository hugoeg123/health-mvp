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
    if (!email || typeof email !== 'string') {
      throw new Error('Invalid email format');
    }
    return this.users.find(u => u.email === email) || null;
  }

  async findUserById(id: number): Promise<User | null> {
    if (!id || typeof id !== 'number') {
      throw new Error('Invalid ID format');
    }
    return this.users.find(u => u.id === id) || null;
  }

  async findAppointmentsByDoctorId(doctorId: number): Promise<Appointment[]> {
    if (!doctorId || typeof doctorId !== 'number') {
      throw new Error('Invalid doctor ID format');
    }
    return this.appointments.filter(apt => apt.doctorId === doctorId);
  }

  async createUser({ email, password }: { email: string; password: string }): Promise<User> {
    try {
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error('Invalid email format');
      }

      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

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

  async createAppointment({
    doctorId,
    date,
    googleEventId
  }: {
    doctorId: number;
    date: string;
    googleEventId?: string;
  }): Promise<Appointment> {
    try {
      if (!doctorId || typeof doctorId !== 'number') {
        throw new Error('Invalid doctor ID format');
      }

      if (!date) {
        throw new Error('Appointment date is required');
      }

      const appointmentDate = new Date(date);
      if (isNaN(appointmentDate.getTime())) {
        throw new Error('Invalid appointment date format');
      }

      if (appointmentDate < new Date()) {
        throw new Error('Appointment date cannot be in the past');
      }

      const doctor = await this.findUserById(doctorId);
      if (!doctor) {
        throw new Error('Doctor not found');
      }

      const existingAppointments = await this.findAppointmentsByDoctorId(doctorId);
      const hasConflict = existingAppointments.some(apt => {
        const existingDate = new Date(apt.date);
        const timeDiff = Math.abs(existingDate.getTime() - appointmentDate.getTime());
        return timeDiff < 30 * 60 * 1000; // 30 minutes in milliseconds
      });

      if (hasConflict) {
        throw new Error('Doctor has another appointment within 30 minutes of this time');
      }

      const newAppointment: Appointment = {
        id: this.appointmentIdCounter++,
        doctorId,
        date,
        googleEventId
      };
      this.appointments.push(newAppointment);
      logger.info(`Created new appointment for doctor ${doctorId} at ${date}`);
      return newAppointment;
    } catch (error) {
      logger.error(`Error creating appointment: ${error}`);
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