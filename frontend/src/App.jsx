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
import About from "./pages/about";
import { useRefresh } from "./contexts/RefreshContext";

const App = () => {
  const [userRole, setUserRole] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState("dashboard");
  const [isLoading, setIsLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved === "true";
  });
  const { triggerRefresh } = useRefresh();

  // Apply dark mode class to html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Check for existing session on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const isLoggedInFlag = localStorage.getItem("isLoggedIn");
    const userDataStr = localStorage.getItem("userData");

    if (token && role && isLoggedInFlag === "true") {
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
      const savedView = localStorage.getItem("currentView");
      if (savedView && savedView !== "login") {
        setCurrentView(savedView);
      }
    } else {
      setIsLoggedIn(false);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUserRole(userData.role);
    setCurrentUser(userData);
    setIsLoggedIn(true);
    setCurrentView("dashboard");
    localStorage.setItem("currentView", "dashboard");
    localStorage.setItem("isLoggedIn", "true");
    triggerRefresh();
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
    localStorage.removeItem("userData");
    localStorage.removeItem("savedUsername");
    localStorage.removeItem("rememberMe");
    setUserRole(null);
    setCurrentUser(null);
    setIsLoggedIn(false);
    setCurrentView("dashboard");
    triggerRefresh();
  };

  const renderView = () => {
    const props = { 
      userRole, 
      currentUser, 
      onNavigate: handleSetView,
      onRefresh: triggerRefresh,
      darkMode,
      setDarkMode
    };
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
      case "about":
        return <About {...props} />;
      default:
        return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] border border-dashed border-slate-200 dark:border-slate-700 rounded-2xl">
            <p className="text-base font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">
              {currentView}
            </p>
            <p className="text-sm text-slate-400 dark:text-slate-500 font-mono">
              ./pages/{currentView.charAt(0).toUpperCase() + currentView.slice(1)}.jsx
            </p>
            <p className="mt-3 text-sm text-slate-400 dark:text-slate-500">
              This page hasn't been built yet.
            </p>
          </div>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen bg-slate-50 dark:bg-slate-950 items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-slate-200 dark:border-slate-700 border-t-slate-900 dark:border-t-slate-100 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} darkMode={darkMode} />;
  }

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 font-sans overflow-hidden transition-colors">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: darkMode ? "#1e293b" : "#363636",
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
      
      {/* Sidebar with logout and user info */}
      <Sidebar
        onSelect={handleSetView}
        activeView={currentView}
        userRole={userRole}
        onLogout={handleLogout}
        currentUser={currentUser}
        darkMode={darkMode}
      />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar
          currentView={currentView}
          userRole={userRole}
          currentUser={currentUser}
          onNavigate={handleSetView}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="p-8 max-w-7xl mx-auto">
            {renderView()}
          </div>
          <footer className="px-8 pb-6 text-center text-xs text-slate-400 dark:text-slate-600 tracking-widest uppercase">
            JRMSU — College of Computing Studies © 2026
          </footer>
        </main>
      </div>
    </div>
  );
};

export default App;