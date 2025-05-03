import Navbar from '../components/Navbar';
import MasterData from '../components/MasterData';

const MasterDataPage = () => {
  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />
      
      <div className="mt-6 px-4">
        <h1 className="text-xl font-semibold text-center mb-4 text-neutral-700">
          Master Data Management
        </h1>
        <MasterData />
      </div>
    </div>
  );
};

export default MasterDataPage;
