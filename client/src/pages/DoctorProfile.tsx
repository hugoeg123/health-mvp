import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { LoadingSpinner } from '../components/LoadingSpinner';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  schedule: string[];
}

export default function DoctorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadDoctorData = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        // Mock data
        setDoctor({
          id: id || '1',
          name: 'Dr. Example',
          specialty: 'Cardiologia',
          schedule: ['Segunda 9h-17h', 'Quarta 9h-17h', 'Sexta 9h-17h'],
        });
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load doctor data'));
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      loadDoctorData();
    } else {
      setError(new Error('Doctor ID is required'));
      setIsLoading(false);
    }
  }, [id]);

  if (isLoading) {
    return <LoadingSpinner size="large" message="Carregando perfil do médico..." />;
  }

  if (error) {
    throw error;
  }

  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900">Médico não encontrado</h2>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h1 className="text-2xl font-bold text-gray-900">{doctor.name}</h1>
              <p className="mt-1 text-sm text-gray-500">{doctor.specialty}</p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <h2 className="text-lg font-medium text-gray-900">Horários Disponíveis</h2>
              <ul className="mt-3 grid grid-cols-1 gap-3">
                {doctor.schedule.map((time, index) => (
                  <li key={index} className="text-sm text-gray-600 bg-gray-50 rounded-md px-3 py-2">
                    {time}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
