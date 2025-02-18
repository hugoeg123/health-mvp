import * as React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import AuthPage from '@/pages/AuthPage';
import DoctorProfile from '@/pages/DoctorProfile';
import PatientProfile from '@/pages/PatientProfile';
import NotFound from '@/pages/NotFound';
import Navigation from '@/components/Navigation';
import Sidebar from '@/components/Sidebar';
import SearchBar from '@/components/SearchBar';
import Header from './components/Header';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProtectedRoute, AuthProvider } from './lib/auth';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-100">
            <Header />
            <Navigation />
            {/* Render Sidebar on all routes except /auth */}
            <Routes>
              <Route path="/auth" element={<AuthPage />} />
              <Route path="*" element={
                <div className="flex">
                  <Sidebar />
                  <main className="flex-1 container mx-auto p-4">
                    <SearchBar />
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route
                        path="/doctors/:id"
                        element={
                          <ProtectedRoute>
                            <DoctorProfile />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/profile"
                        element={
                          <ProtectedRoute>
                            <PatientProfile />
                          </ProtectedRoute>
                        }
                      />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </main>
                </div>
              } />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;