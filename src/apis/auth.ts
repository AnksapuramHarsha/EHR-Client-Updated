import axios from 'axios';
import { RegisterRequest, LoginRequest, LoginResponse } from '../types/auth';

const BASE_URL = import.meta.env.MODE === 'development'
  ? import.meta.env.VITE_API_BASE_URL_DEV
  : import.meta.env.VITE_API_BASE_URL_PROD;

export const registerUser = async (data: RegisterRequest): Promise<void> => {
  await axios.post(`${BASE_URL}/register`, data);
};

export const loginUser = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await axios.post<LoginResponse>(`${BASE_URL}/login`, data);
  return response.data;
};
