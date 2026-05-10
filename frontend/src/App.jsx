import { useState, useEffect } from "react";
import Sidebar from "./components/sideBar";
import { Navbar } from "./components/navBar";
import Dashboard from "./pages/dashboard";
import Laboratories from "./pages/laboratories";
import Equipment from "./pages/equipment";
import Peripherals from "./pages/peripherals";
import Settings from "./pages/settings";
import DamageReports from "./pages/reports";
import BorrowTransactions from "./pages/borrow";
import Login from "./pages/login";
import ActivityLogs from "./pages/logs";
import UserManagement from "./pages/users";

const App = () => {
  const [userRole, setUserRole] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [currentView, setCurrentView] = useState("dashboard");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const loggedIn = localStorage.getItem("isLoggedIn");

    if (token && role && loggedIn === "true") {
      setUserRole(role);
      setIsLoggedIn(true);
      const savedView = localStorage.getItem("currentView");
      if (savedView) {
        setCurrentView(savedView);
      }
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (role) => {
    setUserRole(role);
    setIsLoggedIn(true);
    setCurrentView("dashboard");
    localStorage.setItem("currentView", "dashboard");
  };

  const handleSetView = (view) => {
    localStorage.setItem("currentView", view);
    setCurrentView(view);
  };

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
    setUserRole(null);
    setIsLoggedIn(false);
    setCurrentView("dashboard");
    document.documentElement.classList.remove("dark");
  };

  const renderView = () => {
    switch (currentView) {
      case "dashboard":
        return <Dashboard userRole={userRole} onNavigate={handleSetView} />;
      case "laboratories":
        return <Laboratories userRole={userRole} />;
      case "equipment":
        return <Equipment userRole={userRole} />;
      case "peripherals":
        return <Peripherals userRole={userRole} />;
      case "borrow":
        return <BorrowTransactions userRole={userRole} />;
      case "users":
        return <UserManagement userRole={userRole} />;
      case "reports":
        return <DamageReports userRole={userRole} />;
      case "logs":
        return <ActivityLogs userRole={userRole} />;
      case "settings":
        return <Settings userRole={userRole} />;
      default:
        return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] border border-dashed border-slate-200 rounded-2xl">
            <p className="text-base font-semibold text-slate-500 uppercase tracking-widest mb-2">
              {currentView}
            </p>
            <p className="text-sm text-slate-400 font-mono">
              ./pages/
              {currentView.charAt(0).toUpperCase() + currentView.slice(1)}.jsx
            </p>
            <p className="mt-3 text-sm text-slate-400">
              This page hasn't been built yet.
            </p>
          </div>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen bg-slate-50 items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      <Sidebar
        onSelect={handleSetView}
        activeView={currentView}
        userRole={userRole}
        expanded={sidebarExpanded}
        onExpandChange={setSidebarExpanded}
      />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar
          currentView={currentView}
          userRole={userRole}
          onLogout={handleLogout}
          onNavigate={handleSetView}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="p-8 max-w-7xl mx-auto">{renderView()}</div>
          <footer className="px-8 pb-6 text-center text-xs text-slate-300 tracking-widest uppercase">
            JRMSU — College of Computing Studies © 2026
          </footer>
        </main>
      </div>
    </div>
  );
};

export default App;