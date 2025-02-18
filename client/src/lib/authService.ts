import { AxiosError } from 'axios';

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    role: 'patient' | 'doctor';
  };
}

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

export const authService = {
  async login(credentials: AuthCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
        credentials: 'include', // Important for cookies
      });

      if (!response.ok) {
        const error = await response.json();
        throw new AuthError(error.message || 'Failed to login');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof AuthError) throw error;
      if (error instanceof Error) {
        throw new AuthError(error.message);
      }
      throw new AuthError('An unexpected error occurred');
    }
  },

  async register(credentials: AuthCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new AuthError(error.message || 'Failed to register');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof AuthError) throw error;
      if (error instanceof Error) {
        throw new AuthError(error.message);
      }
      throw new AuthError('An unexpected error occurred');
    }
  },

  async logout(): Promise<void> {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new AuthError('Failed to logout');
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new AuthError(error.message);
      }
      throw new AuthError('An unexpected error occurred');
    }
  },

  async checkAuth(): Promise<boolean> {
    try {
      const response = await fetch('/api/auth/check', {
        credentials: 'include',
      });
      return response.ok;
    } catch {
      return false;
    }
  },
};
