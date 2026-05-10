import React from "react";
import {
  LayoutDashboard,
  FlaskConical,
  Monitor,
  MousePointer2,
  ClipboardList,
  AlertTriangle,
  Users,
  History,
} from "lucide-react";

const NavItem = ({ icon, label, isActive, isExpanded, onClick, darkMode }) => (
  <button
    onClick={onClick}
    className={`relative w-full h-12 flex items-center group outline-none rounded-lg overflow-hidden transition-all duration-200 sidebar-item
      ${
        isActive
          ? darkMode
            ? "bg-slate-800 text-white shadow-lg"
            : "bg-slate-900 text-white shadow-lg"
          : darkMode
            ? "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
            : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
      }`}
  >
    {isActive && (
      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-500 rounded-r-full z-30" />
    )}

    <div className="w-14 h-full flex items-center justify-center shrink-0 z-20">
      {icon}
    </div>

    <span
      className={`text-[11px] font-semibold uppercase tracking-wider whitespace-nowrap transition-all duration-300 ease-in-out
        ${
          isExpanded
            ? "opacity-100 translate-x-0"
            : "opacity-0 -translate-x-4 pointer-events-none"
        }`}
    >
      {label}
    </span>
  </button>
);

const Sidebar = ({
  onSelect,
  activeView,
  userRole,
  expanded,
  onExpandChange,
  darkMode = false,
}) => {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} />, roles: ["admin", "instructor"] },
    { id: "laboratories", label: "Laboratories", icon: <FlaskConical size={20} />, roles: ["admin", "instructor"] },
    { id: "equipment", label: "Equipment", icon: <Monitor size={20} />, roles: ["admin", "instructor"] },
    { id: "peripherals", label: "Peripherals", icon: <MousePointer2 size={20} />, roles: ["admin", "instructor"] },
    { id: "borrow", label: "Borrow & Return", icon: <ClipboardList size={20} />, roles: ["admin", "instructor"] },
    { id: "reports", label: "Damage Reports", icon: <AlertTriangle size={20} />, roles: ["admin", "instructor"] },
    { id: "users", label: "User Management", icon: <Users size={20} />, roles: ["admin"] },
    { id: "logs", label: "Activity Logs", icon: <History size={20} />, roles: ["admin"] },
  ];

  const filtered = userRole ? navItems.filter((item) => item.roles.includes(userRole)) : [];

  if (!userRole || filtered.length === 0) {
    return null;
  }

  return (
    <aside
      onMouseEnter={() => onExpandChange(true)}
      onMouseLeave={() => onExpandChange(false)}
      className={`h-screen bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0 transition-all duration-300 ease-in-out z-20
        ${expanded ? "w-64" : "w-20"}`}
    >
      {/* Logo Area with Rotating Original Logo */}
      <div className="h-20 flex items-center border-b border-slate-200 dark:border-slate-800 shrink-0 relative overflow-hidden px-3">
        <div className="flex items-center gap-3 w-full">
          {/* Rotating Logo Image */}
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 overflow-hidden bg-white dark:bg-transparent">
            <img
              src="/logo.png"
              alt="CLAMS Logo"
              className="w-10 h-10 object-contain animate-logo-spin"
              onError={(e) => {
                e.target.style.display = 'none';
                const fallback = e.target.nextSibling;
                if (fallback) fallback.style.display = 'flex';
              }}
            />
            <div className="hidden w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 items-center justify-center">
              <span className="text-indigo-600 dark:text-indigo-400 font-bold text-xl">C</span>
            </div>
          </div>
          
          {/* Text Logo */}
          <div
            className={`transition-all duration-300 ease-in-out overflow-hidden ${
              expanded
                ? "opacity-100 translate-x-0 w-auto"
                : "opacity-0 -translate-x-10 pointer-events-none w-0"
            }`}
          >
            <p className="text-base font-black text-slate-900 dark:text-white whitespace-nowrap leading-none tracking-tighter">
              CLAMS
            </p>
            <p className="text-[10px] text-indigo-600 dark:text-indigo-400 whitespace-nowrap mt-1 font-semibold uppercase tracking-wider">
              Asset Management
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 py-6 px-2 flex flex-col gap-2 overflow-y-auto overflow-x-hidden scrollbar-hide">
        {filtered.map((item) => (
          <NavItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            isActive={activeView === item.id}
            isExpanded={expanded}
            onClick={() => onSelect(item.id)}
            darkMode={darkMode}
          />
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;