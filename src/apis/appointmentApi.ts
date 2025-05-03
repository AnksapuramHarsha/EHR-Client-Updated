import axios from 'axios';
import { AppointmentPayload, Appointment } from '../types/Appointment';

const BASE_URL = import.meta.env.MODE === 'development'
  ? import.meta.env.VITE_API_BASE_URL_DEV
  : import.meta.env.VITE_API_BASE_URL_PROD;

export const bookAppointment = async (payload: AppointmentPayload): Promise<void> => {
  await axios.post(`${BASE_URL}/appointments`, payload, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const fetchAppointments = async (): Promise<Appointment[]> => {
    const response = await axios.get(`${BASE_URL}/appointments`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
};