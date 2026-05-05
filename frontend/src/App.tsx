// App.tsx
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
import Settings from "./pages/Settings"; // <-- import Settings
import { AlertTriangle } from "lucide-react";

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

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  const renderView = () => {
    try {
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
          return <DamageReports />;
        case "users":
          return userRole === "admin" ? (
            <Users />
          ) : (
            <Dashboard userRole={userRole} />
          );
        case "logs":
          return <ActivityLogs />;
        case "settings": // <-- new case
          return <Settings />;
        case "logout":
          handleLogout();
          return null;
        default:
          return <Dashboard userRole={userRole} />;
      }
    } catch (error) {
      console.error("Render error:", error);
      return (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-red-800 mb-2">
            Something went wrong
          </h2>
          <p className="text-red-700">
            Unable to load this page. Please try again.
          </p>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-100">
      <Navbar currentView={currentView} userRole={userRole} />

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

