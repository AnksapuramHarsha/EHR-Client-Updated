// import React from 'react';
// import { Link } from 'react-router-dom';
// import PatientList from '../components/PatientList';
// import Navbar from '../components/Navbar';
// import { Plus } from 'lucide-react';

// const HealthRecordsPage: React.FC = () => {
//   return (
//     <div className="min-h-screen bg-base-200">
//       <Navbar /> {/* Render navbar at the top */}
//       <div className="p-4">
//         <div className="flex justify-between items-center mb-2">
//           <h2 className="text-2xl font-bold">Health Records</h2>
//           <div className="flex gap-2 items-center">
//             <Link to="/maincontent" className="btn btn-success">
//               <Plus className="w-5 h-5 mr-2" />
//               Add Patient
//             </Link>
//           </div>
//         </div>

//         {/* Patient list table */}
//         <PatientList />
//       </div>
//     </div>
//   );
// };

// export default HealthRecordsPage;
import React from 'react';
import { Link } from 'react-router-dom';
import PatientList from '../components/PatientList';
import Navbar from '../components/Navbar';
import { Plus } from 'lucide-react';

const HealthRecordsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-base-200 text-xs">
      <Navbar />
      <div className="p-2">
        <div className="flex justify-between items-center mb-1">
          <h2 className="text-sm font-semibold text-neutral-700">Health Records</h2>
          <Link
            to="/maincontent"
            className="btn btn-success btn-xs px-2 py-1 text-xs h-7"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            Add Patient
          </Link>
        </div>

        <PatientList />
      </div>
    </div>
  );
};

export default HealthRecordsPage;
