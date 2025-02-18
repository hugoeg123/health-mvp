import React, { Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import AuthPage from '@/pages/AuthPage';
import DoctorProfile from '@/pages/DoctorProfile';
import PatientProfile from '@/pages/PatientProfile';
import NotFound from '@/pages/NotFound';
import Navigation from '@/components/Navigation';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, ProtectedRoute } from './lib/auth';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LoadingSpinner } from './components/LoadingSpinner';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const Layout = () => (
  <div className="min-h-screen bg-gray-50 flex flex-col">
    <Navigation />
    <main className="flex-grow container mx-auto p-4">
      <Outlet />
    </main>
  </div>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'auth', element: <AuthPage /> },
      {
        path: 'doctors/:id',
        element: <ProtectedRoute><DoctorProfile /></ProtectedRoute>
      },
      {
        path: 'profile',
        element: <ProtectedRoute><PatientProfile /></ProtectedRoute>
      }
    ]
  }
]);

const App = () => (
  <AuthProvider>
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner size="large" message="Loading..." />}>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navigation />
          <main className="flex-grow container mx-auto p-4">
            <Outlet />
          </main>
        </div>
      </Suspense>
    </ErrorBoundary>
  </AuthProvider>
);

export default App;