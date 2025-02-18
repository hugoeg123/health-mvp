import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { LoadingSpinner } from '../components/LoadingSpinner';

interface Appointment {
  id: string;
  doctorName: string;
  date: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

interface Patient {
  id: string;
  name: string;
  email: string;
  appointments: Appointment[];
}

export default function PatientProfile() {
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadPatientData = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Mock data
        setPatient({
          id: '1',
          name: 'João Silva',
          email: 'joao@example.com',
          appointments: [
            { id: '1', doctorName: 'Dr. Example', date: '2024-02-15 14:00', status: 'scheduled' },
            { id: '2', doctorName: 'Dra. Sample', date: '2024-02-10 09:30', status: 'completed' }
          ]
        });
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load patient data'));
      } finally {
        setIsLoading(false);
      }
    };

    loadPatientData();
  }, []);

  if (isLoading) {
    return <LoadingSpinner size="large" message="Carregando perfil do paciente..." />;
  }

  if (error) {
    throw error;
  }

  if (!patient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900">Paciente não encontrado</h2>
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
              <h1 className="text-2xl font-bold text-gray-900">{patient.name}</h1>
              <p className="mt-1 text-sm text-gray-500">{patient.email}</p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <h2 className="text-lg font-medium text-gray-900">Consultas</h2>
              <div className="mt-3 space-y-4">
                {patient.appointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="bg-gray-50 rounded-lg p-4 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{appointment.doctorName}</p>
                      <p className="text-sm text-gray-500">{appointment.date}</p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        appointment.status === 'scheduled'
                          ? 'bg-blue-100 text-blue-800'
                          : appointment.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {appointment.status === 'scheduled'
                        ? 'Agendada'
                        : appointment.status === 'completed'
                        ? 'Realizada'
                        : 'Cancelada'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}