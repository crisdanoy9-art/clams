import React, { useState, useEffect } from "react";
import { User, Info, Moon, Sun, ChevronDown } from "lucide-react";
import AboutModal from "./AboutModal";

export function Navbar({ currentView, userRole, onLogout, onNavigate }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    if (newDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const timeString = currentTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const dateString = currentTime.toLocaleDateString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const username = localStorage.getItem("userName") || "Admin User";
  const firstLetter = username.charAt(0).toUpperCase();

  const viewTitle = currentView
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase())
    .trim();

  return (
    <>
      <header className="h-20 bg-white border-b border-slate-100 px-8 flex items-center justify-between shrink-0 transition-colors duration-300 dark:bg-slate-900 dark:border-slate-700">
        {/* Left: page title */}
        <div>
          <h2 className="text-lg font-semibold text-slate-800 capitalize dark:text-white">
            {viewTitle}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 tracking-wide dark:text-slate-500">
            CCS Laboratory Asset Management System
          </p>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-6">
          {/* Clock */}
          <div className="hidden md:flex flex-col items-end gap-0.5">
            <span className="text-sm font-mono font-semibold text-slate-700 tabular-nums dark:text-slate-300">
              {timeString}
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500">{dateString}</span>
          </div>

          <div className="w-px h-8 bg-slate-100 dark:bg-slate-700" />

          {/* User info */}
          <div className="hidden sm:flex flex-col items-end gap-0.5">
            <p className="text-sm font-semibold text-slate-800 dark:text-white">{username}</p>
            <p className="text-xs text-slate-400 dark:text-slate-500">JRMSU Main Campus</p>
          </div>

          {/* Avatar dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 py-1.5 pl-1.5 pr-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 dark:from-indigo-600 dark:to-indigo-700 text-white text-sm font-bold flex items-center justify-center shrink-0 shadow-md">
                {firstLetter}
              </div>
              <ChevronDown
                size={18}
                className={`text-slate-500 dark:text-slate-400 transition-all duration-200 
                  ${isUserMenuOpen ? "rotate-180 text-indigo-600 dark:text-indigo-400" : ""} 
                  group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:scale-110`}
                strokeWidth={2.5}
              />
            </button>

            {/* Dropdown menu */}
            {isUserMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsUserMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl border border-slate-100 shadow-xl py-1.5 z-20 dark:bg-slate-800 dark:border-slate-700 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-4 py-2.5 border-b border-slate-50 dark:border-slate-700">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest dark:text-slate-500">
                      Account
                    </p>
                  </div>

                  {/* Profile button */}
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      onNavigate("settings");
                    }}
                    className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    <User size={17} className="text-slate-400 dark:text-slate-500" />
                    <span className="font-medium">Profile</span>
                  </button>

                  {/* About button - opens the modal */}
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      setIsAboutOpen(true);
                    }}
                    className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    <Info size={17} className="text-indigo-500 dark:text-indigo-400" />
                    <span className="font-medium">About</span>
                  </button>

                  <div className="my-1 border-t border-slate-100 dark:border-slate-700" />

                  {/* Dark mode toggle */}
                  <button
                    onClick={() => {
                      toggleDarkMode();
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    {isDarkMode ? (
                      <>
                        <Sun size={17} className="text-amber-500" />
                        <span className="font-medium">Light Mode</span>
                      </>
                    ) : (
                      <>
                        <Moon size={17} className="text-slate-400 dark:text-slate-500" />
                        <span className="font-medium">Dark Mode</span>
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* About Modal */}
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
    </>
  );
}