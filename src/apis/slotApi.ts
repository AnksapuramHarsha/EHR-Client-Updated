import axios from 'axios';
import { SlotGenerationRequest } from '../types/SlotGeneration';
import { Slot } from '../types/Appointment';

const BASE_URL = import.meta.env.MODE === 'development'
  ? import.meta.env.VITE_API_BASE_URL_DEV
  : import.meta.env.VITE_API_BASE_URL_PROD;

export const generateSlots = async (consultantId: string, payload: SlotGenerationRequest) => {
  const response = await axios.post(`${BASE_URL}/consultants/${consultantId}/slots/generate`, payload, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return response.data;
};


export const fetchConsultantSlots = async (consultantId: string, date: string): Promise<Slot[]> => {
    const BASE_URL = import.meta.env.MODE === 'development'
      ? import.meta.env.VITE_API_BASE_URL_DEV
      : import.meta.env.VITE_API_BASE_URL_PROD;
  
    const response = await axios.get(`${BASE_URL}/consultants/${consultantId}/slots`, {
      params: { date },
    });
    return response.data;
  };