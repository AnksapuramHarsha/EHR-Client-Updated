import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { AppointmentList } from '../components/AppointmentList';

const AppointmentListPage = () => (
  <div className="min-h-screen bg-base-200 pb-10">
    <Navbar />

    <div className="max-w-6xl mx-auto px-4 mt-6 flex justify-between items-center">
      <h2 className="text-xl font-semibold">Appointment List</h2>
      <Link to="/appointments/new" className="btn btn-primary btn-sm">
        + New Appointment
      </Link>
    </div>

    <AppointmentList />
  </div>
);

export default AppointmentListPage;
