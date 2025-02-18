import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';

export default function Navigation() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <nav className="bg-gray-800 text-white p-4 mb-4 flex justify-between items-center">
      <div>
        <Link className="mr-4 hover:text-gray-300 transition-colors" to="/">Home</Link>
        {isAuthenticated ? (
          <>
            <Link className="mr-4 hover:text-gray-300 transition-colors" to="/profile">Profile</Link>
            <button
              onClick={handleLogout}
              className="text-white hover:text-gray-300 transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          <Link className="hover:text-gray-300 transition-colors" to="/auth">Login/Register</Link>
        )}
      </div>
    </nav>
  );
}