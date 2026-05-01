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
  LogOut,
  Package,
  FileBarChart,
} from "lucide-react";

interface SidebarProps {
  onSelect: (view: string) => void;
  activeView: string;
  userRole: "admin" | "instructor";
  expanded: boolean;
  onExpandChange: (expanded: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
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
      roles: ["instructor"],
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

  const filteredNavItems = navItems.filter((item) =>
    item.roles.includes(userRole),
  );

  return (
    <aside
      onMouseEnter={() => onExpandChange(true)}
      onMouseLeave={() => onExpandChange(false)}
      className={`h-screen bg-white shadow-xl flex flex-col border-r border-slate-100 transition-all duration-300 ease-out overflow-hidden flex-shrink-0 ${
        expanded ? "w-64" : "w-16"
      }`}
    >
      {/* Logo Section */}
      <div className="h-28 flex items-center px-3 shrink-0 relative">
        <div
          className={`flex items-center transition-all duration-300 ease-out w-full ${
            expanded ? "justify-start gap-3" : "justify-center"
          }`}
        >
          <div className="relative w-12 h-12 shrink-0 aspect-square overflow-hidden">
            <img
              src="/assets/logo.png"
              alt="Logo"
              className="w-full h-full object-contain animate-spin"
              style={{
                animationDuration: "10s",
                animationTimingFunction: "linear",
              }}
            />
          </div>
          <div
            className={`flex flex-col transition-all duration-300 ease-out ${
              expanded
                ? "w-auto opacity-100 translate-x-0"
                : "w-0 opacity-0 -translate-x-2"
            }`}
          >
            <h1 className="font-black text-slate-800 text-2xl leading-none tracking-tighter whitespace-nowrap">
              CLAMS
            </h1>
            <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-[0.2em] whitespace-nowrap mt-0.5">
              Lab Management
            </p>
          </div>
        </div>
      </div>{" "}
      {/* Navigation */}
      <nav className="flex-1 py-3 space-y-1 px-2 overflow-y-auto">
        {filteredNavItems.map((item) => (
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
      {/* Footer: Logout */}
      <div className="p-3 mt-auto border-t border-slate-100">
        <button
          onClick={() => onSelect("logout")}
          className={`w-full flex items-center rounded-md text-slate-400 hover:bg-rose-500 hover:text-white transition-all duration-200 ${
            expanded ? "gap-2 px-2 py-2 justify-start" : "justify-center py-2"
          }`}
        >
          <LogOut size={18} className="shrink-0" />
          <span
            className={`text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-300 ease-out ${
              expanded ? "w-auto opacity-100" : "w-0 opacity-0"
            } overflow-hidden`}
          >
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
};

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  isExpanded: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, isExpanded, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center rounded-md transition-all duration-200 ${
      isExpanded ? "gap-2 px-2 py-2 justify-start" : "justify-center py-2"
    } ${
      isActive
        ? "bg-slate-900 text-white shadow-md"
        : "text-slate-400 hover:bg-indigo-50 hover:text-indigo-600"
    }`}
  >
    <div
      className={`shrink-0 transition-transform duration-200 ${
        isActive ? "scale-110" : ""
      }`}
    >
      {icon}
    </div>
    <span
      className={`text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-300 ease-out ${
        isExpanded ? "w-auto opacity-100" : "w-0 opacity-0"
      } overflow-hidden`}
    >
      {label}
    </span>
    {isActive && (
      <div className="absolute left-0 w-1 h-4 bg-indigo-500 rounded-r-full"></div>
    )}
  </button>
);

export default Sidebar;
