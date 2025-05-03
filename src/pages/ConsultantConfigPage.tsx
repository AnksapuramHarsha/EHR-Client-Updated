import Navbar from '../components/Navbar';
import { ConsultantSlotForm } from '../components/ConsultantSlotForm';

const ConsultantConfigPage = () => {
  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />

      <div className="mt-6 px-4">
        <h1 className="text-xl font-semibold text-center mb-4 text-neutral-700">
          Configure Consultant Slot
        </h1>
        <ConsultantSlotForm />
      </div>
    </div>
  );
};

export default ConsultantConfigPage;

