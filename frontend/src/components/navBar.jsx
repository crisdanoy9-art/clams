import { useState, useEffect } from "react";
import { Settings, Info, ChevronDown, Shield, User, Moon, Sun } from "lucide-react";
import NotificationBell from "./NotificationBell";

export function Navbar({ currentView, userRole, currentUser, onNavigate, darkMode, setDarkMode }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeString = currentTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const dateString = currentTime.toLocaleDateString([], {
    month: "short",
    day: "numeric",
  });

  const username = currentUser?.username || localStorage.getItem("userName") || "User";
  const userFirstName = currentUser?.first_name || "";
  const userLastName = currentUser?.last_name || "";
  
  let displayName = "CLAMS ADMIN";
  if (userFirstName && userLastName) {
    displayName = `${userFirstName} ${userLastName}`.toUpperCase();
  } else if (username) {
    displayName = username.toUpperCase();
  }

  const firstLetter = displayName.charAt(0).toUpperCase();

  const viewTitle = currentView
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase())
    .trim();

  const getRoleLabel = () => {
    if (userRole === "admin") {
      return "Administrator";
    }
    return "Instructor";
  };

  const getRoleIcon = () => {
    if (userRole === "admin") {
      return <Shield size={14} className="text-purple-600 dark:text-purple-400" />;
    }
    return <User size={14} className="text-blue-600 dark:text-blue-400" />;
  };

  const getRoleColor = () => {
    if (userRole === "admin") {
      return "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300";
    }
    return "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300";
  };

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", newMode);
    if (newMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <header className="h-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 transition-colors">
      {/* Left Side - Title */}
      <div className="pl-8">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white capitalize">
          {viewTitle}
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 tracking-wide">
          CCS Laboratory Asset Management System
        </p>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4 pr-8">
        {/* Time */}
        <div className="hidden md:flex flex-col items-end">
          <span className="text-sm font-mono font-semibold text-slate-700 dark:text-slate-300">
            {timeString}
          </span>
          <span className="text-xs text-slate-400 dark:text-slate-500">{dateString}</span>
        </div>

        <div className="w-px h-8 bg-slate-200 dark:bg-slate-700" />

        {/* Notification Bell */}
        <NotificationBell userRole={userRole} onNavigate={onNavigate} />

        {/* User Info */}
        <div className="hidden sm:flex flex-col items-end">
          <p className="text-sm font-bold text-slate-800 dark:text-white tracking-wide">
            {displayName}
          </p>
          <div className="flex items-center gap-1.5 mt-0.5">
            {getRoleIcon()}
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getRoleColor()}`}>
              {getRoleLabel()}
            </span>
          </div>
        </div>

        {/* Avatar Menu - About, Settings, Dark Mode */}
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-1 py-1 pl-1 pr-0 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer group"
          >
            <div className={`w-10 h-10 rounded-xl text-white text-sm font-bold flex items-center justify-center shadow-sm ${
              userRole === "admin" ? "bg-purple-600 dark:bg-purple-700" : "bg-slate-700 dark:bg-slate-600"
            }`}>
              {firstLetter}
            </div>
            <ChevronDown
              size={14}
              className={`text-slate-400 dark:text-slate-500 transition-all duration-200 ${
                isUserMenuOpen ? "rotate-180" : ""
              } group-hover:text-slate-600 dark:group-hover:text-slate-300`}
            />
          </button>

          {isUserMenuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setIsUserMenuOpen(false)} />
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-20">
                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl text-white text-sm font-bold flex items-center justify-center ${
                      userRole === "admin" ? "bg-purple-600 dark:bg-purple-700" : "bg-slate-700 dark:bg-slate-600"
                    }`}>
                      {firstLetter}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-800 dark:text-white">{displayName}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {getRoleIcon()}
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getRoleColor()}`}>
                          {getRoleLabel()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* About Button */}
                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    onNavigate("about");
                  }}
                  className="w-full text-left px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-3 transition-colors"
                >
                  <Info size={17} className="text-slate-500 dark:text-slate-400" />
                  <span className="font-medium">About</span>
                </button>

                {/* Settings Button */}
                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    onNavigate("settings");
                  }}
                  className="w-full text-left px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-3 transition-colors"
                >
                  <Settings size={17} className="text-slate-500 dark:text-slate-400" />
                  <span className="font-medium">Settings</span>
                </button>

                {/* Dark Mode Toggle */}
                <button
                  onClick={() => {
                    toggleDarkMode();
                    setIsUserMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-3 transition-colors"
                >
                  {darkMode ? (
                    <Sun size={17} className="text-amber-500" />
                  ) : (
                    <Moon size={17} className="text-slate-500 dark:text-slate-400" />
                  )}
                  <span className="font-medium">{darkMode ? "Light Mode" : "Dark Mode"}</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}