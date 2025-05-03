import Navbar from '../components/Navbar';
import { AppointmentForm } from '../components/BookAppointment/AppointmentForm';

const AppointmentBookingPage = () => {
  return (
    <div className="min-h-screen bg-base-200"> {/* pt-20 creates space below the navbar */}
      <Navbar />
      <AppointmentForm />
    </div>
  );
};

export default AppointmentBookingPage;
