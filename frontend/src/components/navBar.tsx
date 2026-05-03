import React, { useState, useEffect } from "react";
import { Settings, LogOut, ChevronDown } from "lucide-react";
interface Props {
  currentView: string;
  userRole: string;
}

export function Navbar({ currentView, userRole }: Props) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  // Real-time clock update every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const timeString = currentTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  // Show full date with current year (e.g., "Apr 2, 2026")
  const dateString = currentTime.toLocaleDateString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
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
        {/* Real-time clock with current year */}
        <div className="hidden md:flex items-center gap-3 px-3 py-1.5 bg-indigo-50/70 rounded-full border border-indigo-200 shadow-sm">
          <div className="flex flex-col items-end">
            <span className="text-[11px] font-mono font-bold text-indigo-800 tabular-nums">
              {timeString}
            </span>
            <span className="text-[9px] font-bold uppercase tracking-wide text-indigo-600">
              {dateString}
            </span>
          </div>
        </div>
        {/* User info */}
        <div className="text-right hidden sm:block">
          <p className="text-xs font-bold text-slate-900">
            {userRole === "admin" ? "Raylle Admin" : "Staff Instructor"}
          </p>
          <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-tighter">
            JRMSU Main Campus
          </p>
        </div>
        <div className="relative">
          {/* Avatar Toggle Button */}
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="group relative p-1 hover:bg-slate-100 rounded-md transition-all cursor-pointer cursor-pointer"
          >
            {/* Avatar Box */}
            <div className="relative w-10 h-10 bg-indigo-600 text-white rounded-md flex items-center justify-center font-bold shadow-sm">
              {userRole === "admin" ? "R" : "I"}

              {/* Indicator at Bottom Right (Facebook style) */}
              <div
                className={`absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-md border border-slate-100 transition-transform duration-200 cursor-pointer ${
                  isUserMenuOpen ? "rotate-180" : "rotate-0"
                }`}
              >
                <ChevronDown size={10} className="text-slate-600" />
              </div>
            </div>
          </button>

          {/* Dropdown Menu */}
          {isUserMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsUserMenuOpen(false)}
              ></div>

              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xs border border-slate-200 py-1 z-20 animate-in fade-in zoom-in duration-150 origin-top-right">
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Account Management
                  </p>
                </div>

                <button
                  onClick={() => setIsUserMenuOpen(false)}
                  className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors"
                >
                  <Settings size={16} className="text-slate-400" />
                  <span className="font-medium">Settings</span>
                </button>

                <button
                  onClick={() => setIsUserMenuOpen(false)}
                  className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                >
                  <LogOut size={16} />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </>
          )}
        </div>{" "}
      </div>
    </header>
  );
}

