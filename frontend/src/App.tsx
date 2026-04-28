import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Laboratories from './pages/Laboratories';
import Equipment from './pages/Equipment';
import Maintenance from './pages/Maintenance';
import Users from './pages/Users';
import Reports from './pages/Reports';
import Login from './pages/Login';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  
  // Toggle between 'admin' and 'instructor' to test views
  const [userRole, setUserRole] = useState<'admin' | 'instructor'>('admin');

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard />;
      case 'laboratories': return <Laboratories />;
      case 'equipment': return <Equipment />;
      case 'maintenance': return <Maintenance />;
      // Extra check: even if an instructor guesses the view, they can't access it
      case 'users': return userRole === 'admin' ? <Users /> : <Dashboard />;
      case 'reports': return <Reports role={userRole} />;
      case 'logout': setIsLoggedIn(false); return null;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans selection:bg-indigo-100">
      <Sidebar 
        onSelect={setCurrentView} 
        activeView={currentView} 
        userRole={userRole} 
      />

      <main className="flex-1 ml-20 transition-all duration-500 ease-in-out min-h-screen flex flex-col">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-40">
          <div>
            <h2 className="font-black text-slate-800 uppercase tracking-tight text-lg">{currentView}</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              CCS Laboratory Asset Management System
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-slate-900">Raylle</p>
              <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-tighter">
                {userRole === 'admin' ? 'System Administrator' : 'Instructor Access'}
              </p>
            </div>
            <div className="w-10 h-10 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-100 flex items-center justify-center text-white font-black">
              R
            </div>
          </div>
        </header>

        <div className="p-8 flex-1">
          <div className="max-w-7xl mx-auto">
            {renderView()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;