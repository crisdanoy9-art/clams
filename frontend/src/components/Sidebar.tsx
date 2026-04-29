import React from 'react';
import {
  LayoutDashboard, FlaskConical, Monitor, MousePointer2,
  ClipboardList, Wrench, Users, History, LogOut,
  Package
} from 'lucide-react';

interface SidebarProps {
  onSelect: (view: string) => void;
  activeView: string;
  userRole: 'admin' | 'instructor';
  expanded: boolean;
  onExpandChange: (expanded: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  onSelect, activeView, userRole, 
  expanded, onExpandChange 
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={22} />, roles: ['admin', 'instructor'] },
    { id: 'laboratories', label: 'Laboratories', icon: <FlaskConical size={22} />, roles: ['admin', 'instructor'] },
    { id: 'equipment', label: 'Equipment', icon: <Monitor size={22} />, roles: ['admin', 'instructor'] },
    { id: 'peripherals', label: 'Peripherals', icon: <MousePointer2 size={22} />, roles: ['admin', 'instructor'] },
    { id: 'borrow', label: 'Borrow & Return', icon: <ClipboardList size={22} />, roles: ['admin', 'instructor'] },
    { id: 'maintenance', label: 'Maintenance', icon: <Wrench size={22} />, roles: ['admin', 'instructor'] },
    { id: 'users', label: 'User Management', icon: <Users size={22} />, roles: ['admin'] },
    { id: 'logs', label: 'Activity Logs', icon: <History size={22} />, roles: ['admin'] },
  ];

  return (
    <aside 
      onMouseEnter={() => onExpandChange(true)}
      onMouseLeave={() => onExpandChange(false)}
      className={`h-screen bg-white shadow-[40px_0_100px_-20px_rgba(79,70,229,0.12)] flex flex-col border-r border-slate-100 transition-all duration-700 ease-[cubic-bezier(0.05,0.7,0.1,1)] overflow-hidden flex-shrink-0 ${
        expanded ? 'w-80' : 'w-24'
      }`}
    >
      {/* 3D flipping "C" section */}
      <div className="h-44 flex items-center px-6 shrink-0 relative bg-gradient-to-b from-indigo-50/50 to-transparent">
        <div className="flex items-center gap-6 group cursor-pointer">
          <div className="relative w-16 h-16 preserve-3d">
            <div className="absolute inset-0 bg-indigo-600/25 rounded-full blur-[30px] animate-pulse"></div>
            <div className="w-full h-full relative animate-[flip_8s_linear_infinite] preserve-3d group-hover:animate-[flip_3s_linear_infinite]">
              <div className="absolute inset-0 w-full h-full bg-slate-900 rounded-2xl flex items-center justify-center border-2 border-indigo-500 shadow-[0_0_20px_rgba(79,70,229,0.5)] backface-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/30 via-transparent to-white/10"></div>
                <span className="text-white font-black text-4xl italic tracking-tighter drop-shadow-[0_0_10px_#4f46e5]">C</span>
              </div>
              <div className="absolute inset-0 w-full h-full bg-indigo-600 rounded-2xl flex items-center justify-center border-2 border-white/30 rotate-y-180 backface-hidden shadow-inner">
                <Package className="text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.8)]" size={34} />
              </div>
            </div>
            <div className="absolute -inset-3 border-2 border-indigo-500/10 rounded-full animate-[spin_12s_linear_infinite]"></div>
          </div>
          <div className={`flex flex-col transition-all duration-1000 ${expanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20 pointer-events-none'}`}>
            <h1 className="flex items-baseline font-black text-slate-800 tracking-tighter">
              <span className="text-5xl text-indigo-600 mr-0.5 drop-shadow-[0_0_10px_rgba(79,70,229,0.4)] animate-pulse">C</span>
              <span className="text-3xl">LAMS</span>
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] italic">LAPSNADAS</span>
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_#10b981]"></span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 space-y-3 px-5 overflow-y-auto no-scrollbar">
        {navItems.filter(item => item.roles.includes(userRole)).map((item) => (
          <NavItem 
            key={item.id}
            icon={item.icon} 
            label={item.label} 
            isActive={activeView === item.id}
            isExpanded={expanded} 
            onClick={() => onSelect(item.id)} 
          />
        ))}
      </nav>

      {/* Footer: Logout above LAPSNADAS ADMIN */}
      <div className="p-6 mt-auto bg-slate-50/50 border-t border-slate-100">
        <button
          onClick={() => onSelect('logout')}
          className="w-full flex items-center gap-5 px-5 py-5 rounded-2xl text-slate-400 hover:bg-rose-500 hover:text-white transition-all duration-500 group relative overflow-hidden"
        >
          <LogOut size={22} className="relative z-10 group-hover:translate-x-1 transition-transform" />
          <span className={`text-[11px] font-black uppercase tracking-widest relative z-10 transition-all duration-700 ${expanded ? 'opacity-100' : 'opacity-0'}`}>
            Logout
          </span>
        </button>

        <div className={`mb-6 flex items-center gap-4 transition-all duration-700 ${expanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
          <div className="relative group">
             <div className="w-12 h-12 rounded-2xl bg-slate-950 flex items-center justify-center text-white font-black text-xl shadow-xl transition-all group-hover:bg-indigo-600 group-hover:rotate-12">R</div>
             <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-4 border-white rounded-full"></div>
          </div>
          <div>
            <p className="text-xs font-black text-slate-800 uppercase tracking-tighter">LAPSNADAS ADMIN</p>
            <p className="text-[9px] text-indigo-500 font-bold uppercase tracking-widest mt-0.5 italic">version 1.0</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

const NavItem: React.FC<{ icon: React.ReactNode; label: string; isActive: boolean; isExpanded: boolean; onClick: () => void }> = 
({ icon, label, isActive, isExpanded, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-6 px-5 py-5 rounded-2xl transition-all duration-500 group relative ${
      isActive 
      ? 'bg-slate-900 text-white shadow-[0_20px_40px_-10px_rgba(79,70,229,0.3)] translate-x-3' 
      : 'text-slate-400 hover:bg-indigo-50 hover:text-indigo-600'
    }`}
  >
    <div className={`shrink-0 transition-all duration-500 ${isActive ? 'scale-125 text-indigo-400' : 'group-hover:scale-115'}`}>
      {icon}
    </div>
    <span className={`text-[12px] font-black uppercase tracking-[0.15em] whitespace-nowrap transition-all duration-700 ${
      isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12 pointer-events-none'
    }`}>
      {label}
    </span>
    {isActive && (
      <div className="absolute left-0 w-1.5 h-6 bg-indigo-500 rounded-r-full shadow-[0_0_15px_#4f46e5]"></div>
    )}
  </button>
);

export default Sidebar;