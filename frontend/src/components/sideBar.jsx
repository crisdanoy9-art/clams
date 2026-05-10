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
  FileBarChart,
  LogOut,
} from "lucide-react";

const NavItem = ({ icon, label, isActive, isExpanded, onClick }) => (
  <button
    onClick={onClick}
    className={`relative w-full h-12 flex items-center group outline-none rounded-lg overflow-hidden transition-all duration-200
      ${
        isActive
          ? "bg-slate-900 text-white dark:bg-indigo-600 dark:text-white"
          : "text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
      }`}
  >
    {isActive && (
      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-500 rounded-r-full z-30 dark:bg-indigo-400" />
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
}) => {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} />, roles: ["admin", "instructor"] },
    { id: "laboratories", label: "Laboratories", icon: <FlaskConical size={20} />, roles: ["admin", "instructor"] },
    { id: "equipment", label: "Equipment", icon: <Monitor size={20} />, roles: ["admin", "instructor"] },
    { id: "peripherals", label: "Peripherals", icon: <MousePointer2 size={20} />, roles: ["admin", "instructor"] },
    { id: "borrow", label: "Borrow & Return", icon: <ClipboardList size={20} />, roles: ["admin", "instructor"] },
    { id: "damage", label: "Damage Reports", icon: <AlertTriangle size={20} />, roles: ["instructor"] },
    { id: "users", label: "User Management", icon: <Users size={20} />, roles: ["admin"] },
    { id: "reports", label: "Reports", icon: <FileBarChart size={20} />, roles: ["admin"] },
    { id: "logs", label: "Activity Logs", icon: <History size={20} />, roles: ["admin"] },
  ];

  const filtered = navItems.filter((item) => item.roles.includes(userRole));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("currentView");
    localStorage.removeItem("theme");
    if (!localStorage.getItem("rememberMe")) {
      localStorage.removeItem("savedEmail");
    }
    document.documentElement.classList.remove("dark");
    window.location.reload();
  };

  return (
    <aside
      onMouseEnter={() => onExpandChange(true)}
      onMouseLeave={() => onExpandChange(false)}
      className={`h-screen bg-white border-r border-slate-100 flex flex-col shrink-0 transition-all duration-300 ease-in-out z-20
        dark:bg-slate-900 dark:border-slate-700
        ${expanded ? "w-64" : "w-20"}`}
    >
      <div className="h-28 flex items-center border-b border-slate-100 shrink-0 relative overflow-hidden dark:border-slate-700">
        <div className="w-24 h-full flex items-center justify-center shrink-0">
          <div className="w-16 h-14 flex items-center justify-center">
            <img
              src="/logo.png"
              alt="logo"
              className="w-16 h-14 object-contain block animate-logo-spin dark:brightness-110 dark:drop-shadow-glow"
              style={{
                transformOrigin: "center center",
                backfaceVisibility: "hidden",
                animation: "logo-rotate 20s linear infinite",
              }}
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/64x56?text=CLAMS";
              }}
            />
          </div>
        </div>

        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            expanded
              ? "opacity-100 translate-x-0"
              : "opacity-0 -translate-x-10 pointer-events-none"
          }`}
        >
          <p className="text-2xl font-black text-slate-900 whitespace-nowrap leading-tight tracking-tighter dark:text-white">
            CLAMS
          </p>
          <p className="text-xs text-indigo-600 whitespace-nowrap mt-2 font-semibold uppercase tracking-wider dark:text-indigo-400">
            Management System
          </p>
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
          />
        ))}
      </nav>

      <div className="px-2 pb-6 mt-auto">
        <button
          onClick={handleLogout}
          className={`relative w-full h-12 flex items-center group outline-none rounded-lg transition-all duration-200 cursor-pointer
            bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-md hover:shadow-lg active:scale-[0.98]
            dark:from-red-600 dark:to-red-700 dark:hover:from-red-700 dark:hover:to-red-800
            ${expanded ? "justify-start" : "justify-center"}`}
        >
          <div className="w-14 h-full flex items-center justify-center shrink-0">
            <LogOut size={20} className="text-white" />
          </div>
          {expanded && (
            <span className="text-[11px] font-semibold uppercase tracking-wider text-white">
              Log Out
            </span>
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;