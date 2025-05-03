import React from 'react';
import { useNavigate } from 'react-router-dom';


import {
  CalendarDays,
  List,
  Workflow,
  FlaskConical,
  PackageCheck,
  HeartPulse,
  CheckSquare,
  FileText
} from 'lucide-react';

const dashboardItems = [
  { label: 'Patient Records', icon: <CalendarDays className="w-12 h-12" />, color: 'bg-cyan-700', route: '/health-records' },
  { label: 'My Appointments', icon: <List className="w-12 h-12" />, color: 'bg-indigo-700' , route: '/appointmentlist' },
  { label: 'OPD Work-Flow', icon: <Workflow className="w-12 h-12" />, color: 'bg-green-700' },
  { label: 'Customized Formulations', icon: <FlaskConical className="w-12 h-12" />, color: 'bg-rose-700' },
  { label: 'Pharmacy Billing And Shipping', icon: <PackageCheck className="w-12 h-12" />, color: 'bg-teal-800' },
  { label: 'Disease Management Program', icon: <HeartPulse className="w-12 h-12" />, color: 'bg-blue-700' },
  { label: 'To Do List', icon: <CheckSquare className="w-12 h-12" />, color: 'bg-neutral-600' },
  { label: 'Reports', icon: <FileText className="w-12 h-12" />, color: 'bg-amber-800' },
];

const Dashboard: React.FC = () => {

    const navigate = useNavigate();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Main Dashboard</h1>
        <button className="btn btn-success btn-sm">Doctor Notes (All Patients)</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardItems.map((item, index) => (
          <div
            key={index}
            onClick={() => item.route && navigate(item.route)}
            className={`rounded-xl p-6 text-white shadow-lg hover:scale-105 transform transition-all ${item.color}  h-40 flex flex-col justify-center items-center`}
          >
            <div className="flex flex-col items-center justify-center space-y-2">
              {item.icon}
              <span className="text-center font-semibold text-lg">{item.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
