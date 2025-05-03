import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './style.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainDashboard from './pages/MainDashboard';
import HealthRecordsPage from './pages/HealthRecordsPage';
import MainContent from './components/MainContent';
import ConsultantConfigPage from './pages/ConsultantConfigPage';
import GenerateSlotsPage from './pages/GenerateSlotsPage';
import AppointmentBookingPage from './pages/AppointmentBookingPage';
import MasterDataPage from './pages/MasterDataPage';
import AppointmentListPage from './pages/PatientListPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<MainDashboard  />}/>
        <Route path='/dashboard' element={<MainDashboard />}/>
        <Route path="/health-records" element={<HealthRecordsPage />} />
        <Route path="/maincontent" element={<MainContent />} />
        <Route path="/consultant-config" element={<ConsultantConfigPage />} />
        <Route path="/consultant-slots/generate" element={<GenerateSlotsPage />} />
        <Route path="/appointments/new" element={<AppointmentBookingPage />} />
        <Route path="/appointmentlist" element={<AppointmentListPage />} />
        <Route path="/masterdata" element={<MasterDataPage />} />


      </Routes>
      <ToastContainer />
    </Router>
  );
}

export default App;

