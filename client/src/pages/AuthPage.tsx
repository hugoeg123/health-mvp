import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, AuthError } from '../lib/authService';
import { LoadingSpinner } from '../components/LoadingSpinner';

interface FormErrors {
  email?: string;
  password?: string;
}

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const errors: FormErrors = {};
    if (!email) errors.email = 'Email is required';
    if (!password) errors.password = 'Password is required';
    if (Object.keys(errors).length > 0) {
      setErrorMsg('Please fill in all required fields');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      if (isLogin) {
        await authService.login({ email, password });
      } else {
        await authService.register({ email, password });
      }
      navigate('/');
    } catch (error) {
      console.error('Authentication error:', error);
      if (error instanceof AuthError) {
        if (error.message.includes('401')) {
          setErrorMsg('Email or password incorrect');
        } else if (error.message.includes('409')) {
          setErrorMsg('This email is already in use');
        } else if (error.message.includes('400')) {
          setErrorMsg('Invalid data. Please check your information');
        } else {
          setErrorMsg(error.message);
        }
      } else {
        setErrorMsg('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isLogin ? 'Sign in to your account' : 'Create a new account'}
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <input
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {errorMsg && <div className="text-red-500 text-sm text-center">{errorMsg}</div>}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isLogin ? 'Sign in' : 'Sign up'}
            </button>
          </div>
        </form>

        <div className="text-center">
          <button
            className="text-indigo-600 hover:text-indigo-500"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
}
