import React from 'react';
import Navbar from  '../components/Navbar';
import Dashboard from '../components/Dashboard';

const App: React.FC = () => {
  return (
    <div className="bg-base-200 min-h-screen">
      <Navbar />
      <Dashboard />
    </div>
  );
};

export default App;
