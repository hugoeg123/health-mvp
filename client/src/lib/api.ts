import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface LoginData {
  email: string;
  password: string;
}

export const loginUser = async (data: LoginData) => {
  const response = await api.post('/auth/login', data);
  return response.data;
};

export const registerUser = async (data: LoginData) => {
  const response = await api.post('/auth/register', data);
  return response.data;
};

export const getDoctorProfile = async (id: string) => {
  const response = await api.get(`/doctors/${id}`);
  return response.data;
};

export const getPatientProfile = async () => {
  const response = await api.get('/patients/profile');
  return response.data;
};

export default api;