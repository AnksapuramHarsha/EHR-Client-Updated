import { useEffect, useState } from 'react';
import { Appointment } from '../types/Appointment';
import { fetchAppointments } from '../apis/appointmentApi';

export const AppointmentList = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchAppointments();
        setAppointments(data);
      } catch (err) {
        setMessage('Failed to load appointments.');
        console.error(err);
      }
    };
    load();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* <h2 className="text-xl font-semibold mb-4">Appointment List</h2> */}
      {message && <p className="text-error mb-2">{message}</p>}
      <div className="overflow-x-auto">
        <table className="table table-xs table-zebra w-full text-sm border-gray-300 border-collapse [&_th]:border [&_td]:border [&_th]:border-gray-300 [&_td]:border-gray-300">
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>ABHA ID</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Visit Reason</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt) => (
              <tr key={appt.id}>
                <td>{appt.id}</td>
                <td>{appt.patientId}</td>
                <td>{appt.appointmentDate}</td>
                <td>{appt.appointmentTime}</td>
                <td>{appt.bookingStatus}</td>
                <td>{appt.visitReason || '-'}</td>
                <td className="flex gap-2">
                  <button className="btn btn-sm btn-info">Reschedule</button>
                  <button className="btn btn-sm btn-error">Cancel</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};