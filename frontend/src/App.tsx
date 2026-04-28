import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Laboratories from './pages/Laboratories';
import Equipment from './pages/Equipment';
import Peripherals from './pages/Peripherals';
import BorrowReturn from './pages/BorrowReturn';
import Maintenance from './pages/Maintenance';
import Users from './pages/Users';
import ActivityLogs from './pages/ActivityLogs';
import Reports from './pages/Reports';
import Login from './pages/Login';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const [userRole, setUserRole] = useState<'admin' | 'instructor'>('admin');
  const [sidebarExpanded, setSidebarExpanded] = useState(false); // NEW: control sidebar expansion

  const handleLogin = (role: 'admin' | 'instructor') => {
    setUserRole(role);
    setIsLoggedIn(true);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentView('dashboard');
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard />;
      case 'laboratories': return <Laboratories />;
      case 'equipment': return <Equipment />;
      case 'peripherals': return <Peripherals />;
      case 'borrow': return <BorrowReturn role={userRole} />;
      case 'maintenance': return <Maintenance />;
      case 'users': return userRole === 'admin' ? <Users /> : <Dashboard />;
      case 'logs': return userRole === 'admin' ? <ActivityLogs /> : <Dashboard />;
      case 'reports': return <Reports role={userRole} />;
      case 'logout': handleLogout(); return null;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans selection:bg-indigo-100">
      <Sidebar 
        onSelect={setCurrentView} 
        activeView={currentView} 
        userRole={userRole}
        expanded={sidebarExpanded}
        onExpandChange={setSidebarExpanded}
      />

      {/* Main content shifts with sidebar – uses standard flex, no static margin */}
      <main className="flex-1 min-h-screen flex flex-col transition-all duration-700 ease-[cubic-bezier(0.05,0.7,0.1,1)]">
        {/* Header – moves with the main container */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-40">
          <div>
            <h2 className="font-black text-slate-800 uppercase tracking-tight text-lg">
              {currentView.replace(/([A-Z])/g, ' $1').trim()}
            </h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest italic">
              CCS Laboratory Asset Management System
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-slate-900">
                {userRole === 'admin' ? 'Raylle Admin' : 'Staff Instructor'}
              </p>
              <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-tighter">
                {userRole === 'admin' ? 'System Administrator' : 'Laboratory Instructor'}
              </p>
            </div>
            <div className="w-10 h-10 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-100 flex items-center justify-center text-white font-black text-xl">
              {userRole === 'admin' ? 'R' : 'I'}
            </div>
          </div>
        </header>

        <div className="p-8 flex-1">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500">
            {renderView()}
          </div>
        </div>

        <footer className="p-6 text-center text-[9px] font-bold text-slate-300 uppercase tracking-[0.4em]">
          JRMSU - Main Campus | College of Computing Studies © 2026
        </footer>
      </main>
    </div>
  );
};

export default App;