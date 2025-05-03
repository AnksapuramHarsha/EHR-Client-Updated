import { useState } from 'react';
import { AppointmentPayload, Slot } from '../../types/Appointment';
import { PatientSearchItem } from '../../types/PatientSearch';
import { Consultant } from '../../types/ConsultantConfig';
import { bookAppointment } from '../../apis/appointmentApi';

import { PatientSearchDropdown } from './PatientSearchDropdown';
import { PractitionerDropdown } from './PractitionerDropdown';
import { SpecialityDisplay } from './SpecialityDisplay';
import { AppointmentDatePicker } from './AppointmentDatePicker';
import { SlotSelector } from './SlotSelector';
import { VisitDetailsForm } from './VisitDetailsForm';

const DEFAULT_CREATED_BY = '15EEb2aA-e9CB-4a55-5bE1-AcB2BdA31659';

export const AppointmentForm = () => {
  const [selectedPatient, setSelectedPatient] = useState<PatientSearchItem | null>(null);
  const [selectedConsultant, setSelectedConsultant] = useState<Consultant | null>(null);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [visitReason, setVisitReason] = useState('');
  const [priorityLevel, setPriorityLevel] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    if (!selectedPatient || !selectedConsultant || !selectedSlot) {
      setMessage('Please complete all fields before submitting.');
      return;
    }

    const payload: AppointmentPayload = {
      id: selectedPatient.abha,
      practitionerId: selectedConsultant.id,
      specialtyId: selectedConsultant.speciality.id,
      visitReason,
      priorityLevel,
      createdBy: DEFAULT_CREATED_BY,
      slotId: selectedSlot.slotNumber,
    };

    try {
      await bookAppointment(payload);
      setMessage('✅ Appointment booked successfully!');
    } catch (error) {
      console.error(error);
      setMessage('❌ Failed to book appointment.');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-base-100 p-6 rounded-lg shadow max-w-5xl mx-auto space-y-6 text-sm mt-5"
    >
      <h2 className="text-xl font-semibold text-center">Book New Appointment</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">
            <span className="label-text text-sm font-medium text-gray-600">Select Patient</span>
          </label>
          <PatientSearchDropdown onSelect={setSelectedPatient} />
        </div>

        <div>
          <label className="label">
            <span className="label-text text-sm font-medium text-gray-600">Select Practitioner</span>
          </label>
          <PractitionerDropdown
            selectedId={selectedConsultant?.id ?? ''}
            onSelect={(consultant) => {
              setSelectedConsultant(consultant);
              setSelectedSlot(null);
            }}
          />
        </div>
      </div>

      <div>
        <label className="label">
          <span className="label-text text-sm font-medium text-gray-600">Speciality</span>
        </label>
        <SpecialityDisplay speciality={selectedConsultant?.speciality ?? null} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">
            <span className="label-text text-sm font-medium text-gray-600">Appointment Date</span>
          </label>
          <AppointmentDatePicker value={appointmentDate} onChange={setAppointmentDate} />
        </div>

        <div>
          <label className="label">
            <span className="label-text text-sm font-medium text-gray-600">Available Slots</span>
          </label>
          <SlotSelector
            consultantId={selectedConsultant?.id ?? ''}
            date={appointmentDate}
            selectedSlotId={selectedSlot?.slotNumber ?? null}
            onSelect={setSelectedSlot}
          />
        </div>
      </div>

      <div>
        <label className="label">
          <span className="label-text text-sm font-medium text-gray-600">Visit Details</span>
        </label>
        <VisitDetailsForm
          visitReason={visitReason}
          priorityLevel={priorityLevel}
          onChange={(field, value) => {
            if (field === 'visitReason') setVisitReason(value);
            else setPriorityLevel(value);
          }}
        />
      </div>

      <div className="form-control mt-6">
        <button type="submit" className="btn btn-primary w-full">
          Book Appointment
        </button>
      </div>

      {message && (
        <div className="text-info text-center mt-2 text-sm font-medium">{message}</div>
      )}
    </form>
  );
};

