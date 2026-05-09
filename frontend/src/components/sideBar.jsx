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
} from "lucide-react";

const NavItem = ({ icon, label, isActive, isExpanded, onClick }) => (
  <button
    onClick={onClick}
    className={`relative w-full h-12 flex items-center group outline-none rounded-lg overflow-hidden
      ${
        isActive
          ? "bg-slate-900 text-white"
          : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
      }`}
  >
    {/* Active Indicator */}
    {isActive && (
      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-500 rounded-r-full z-30" />
    )}

    {/* FIXED ICON ANCHOR: This never moves because w-14 is constant */}
    <div className="w-14 h-full flex items-center justify-center shrink-0 z-20">
      {icon}
    </div>

    {/* SMOOTH SLIDING TEXT - TEXT SIZE REDUCED */}
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
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      roles: ["admin", "instructor"],
    },
    {
      id: "laboratories",
      label: "Laboratories",
      icon: <FlaskConical size={20} />,
      roles: ["admin", "instructor"],
    },
    {
      id: "equipment",
      label: "Equipment",
      icon: <Monitor size={20} />,
      roles: ["admin", "instructor"],
    },
    {
      id: "peripherals",
      label: "Peripherals",
      icon: <MousePointer2 size={20} />,
      roles: ["admin", "instructor"],
    },
    {
      id: "borrow",
      label: "Borrow & Return",
      icon: <ClipboardList size={20} />,
      roles: ["admin", "instructor"],
    },
    {
      id: "damage",
      label: "Damage Reports",
      icon: <AlertTriangle size={20} />,
      roles: ["instructor"],
    },
    {
      id: "users",
      label: "User Management",
      icon: <Users size={20} />,
      roles: ["admin"],
    },
    {
      id: "reports",
      label: "Reports",
      icon: <FileBarChart size={20} />,
      roles: ["admin"],
    },
    {
      id: "logs",
      label: "Activity Logs",
      icon: <History size={20} />,
      roles: ["admin"],
    },
  ];

  const filtered = navItems.filter((item) => item.roles.includes(userRole));

  return (
    <aside
      onMouseEnter={() => onExpandChange(true)}
      onMouseLeave={() => onExpandChange(false)}
      className={`h-screen bg-white border-r border-slate-100 flex flex-col shrink-0 transition-all duration-300 ease-in-out z-20
        ${expanded ? "w-64" : "w-20"}`}
    >
      {/* Logo Area - TEXT SIZE REDUCED */}
      <div className="h-20 flex items-center border-b border-slate-100 shrink-0 relative overflow-hidden">
        <div className="w-20 h-full flex items-center justify-center shrink-0">
          <div className="w-14 h-10 flex items-center justify-center">
            <img
              src="../../public/logo.png"
              alt="logo"
              className="w-14 h-10 object-contain block animate-logo-spin"
              style={{
                transformOrigin: "center center",
                backfaceVisibility: "hidden",
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
          <p className="text-sm font-black text-slate-900 whitespace-nowrap leading-none tracking-tighter">
            CLAMS
          </p>
          <p className="text-[9px] text-indigo-600 whitespace-nowrap mt-1 font-semibold uppercase tracking-wider">
            Managementss
          </p>
        </div>
      </div>

      {/* Navigation */}
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
    </aside>
  );
};

export default Sidebar;
