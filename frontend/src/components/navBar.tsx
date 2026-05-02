import React, { useState, useEffect } from 'react';

interface Props {
  currentView: string;
  userRole: string;
}

export function Navbar({ currentView, userRole }: Props) {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Real-time clock update every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const timeString = currentTime.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  // Show full date with current year (e.g., "Apr 2, 2026")
  const dateString = currentTime.toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
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
        <div className="w-10 h-10 bg-indigo-600 rounded-md shadow-lg shadow-indigo-100 flex items-center justify-center text-white font-black text-xl">
          {userRole === "admin" ? "R" : "I"}
        </div>
      </div>
    </header>
  );
}