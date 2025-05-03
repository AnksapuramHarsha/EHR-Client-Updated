import axios from 'axios';
import { ConsultantSlotConfig } from '../types/ConsultantConfig';

const API_URL = import.meta.env.MODE === 'development'
  ? import.meta.env.VITE_API_BASE_URL_DEV + '/consultants'
  : import.meta.env.VITE_API_BASE_URL_PROD + '/consultants';

export const postConsultantSlotConfig = async (
  config: ConsultantSlotConfig
): Promise<ConsultantSlotConfig> => {
  try {
    const response = await axios.post<ConsultantSlotConfig>(
      `${API_URL}/${config.consultantId}/slot-configs`,
      config,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error saving consultant slot configuration:", error);
    throw error;
  }
};
