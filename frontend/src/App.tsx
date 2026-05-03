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
import { Navbar } from "./components/navBar";

const App: React.FC = () => {
  const [userRole, setUserRole] = useState<"admin" | "instructor">("admin");
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState(
    () => localStorage.getItem("currentView") || "dashboard",
  );
  const handleSetView = (view: string) => {
    localStorage.setItem("currentView", view);
    setCurrentView(view);
  };

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
      <Navbar currentView={currentView} userRole={userRole} />

      {/* Main content area with sidebar and content as siblings */}
      <div className="flex">
        <div className="sticky top-0 h-screen">
          <Sidebar
            onSelect={handleSetView}
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
