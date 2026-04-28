import React, { useState } from 'react';
import {
  LayoutDashboard,
  FlaskConical,
  Monitor,
  Wrench,
  Users,
  BarChart3,
  LogOut,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  onSelect: (view: string) => void;
  activeView: string;
  userRole: 'admin' | 'instructor';
}

const Sidebar: React.FC<SidebarProps> = ({ onSelect, activeView, userRole }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <aside 
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      className={`fixed top-0 left-0 h-screen bg-white shadow-2xl flex flex-col border-r border-slate-200 z-50 transition-all duration-500 ease-in-out overflow-hidden ${
        isExpanded ? 'w-64' : 'w-20'
      }`}
    >
      {/* Brand Header */}
      <div className="h-20 flex items-center px-6 border-b border-slate-100 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-indigo-200">
            <span className="text-white font-black text-sm">C</span>
          </div>
          <div className={`flex flex-col transition-all duration-500 ${isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <h1 className="text-lg font-black text-slate-800 leading-none tracking-tighter">CLAMS</h1>
            <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-tighter">Inventory</span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-8 space-y-1 px-3">
        <NavItem 
          icon={<LayoutDashboard size={22} />} 
          label="Dashboard" 
          isActive={activeView === 'dashboard'}
          isExpanded={isExpanded} 
          onClick={() => onSelect('dashboard')} 
        />
        <NavItem 
          icon={<FlaskConical size={22} />} 
          label="Laboratories" 
          isActive={activeView === 'laboratories'}
          isExpanded={isExpanded} 
          onClick={() => onSelect('laboratories')} 
        />
        <NavItem 
          icon={<Monitor size={22} />} 
          label="Equipment" 
          isActive={activeView === 'equipment'}
          isExpanded={isExpanded} 
          onClick={() => onSelect('equipment')} 
        />
        <NavItem 
          icon={<Wrench size={22} />} 
          label="Maintenance" 
          isActive={activeView === 'maintenance'}
          isExpanded={isExpanded} 
          onClick={() => onSelect('maintenance')} 
        />

        {/* ROLE-BASED: Only Admin can see User Management */}
        {userRole === 'admin' && (
          <NavItem 
            icon={<Users size={22} />} 
            label="User Management" 
            isActive={activeView === 'users'}
            isExpanded={isExpanded} 
            onClick={() => onSelect('users')} 
          />
        )}
        
        {/* ROLE-BASED: Reports Label changes based on role */}
        <NavItem 
          icon={<BarChart3 size={22} />} 
          label={userRole === 'admin' ? "View Reports" : "File a Report"} 
          isActive={activeView === 'reports'}
          isExpanded={isExpanded} 
          onClick={() => onSelect('reports')} 
        />
      </nav>

      {/* Footer / Role Identity */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className={`mb-4 flex items-center gap-3 px-2 transition-all duration-500 ${isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-[10px]">R</div>
          <div className="overflow-hidden">
            <p className="text-[11px] font-bold text-slate-800 truncate">Raylle</p>
            <p className="text-[9px] text-slate-400 font-bold uppercase truncate">{userRole} View</p>
          </div>
        </div>
        
        <NavItem 
          icon={<LogOut size={22} className="text-rose-500" />} 
          label="Logout" 
          isActive={false}
          isExpanded={isExpanded} 
          onClick={() => onSelect('logout')} 
        />
      </div>

      {/* Edge Indicator */}
      <div className={`absolute top-1/2 -right-0 transition-all duration-500 ${isExpanded ? 'rotate-180 opacity-0' : 'rotate-0 opacity-100'}`}>
        <div className="bg-white border-y border-l border-slate-200 rounded-l-md p-1 shadow-sm text-slate-300">
           <ChevronRight size={10} />
        </div>
      </div>
    </aside>
  );
};

const NavItem: React.FC<{ 
  icon: React.ReactNode; 
  label: string; 
  isActive: boolean;
  isExpanded: boolean; 
  onClick: () => void 
}> = ({ icon, label, isActive, isExpanded, onClick }) => (
  <button
    onClick={(e) => { e.preventDefault(); onClick(); }}
    className={`w-full flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-300 group relative ${
      isActive 
      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
      : 'text-slate-500 hover:bg-indigo-50 hover:text-indigo-600'
    }`}
  >
    <div className={`shrink-0 transition-transform duration-300 ${!isActive && 'group-hover:scale-110'}`}>
      {icon}
    </div>
    <span className={`text-sm font-bold whitespace-nowrap transition-all duration-500 ${
      isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8 pointer-events-none'
    }`}>
      {label}
    </span>
  </button>
);

export default Sidebar;