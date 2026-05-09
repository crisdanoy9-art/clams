import { useState, useEffect } from "react";
import { Settings, LogOut, LayoutDashboard, ChevronDown } from "lucide-react";

export function Navbar({ currentView, userRole, onLogout, onNavigate }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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

  const username = localStorage.getItem("username") || "User";
  const firstLetter = username.charAt(0).toUpperCase();

  const viewTitle = currentView
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase())
    .trim();

  return (
    <header className="h-20 bg-white border-b border-slate-100 px-8 flex items-center justify-between shrink-0">
      {/* Left: page title */}
      <div>
        <h2 className="text-lg font-semibold text-slate-800 capitalize">
          {viewTitle}
        </h2>
        <p className="text-xs text-slate-400 mt-0.5 tracking-wide">
          CCS Laboratory Asset Management System
        </p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-6">
        {/* Clock */}
        <div className="hidden md:flex flex-col items-end gap-0.5">
          <span className="text-sm font-mono font-semibold text-slate-700 tabular-nums">
            {timeString}
          </span>
          <span className="text-xs text-slate-400">{dateString}</span>
        </div>

        <div className="w-px h-8 bg-slate-100" />

        {/* Username */}
        <div className="hidden sm:flex flex-col items-end gap-0.5">
          <p className="text-sm font-semibold text-slate-800">{username}</p>
          <p className="text-xs text-slate-400">JRMSU Main Campus</p>
        </div>

        {/* Avatar + dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen((p) => !p)}
            /* Reduced gap and padding to keep chevron near the box */
            className="flex items-center gap-1.5 py-1 pl-1 pr-0 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white text-sm font-bold flex items-center justify-center shrink-0 shadow-sm">
              {firstLetter}
            </div>
            <ChevronDown
              size={14}
              className={`text-slate-400 transition-all duration-200 ${
                isUserMenuOpen ? "rotate-180" : ""
              } group-hover:text-slate-600`}
            />
          </button>

          {isUserMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsUserMenuOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl border border-slate-100 shadow-xl py-1.5 z-20 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-4 py-2.5 border-b border-slate-50">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                    Account
                  </p>
                </div>

                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    onNavigate("dashboard");
                  }}
                  className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors"
                >
                  <LayoutDashboard size={17} className="text-slate-400" />
                  <span className="font-medium">Dashboard</span>
                </button>

                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    onNavigate("settings");
                  }}
                  className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors"
                >
                  <Settings size={17} className="text-slate-400" />
                  <span className="font-medium">Settings</span>
                </button>

                <div className="my-1 border-t border-slate-50" />

                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    onLogout();
                  }}
                  className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50 flex items-center gap-3 transition-colors"
                >
                  <LogOut size={17} />
                  <span className="font-medium">Log out</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
