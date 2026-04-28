import React, { useState } from 'react';
import Sidebar from './sidebar';
import DashboardContent from './content/dashboard';
import Laboratoriesincludes from './includes/Laboratories'; // adjust path if needed

function App() {
  const [activeView, setActiveView] = useState('dashboard');

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardContent />;
      case 'laboratories':
        return <Laboratoriesincludes />;
      // Add other cases as needed
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar onSelect={setActiveView} />
      <main className="flex-1 overflow-y-auto bg-[#f8fafc]">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;