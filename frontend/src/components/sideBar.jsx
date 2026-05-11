import React, { useState } from "react";
import { 
  LayoutDashboard, 
  FlaskConical, 
  Monitor, 
  MousePointer2, 
  ClipboardList, 
  AlertTriangle, 
  Users, 
  History, 
  LogOut
} from "lucide-react";

const NavItem = ({ icon, label, isActive, isExpanded, onClick, darkMode }) => (
  <button
    onClick={onClick}
    className={`relative w-full h-12 flex items-center group outline-none rounded-lg overflow-hidden transition-all duration-300 ease-out
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

    <div className="w-14 h-full flex items-center justify-center shrink-0 z-20 transition-transform duration-300">
      {icon}
    </div>

    <span
      className={`text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all duration-300 ease-out
        ${
          isExpanded
            ? "opacity-100 translate-x-0 delay-100"
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
  onLogout,
  currentUser,
  darkMode = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

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

  // Get user display name for logout area
  const username = currentUser?.username || localStorage.getItem("userName") || "User";
  const userFirstName = currentUser?.first_name || "";
  const userLastName = currentUser?.last_name || "";
  const displayName = userFirstName ? `${userFirstName} ${userLastName}` : username;
  const firstLetter = displayName.charAt(0).toUpperCase();

  if (!userRole || filtered.length === 0) {
    return null;
  }

  return (
    <aside
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      className={`h-screen bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0 transition-all duration-500 ease-out z-20 shadow-xl
        ${isExpanded ? "w-72" : "w-20"}`}
    >
      {/* Logo Area - Smooth Transition */}
      <div className={`py-6 flex items-center border-b border-slate-200 dark:border-slate-800 shrink-0 transition-all duration-500 ease-out ${
        isExpanded ? "px-6" : "px-4 justify-center"
      }`}>
        <div className="flex items-center gap-4">
          {/* Rotating Logo Image */}
          <div className={`rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg overflow-hidden transition-all duration-500 ease-out ${
            isExpanded ? "w-16 h-16" : "w-12 h-12"
          }`}>
            <img
              src="/logo.png"
              alt="CLAMS Logo"
              className={`w-full h-full object-cover animate-logo-spin transition-all duration-500 ${
                isExpanded ? "p-2" : "p-1.5"
              }`}
              onError={(e) => {
                e.target.style.display = 'none';
                const fallback = e.target.parentElement;
                if (fallback) {
                  fallback.innerHTML = '<span class="font-black text-white text-2xl">C</span>';
                }
              }}
            />
          </div>
          
          {/* Text Logo - Smooth Fade and Slide */}
          <div
            className={`overflow-hidden transition-all duration-500 ease-out ${
              isExpanded ? "opacity-100 translate-x-0 max-w-[200px] delay-100" : "opacity-0 -translate-x-10 max-w-0 pointer-events-none"
            }`}
          >
            <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter leading-tight whitespace-nowrap">
              CLAMS
            </p>
            <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider whitespace-nowrap">
              Asset Management
            </p>
          </div>
        </div>
      </div>

      {/* Navigation - Smooth Items */}
      <nav className="flex-1 py-6 px-3 flex flex-col gap-2 overflow-y-auto overflow-x-hidden scrollbar-hide">
        {filtered.map((item, index) => (
          <div
            key={item.id}
            className="transition-all duration-300 ease-out"
            style={{ transitionDelay: isExpanded ? `${index * 30}ms` : '0ms' }}
          >
            <NavItem
              icon={item.icon}
              label={item.label}
              isActive={activeView === item.id}
              isExpanded={isExpanded}
              onClick={() => onSelect(item.id)}
              darkMode={darkMode}
            />
          </div>
        ))}
      </nav>

      {/* Logout Section at Bottom - Smooth Transition */}
      <div className={`border-t border-slate-200 dark:border-slate-800 py-4 transition-all duration-500 ease-out ${
        isExpanded ? "px-4" : "px-2"
      }`}>
        <button
          onClick={onLogout}
          className={`w-full flex items-center gap-3 rounded-xl transition-all duration-300 ease-out group ${
            isExpanded ? "px-3 py-3" : "py-3 justify-center"
          } ${
            darkMode
              ? "hover:bg-slate-800 text-slate-400 hover:text-red-400"
              : "hover:bg-red-50 text-slate-600 hover:text-red-600"
          }`}
        >
          <div className={`rounded-lg bg-red-100 dark:bg-red-950/30 flex items-center justify-center transition-all duration-300 ${
            isExpanded ? "w-10 h-10" : "w-10 h-10"
          }`}>
            <LogOut size={20} className="text-red-500 transition-transform duration-300 group-hover:scale-110" />
          </div>
          <span
            className={`text-sm font-semibold transition-all duration-300 whitespace-nowrap ${
              isExpanded ? "opacity-100 translate-x-0 delay-75" : "opacity-0 -translate-x-4 w-0 overflow-hidden"
            }`}
          >
            Logout
          </span>
        </button>

        {/* User Info Mini - Smooth Reveal */}
        <div
          className={`mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 overflow-hidden transition-all duration-500 ease-out ${
            isExpanded ? "opacity-100 max-h-32" : "opacity-0 max-h-0"
          }`}
        >
          <div className="flex items-center gap-3 px-2">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 ${
              userRole === "admin" 
                ? "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400" 
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
            }`}>
              <span className="text-sm font-bold">{firstLetter}</span>
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-slate-800 dark:text-white truncate">
                {displayName}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 capitalize">
                {userRole}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Animation Styles */}
      <style>{`
        @keyframes logo-spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        .animate-logo-spin {
          animation: logo-spin 20s linear infinite;
        }
        
        .animate-logo-spin:hover {
          animation-play-state: paused;
        }
        
        /* Custom scrollbar for sidebar */
        .scrollbar-hide::-webkit-scrollbar {
          width: 4px;
        }
        
        .scrollbar-hide::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .scrollbar-hide::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        
        .dark .scrollbar-hide::-webkit-scrollbar-thumb {
          background: #475569;
        }
        
        /* Smooth width transition for sidebar */
        aside {
          transition-property: width, padding;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;