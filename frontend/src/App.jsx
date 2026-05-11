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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentView, setCurrentView] = useState("dashboard");
  const [isLoading, setIsLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved === "true";
  });
  const { triggerRefresh } = useRefresh();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

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
    setIsMobileMenuOpen(false);
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
          <div className="flex flex-col items-center justify-center min-h-[60vh] border border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-center">
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
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-slate-200 dark:border-slate-700 border-t-slate-900 dark:border-t-slate-100 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base">Loading...</p>
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
            fontSize: "14px",
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
      
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      {/* Sidebar - Responsive */}
      <div 
        className={`fixed top-0 left-0 h-full z-50 transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar
          onSelect={handleSetView}
          activeView={currentView}
          userRole={userRole}
          onLogout={handleLogout}
          currentUser={currentUser}
          darkMode={darkMode}
          isMobileOpen={isMobileMenuOpen}
          onMobileClose={() => setIsMobileMenuOpen(false)}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden w-full">
        <Navbar
          currentView={currentView}
          userRole={userRole}
          currentUser={currentUser}
          onNavigate={handleSetView}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
            {renderView()}
          </div>
          <footer className="px-4 sm:px-6 md:px-8 pb-4 sm:pb-6 text-center text-xs text-slate-400 dark:text-slate-600 tracking-widest uppercase">
            JRMSU — College of Computing Studies © 2026
          </footer>
        </main>
      </div>
    </div>
  );
};

export default App;