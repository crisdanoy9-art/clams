import React, { useState } from 'react';
import {
  LayoutDashboard,
  FlaskConical,
  Monitor,
  Keyboard,
  Users,
  FileText,
  Activity,
  ChevronLeft,
  ChevronRight,
  Settings,
  ShieldCheck,
  LogOut,
} from 'lucide-react';

interface SidebarProps {
  onSelect: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onSelect }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleSidebar = () => setIsExpanded(!isExpanded);

  return (
    <aside className={`bg-white shadow-lg flex flex-col border-r border-gray-200 h-screen transition-all duration-300 ease-in-out ${isExpanded ? 'w-64' : 'w-20'}`}>
      {/* Header (same as before) */}
      <div className={`p-4 border-b border-gray-200 ${!isExpanded && 'px-2'}`}>
        {isExpanded ? (
          <div className="flex items-center justify-between">
            <div><h1 className="text-xl font-bold text-gray-800">CLAMS</h1></div>
            <button onClick={toggleSidebar} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg border border-gray-300">
              <ChevronLeft size={20} />
            </button>
          </div>
        ) : (
          <div className="flex justify-center">
            <button onClick={toggleSidebar} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg border border-gray-300">
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>

      <nav className="flex-1 py-6 overflow-x-hidden">
        {/* Overview Section */}
        {isExpanded && <div className="px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Overview</div>}
        <div className={`${isExpanded ? 'px-4 mb-6' : 'px-2 mb-6'}`}>
          <NavItem icon={<LayoutDashboard size={18} className="text-indigo-600" />} label="Dashboard" isExpanded={isExpanded} onClick={() => onSelect('dashboard')} />
        </div>

        {/* Management Section */}
        <div className="mb-6">
          {isExpanded && <div className="px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Management</div>}
          <div className="space-y-1">
            <NavItem icon={<FlaskConical size={16} className="text-blue-500" />} label="Laboratories" isExpanded={isExpanded} onClick={() => onSelect('laboratories')} />
            <NavItem icon={<Monitor size={16} className="text-purple-500" />} label="Equipment" isExpanded={isExpanded} onClick={() => onSelect('equipment')} />
            <NavItem icon={<Keyboard size={16} className="text-amber-500" />} label="Peripherals" isExpanded={isExpanded} onClick={() => onSelect('peripherals')} />
            <NavItem icon={<Users size={16} className="text-emerald-500" />} label="Users" isExpanded={isExpanded} onClick={() => onSelect('users')} />
          </div>
        </div>

        {/* Records Section */}
        <div className="mb-6">
          {isExpanded && <div className="px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">RECORDS</div>}
          <div className="space-y-1">
            <NavItem icon={<FileText size={16} className="text-rose-500" />} label="Reports" isExpanded={isExpanded} onClick={() => onSelect('reports')} />
            <NavItem icon={<Activity size={16} className="text-sky-500" />} label="Activity Logs" isExpanded={isExpanded} onClick={() => onSelect('activity')} />
          </div>
        </div>

        {/* System Section */}
        <div className="mb-6">
          {isExpanded && <div className="px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">System</div>}
          <div className="space-y-1">
            <NavItem icon={<Settings size={16} className="text-gray-500" />} label="Settings" isExpanded={isExpanded} onClick={() => onSelect('settings')} />
          </div>
        </div>

        <div className="border-t border-gray-100 my-2" />

        {/* Account Section */}
        <div className="pt-2">
          {isExpanded && <div className="px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Account</div>}
          <div className="space-y-1">
            <NavItem icon={<LogOut size={16} className="text-red-500" />} label="Logout" isExpanded={isExpanded} onClick={() => onSelect('logout')} />
            <NavItem icon={<ShieldCheck size={16} className="text-indigo-500" />} label="Admin Panel" isExpanded={isExpanded} onClick={() => onSelect('admin')} />
          </div>
        </div>
      </nav>
    </aside>
  );
};

const NavItem: React.FC<{ icon: React.ReactNode; label: string; isExpanded: boolean; onClick: () => void }> = ({ icon, label, isExpanded, onClick }) => (
  <a href="#" onClick={(e) => { e.preventDefault(); onClick(); }} className={`flex items-center gap-3 px-6 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors ${!isExpanded && 'justify-center px-2'}`} title={!isExpanded ? label : ''}>
    {icon}
    {isExpanded && <span>{label}</span>}
  </a>
);

export default Sidebar;