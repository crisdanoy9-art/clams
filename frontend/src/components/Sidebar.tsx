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
  FileBarChart,
} from "lucide-react";

interface SidebarProps {
  onSelect: (view: string) => void;
  activeView: string;
  userRole: "admin" | "instructor";
  expanded: boolean;
  onExpandChange: (expanded: boolean) => void;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  isExpanded: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, isExpanded, onClick }) => (
  <button
    onClick={onClick}
    className={`relative w-full flex items-center rounded-xl transition-all duration-300 group ${
      isExpanded ? "gap-4 px-4 py-3.5 justify-start" : "justify-center py-3.5"
    } ${
      isActive
        ? "bg-slate-900 text-white shadow-lg shadow-slate-200"
        : "text-slate-400 hover:bg-slate-50 hover:text-slate-900"
    }`}
  >
    <div
      className={`shrink-0 transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"}`}
    >
      {icon}
    </div>
    <span
      className={`text-[11px] font-bold uppercase tracking-wide whitespace-nowrap transition-all duration-300 ${isExpanded ? "opacity-100" : "opacity-0 absolute"}`}
    >
      {label}
    </span>
    {isActive && (
      <div className="absolute left-0 w-1.5 h-6 bg-indigo-500 rounded-r-full" />
    )}
  </button>
);

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
      className={`h-screen bg-white shadow-xl flex flex-col border-r border-slate-100 transition-all duration-300 ease-out overflow-x-hidden flex-shrink-0 ${
        expanded ? "w-64" : "w-20"
      }`}
    >
      {/* Logo Section */}
      <div className="h-28 flex items-center px-4 shrink-0 relative border-b border-slate-50">
        <div
          className={`flex items-center gap-4 ${expanded ? "justify-start" : "justify-center"}`}
        >
          <div className="relative w-12 h-12 shrink-0 aspect-square">
            <img
              src="/assets/logo.png"
              alt="Logo"
              className="w-full h-full object-contain"
            />
          </div>

          {/* Text - just hide/show with opacity, no width changes */}
          <div
            className={`flex flex-col transition-opacity duration-300 ${expanded ? "opacity-100 delay-75" : "opacity-0 hidden"}`}
          >
            <h1 className="font-black text-slate-800 text-2xl leading-none tracking-tighter whitespace-nowrap">
              CLAMS
            </h1>
            <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-[0.2em] whitespace-nowrap mt-0.5">
              Lab Management
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-8 space-y-4 px-3 overflow-y-auto scrollbar-hide overflow-x-hidden">
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
      <div className="p-4 pb-20">
        <button
          onClick={() => onSelect("logout")}
          className={`w-full flex items-center rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-600 hover:text-white transition-all duration-300 shadow-sm ${
            expanded
              ? "gap-3 px-4 py-3.5 justify-start"
              : "justify-center py-3.5"
          }`}
        >
          <LogOut size={20} className="shrink-0" />
          <span
            className={`text-[11px] font-bold uppercase tracking-wider transition-all duration-300 ${expanded ? "w-auto opacity-100" : "w-0 opacity-0 absolute"}`}
          >
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
