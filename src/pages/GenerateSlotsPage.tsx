import Navbar from '../components/Navbar';
import { SlotGeneratorForm } from '../components/SlotGeneratorForm';

const GenerateSlotsPage = () => (
  <div className="min-h-screen bg-base-200">
    <Navbar />

    {/* Add spacing below the navbar */}
    <div className="mt-6 px-4">
      <SlotGeneratorForm />
    </div>
  </div>
);

export default GenerateSlotsPage;
