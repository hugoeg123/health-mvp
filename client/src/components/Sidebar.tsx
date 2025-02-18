import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Botão flutuante do menu no canto superior esquerdo */}
      <button
        className="fixed top-4 left-4 z-50 bg-gray-200 p-2 rounded-full shadow-md hover:bg-gray-300 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="material-icons">menu</span>
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-white w-64 shadow-lg transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out z-40`}
      >
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={() => setIsOpen(false)}
        >
          <span className="material-icons">close</span>
        </button>
        <nav className="p-8 pt-16">
          <ul className="space-y-4">
            <li>
              <Link
                to="/"
                className="flex items-center text-gray-700 hover:text-blue-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <span className="material-icons mr-2">home</span>
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/profile"
                className="flex items-center text-gray-700 hover:text-blue-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <span className="material-icons mr-2">person</span>
                Perfil
              </Link>
            </li>
            <li>
              <Link
                to="/doctors/1"
                className="flex items-center text-gray-700 hover:text-blue-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <span className="material-icons mr-2">medical_services</span>
                Médico
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
