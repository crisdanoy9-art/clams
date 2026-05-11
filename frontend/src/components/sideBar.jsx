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
  LogOut,
  Layers
} from "lucide-react";

const NavItem = ({ icon, label, isActive, isExpanded, onClick, darkMode }) => (
  <button
    onClick={onClick}
    className={`relative w-full h-12 flex items-center group outline-none rounded-lg overflow-hidden transition-all duration-300 ease-out
      ${
        isActive
          ? darkMode
            ? "bg-slate-800 text-white shadow-lg scale-105"
            : "bg-slate-900 text-white shadow-lg scale-105"
          : darkMode
            ? "text-slate-400 hover:bg-slate-800/70 hover:text-slate-100 hover:scale-105"
            : "text-slate-500 hover:bg-slate-100 hover:text-slate-900 hover:scale-105"
      }`}
  >
    {isActive && (
      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-500 rounded-r-full z-30" />
    )}

    <div className="w-14 h-full flex items-center justify-center shrink-0 z-20 transition-transform duration-300 group-hover:scale-110">
      {icon}
    </div>

    <span
      className={`text-sm font-semibold uppercase tracking-wider whitespace-nowrap transition-all duration-300 ease-out
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

  // Get role from props or localStorage as fallback
  let effectiveRole = userRole;
  if (!effectiveRole) {
    effectiveRole = localStorage.getItem("role");
  }

  // Define navigation items
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} />, roles: ["admin", "instructor"] },
    { id: "laboratories", label: "Laboratories", icon: <FlaskConical size={20} />, roles: ["admin", "instructor"] },
    { id: "equipment", label: "Equipment", icon: <Monitor size={20} />, roles: ["admin", "instructor"] },
    { id: "peripherals", label: "Peripherals", icon: <MousePointer2 size={20} />, roles: ["admin", "instructor"] },
    { id: "borrow", label: "Borrow & Return", icon: <ClipboardList size={20} />, roles: ["admin", "instructor"] },
    { id: "reports", label: "Damage Reports", icon: <AlertTriangle size={20} />, roles: ["admin", "instructor"] },
    { id: "categories", label: "Categories", icon: <Layers size={20} />, roles: ["admin"] },
    { id: "users", label: "User Management", icon: <Users size={20} />, roles: ["admin"] },
    { id: "logs", label: "Activity Logs", icon: <History size={20} />, roles: ["admin"] },
  ];

  // Filter navigation items based on user role
  let filteredNavItems = [];
  if (effectiveRole === "admin") {
    filteredNavItems = navItems;
  } else if (effectiveRole === "instructor") {
    filteredNavItems = navItems.filter(item => item.roles.includes("instructor"));
  } else {
    filteredNavItems = navItems.filter(item => item.roles.includes("instructor"));
  }

  // If no items to show, don't render sidebar
  if (filteredNavItems.length === 0) {
    return null;
  }

  // Get user display name
  let displayName = "User";
  let firstLetter = "U";
  
  if (currentUser) {
    if (currentUser.first_name && currentUser.last_name) {
      displayName = `${currentUser.first_name} ${currentUser.last_name}`;
    } else if (currentUser.username) {
      displayName = currentUser.username;
    }
    firstLetter = displayName.charAt(0).toUpperCase();
  } else {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      try {
        const userData = JSON.parse(storedUserData);
        if (userData.first_name && userData.last_name) {
          displayName = `${userData.first_name} ${userData.last_name}`;
        } else if (userData.username) {
          displayName = userData.username;
        }
        firstLetter = displayName.charAt(0).toUpperCase();
      } catch (e) {}
    }
  }

  const displayRole = effectiveRole === "admin" ? "Administrator" : "Instructor";

  return (
    <aside
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      className={`h-screen bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0 transition-all duration-500 ease-out z-20 shadow-xl
        ${isExpanded ? "w-72" : "w-20"}`}
    >
      {/* Logo Area */}
      <div className={`py-8 flex items-center border-b border-slate-200 dark:border-slate-800 shrink-0 transition-all duration-500 ease-out ${
        isExpanded ? "px-6" : "px-4 justify-center"
      }`}>
        <div className="flex items-center gap-4">
          {/* Rotating Logo */}
          <div className={`rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg overflow-hidden transition-all duration-500 ease-out ${
            isExpanded ? "w-20 h-20" : "w-14 h-14"
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
                  fallback.innerHTML = '<span class="font-black text-white text-3xl">C</span>';
                }
              }}
            />
          </div>
          
          {/* Branding Name */}
          <div
            className={`overflow-hidden transition-all duration-500 ease-out ${
              isExpanded ? "opacity-100 translate-x-0 max-w-[200px] delay-100" : "opacity-0 -translate-x-10 max-w-0 pointer-events-none"
            }`}
          >
            <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter leading-tight whitespace-nowrap">
              CLAMS
            </p>
            <p className="text-xs text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider whitespace-nowrap mt-1">
              CCS LAB AST MNG SYS
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 py-6 px-3 flex flex-col gap-2 overflow-y-auto overflow-x-hidden">
        {filteredNavItems.map((item, index) => (
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

      {/* Footer - User Info and Logout */}
      <div className={`border-t border-slate-200 dark:border-slate-800 py-6 transition-all duration-500 ease-out ${
        isExpanded ? "px-4" : "px-2"
      }`}>
        {/* User Info */}
        <div
          className={`mb-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 transition-all duration-500 ease-out ${
            isExpanded ? "opacity-100 max-h-32" : "opacity-0 max-h-0 overflow-hidden p-0 mb-0"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
              effectiveRole === "admin" 
                ? "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400" 
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
            }`}>
              <span className="text-sm font-bold">{firstLetter}</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{displayName}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{displayRole}</p>
            </div>
          </div>
        </div>
        
        {/* Logout Button */}
        <button
          onClick={onLogout}
          className={`w-full flex items-center gap-3 rounded-xl transition-all duration-300 ease-out group ${
            isExpanded ? "px-4 py-3" : "py-3 justify-center"
          } ${
            darkMode
              ? "bg-slate-800/50 text-slate-400 hover:bg-red-600 hover:text-white"
              : "bg-slate-100 text-slate-600 hover:bg-red-500 hover:text-white"
          } hover:scale-105 hover:shadow-lg`}
        >
          <div className={`rounded-lg flex items-center justify-center transition-all duration-300 ${
            isExpanded ? "w-5 h-5" : "w-5 h-5"
          }`}>
            <LogOut size={18} className="transition-transform duration-300 group-hover:scale-110" />
          </div>
          <span
            className={`text-sm font-semibold transition-all duration-300 whitespace-nowrap ${
              isExpanded ? "opacity-100 translate-x-0 delay-75" : "opacity-0 -translate-x-4 w-0 overflow-hidden"
            }`}
          >
            Logout
          </span>
        </button>
      </div>

      {/* Animation Styles */}
      <style>{`
        @keyframes logo-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-logo-spin {
          animation: logo-spin 20s linear infinite;
        }
        
        .animate-logo-spin:hover {
          animation-play-state: paused;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 4px;
        }
        
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        
        .dark ::-webkit-scrollbar-thumb {
          background: #475569;
        }
        
        /* Smooth width transition */
        aside {
          transition-property: width, padding;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;