import axios from 'axios';
import { Consultant } from '../types/ConsultantConfig';

const API_URL = import.meta.env.MODE === 'development'
  ? import.meta.env.VITE_API_BASE_URL_DEV + '/consultants'
  : import.meta.env.VITE_API_BASE_URL_PROD + '/consultants';

export const fetchConsultants = async (): Promise<Consultant[]> => {
  try {
    const response = await axios.get<Consultant[]>(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching consultants:", error);
    throw error;
  }
};

export const searchConsultants = async (input: string): Promise<Consultant[]> => {
  try {
    const response = await axios.get<Consultant[]>(`${API_URL}?input=${encodeURIComponent(input)}`);
    return response.data;
  } catch (error) {
    console.error("Error searching consultants:", error);
    throw error;
  }
};
