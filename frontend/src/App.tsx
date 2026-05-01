import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Laboratories from "./pages/Laboratories";
import Equipment from "./pages/Equipment";
import Peripherals from "./pages/Peripherals";
import BorrowReturn from "./pages/BorrowReturn";
import Users from "./pages/Users";
import ActivityLogs from "./pages/ActivityLogs";
import DamageReports from "./pages/DamageReports";
import Login from "./pages/Login";

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState("dashboard");
  const [userRole, setUserRole] = useState<"admin" | "instructor">("admin");
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  const handleLogin = (role: "admin" | "instructor") => {
    setUserRole(role);
    setIsLoggedIn(true);
    setCurrentView("dashboard");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentView("dashboard");
  };

  // if (!isLoggedIn) {
  //   return <Login onLogin={handleLogin} />;
  // }

  const renderView = () => {
    switch (currentView) {
      case "dashboard":
        return <Dashboard userRole={userRole} />;
      case "laboratories":
        return (
          <Laboratories
            userRole={userRole}
            onNavigateToLogs={() => setCurrentView("logs")}
          />
        );
      case "equipment":
        return <Equipment />;
      case "peripherals":
        return <Peripherals />;
      case "borrow":
        return <BorrowReturn userRole={userRole} role={"admin"} />;
      case "reports":
      case "damage":
        return <DamageReports userRole={userRole} />;
      case "users":
        return userRole === "admin" ? (
          <Users />
        ) : (
          <Dashboard userRole={userRole} />
        );
      case "logs":
        return <ActivityLogs />;
      case "logout":
        handleLogout();
        return null;
      default:
        return <Dashboard userRole={userRole} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-100">
      {/* Navbar - normal position, NOT sticky */}
      <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 flex items-center justify-between w-full">
        <div>
          <h2 className="font-black text-slate-800 uppercase tracking-tight text-lg">
            {currentView.replace(/([A-Z])/g, " $1").trim()}
          </h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest italic">
            CCS Laboratory Asset Management System
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-slate-900">
              {userRole === "admin" ? "Raylle Admin" : "Staff Instructor"}
            </p>
            <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-tighter">
              JRMSU Main Campus
            </p>
          </div>
          <div className="w-10 h-10 bg-indigo-600 rounded-md shadow-lg shadow-indigo-100 flex items-center justify-center text-white font-black text-xl">
            {userRole === "admin" ? "R" : "I"}
          </div>
        </div>
      </header>

      {/* Main content area with sidebar and content as siblings */}
      <div className="flex">
        {/* Sidebar wrapper - sticky to follow screen when scrolling */}
        <div className="sticky top-0 h-screen">
          <Sidebar
            onSelect={setCurrentView}
            activeView={currentView}
            userRole={userRole}
            expanded={sidebarExpanded}
            onExpandChange={setSidebarExpanded}
          />
        </div>

        {/* Main content area */}
        <main className="flex-1 flex flex-col">
          <div className="p-8 flex-1">
            <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500">
              {renderView()}
            </div>
          </div>

          <footer className="p-6 text-center text-[9px] font-bold text-slate-300 uppercase tracking-[0.4em]">
            JRMSU - College of Computing Studies © 2026
          </footer>
        </main>
      </div>
    </div>
  );
};

export default App;
