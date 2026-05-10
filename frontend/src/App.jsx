// frontend/src/App.jsx
import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
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
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [currentView, setCurrentView] = useState("dashboard");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for existing session
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const isLoggedInFlag = localStorage.getItem("isLoggedIn");
    const userDataStr = localStorage.getItem("userData");

    console.log("Checking localStorage on refresh:", {
      token: !!token,
      role: role,
      isLoggedInFlag: isLoggedInFlag,
    });

    if (token && role && isLoggedInFlag === "true") {
      // Restore session from localStorage
      setUserRole(role);
      if (userDataStr) {
        try {
          const userData = JSON.parse(userDataStr);
          setCurrentUser(userData);
        } catch (e) {
          console.error("Error parsing userData", e);
        }
      }
      setIsLoggedIn(true);

      // Restore last view
      const savedView = localStorage.getItem("currentView");
      if (savedView && savedView !== "login") {
        setCurrentView(savedView);
      }
    } else {
      // No session found
      console.log("No session found in localStorage");
      setIsLoggedIn(false);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (userData) => {
    console.log("Login received userData:", userData);
    console.log("User role from userData:", userData.role);
    setUserRole(userData.role);
    setCurrentUser(userData);
    setIsLoggedIn(true);
    setCurrentView("dashboard");
    localStorage.setItem("currentView", "dashboard");
    localStorage.setItem("isLoggedIn", "true");
  };

  const handleSetView = (view) => {
    localStorage.setItem("currentView", view);
    setCurrentView(view);
  };

  const handleLogout = () => {
    console.log("Logging out, clearing localStorage");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("currentView");
    localStorage.removeItem("userData");
    localStorage.removeItem("savedUsername");
    localStorage.removeItem("rememberMe");
    setUserRole(null);
    setCurrentUser(null);
    setIsLoggedIn(false);
    setCurrentView("dashboard");
  };

  const renderView = () => {
    const props = { userRole, currentUser, onNavigate: handleSetView };
    switch (currentView) {
      case "dashboard":
        return <Dashboard {...props} />;
      case "laboratories":
        return <Laboratories {...props} />;
      case "equipment":
        return <Equipment {...props} />;
      case "peripherals":
        return <Peripherals {...props} />;
      case "borrow":
        return <BorrowTransactions {...props} />;
      case "users":
        return <UserManagement {...props} />;
      case "reports":
        return <DamageReports {...props} />;
      case "logs":
        return <ActivityLogs {...props} />;
      case "settings":
        return <Settings {...props} />;
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

  const showSidebar = currentView !== "settings";

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: "#10b981",
              secondary: "#fff",
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />
      {showSidebar && (
        <Sidebar
          onSelect={handleSetView}
          activeView={currentView}
          userRole={userRole}
          expanded={sidebarExpanded}
          onExpandChange={setSidebarExpanded}
        />
      )}

      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar
          currentView={currentView}
          userRole={userRole}
          currentUser={currentUser}
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
