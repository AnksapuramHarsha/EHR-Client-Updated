export interface AppointmentPayload {
    id: string;
    practitionerId: string;
    specialtyId: string;
    visitReason: string;
    priorityLevel: string;
    createdBy: string;
    slotId: number;
  }

  export interface Slot {
  consultantId: string;
  slotDate: string;
  startTime: string;
  endTime: string;
  slotNumber: number;
  availability: 'OPEN' | 'BOOKED';
}

export interface Appointment {
    id: string; // Booking ID
    patientId: string; // ABHA ID
    appointmentDate: string;
    appointmentTime: string;
    bookingStatus: string;
    visitReason: string;
  }
  