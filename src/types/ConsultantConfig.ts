export interface ConsultantSlotConfig {
    consultantId: string;
    daysOfWeek: string[];
    startTime: string;      
    endTime: string;
    slotDuration: number;
    effectiveFrom: string; 
    effectiveTo: string;
  }


  export interface Speciality {
    id: string;
    name: string;
    description: string;
  }
  
  export interface Consultant {
    id: string;
    name: string;
    speciality: Speciality;
    email: string;
    phone: string;
    createdAt: string;
  }
  
