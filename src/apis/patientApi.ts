import { Patient } from "../types/patient";
import axios from "axios";

// const API_URL = "http://localhost:3000/api/patients";
const API_URL = import.meta.env.MODE === 'development' 
  ? import.meta.env.VITE_API_BASE_URL_DEV + '/patients'
  : import.meta.env.VITE_API_BASE_URL_PROD + '/patients';

export const createPatient = async (formData: Patient) => {
    try {
        const response = await axios.post(API_URL, formData, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error creating patient:", error);
        throw error;
    }
}

export const getAllPatients = async () => {
    try {
        const response = await axios.get(API_URL, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching patients:", error);
        throw error;
    }
}

export const deletePatient = async (id: string) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error deleting patient:", error);
        throw error;
    }
}

export const getPatientById = async (id: string) => {
    try {
        const response = await axios.get(`${API_URL}`, {
            params: {
                id: id
            },
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching patient by ID:", error);
        throw error;
    }
}

export const updatePatient = async (id: string, updatedData: Patient) => {
    try{
        const response = await axios.put(`${API_URL}/${id}`, updatedData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    }catch(error) {
        console.error("Error updating patient:", error);
        throw error;
    }
};

export const dropDownPatients = async(query:string)=>{
    try{
        const response = await axios.get(`${API_URL}/dropdown`,{
            params:{
                q: query
            },
            headers: {
                "Content-Type": "application/json",
            },
        })
        console.log("response from dropdown patients",response.data)
        return response.data;
    } catch(error) {
        console.log("error while retriving ids",error)
        throw error
    }
} 





