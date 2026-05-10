import { useEffect, useState } from "react";

export default function Loading({ message = "Loading..." }) {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center z-50">
      {/* Animated background circles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-3xl" />
      </div>

      {/* Loading Content */}
      <div className="relative z-10 text-center">
        {/* Rotating Logo */}
        <div className="mb-8 flex justify-center">
          <img
            src="/logo.png"
            alt="CLAMS Logo"
            className="w-64 h-64 object-contain animate-logo-spin"
            style={{
              animation: "spin 2s linear infinite",
              filter: "drop-shadow(0 0 30px rgba(0,0,0,0.5))",
            }}
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/256x256?text=CLAMS";
            }}
          />
        </div>

        {/* Loading Text */}
        <h1 className="text-5xl font-black text-white mb-4 tracking-tighter">
          CLAMS
        </h1>
        <div className="flex items-center justify-center gap-1">
          <p className="text-indigo-300 text-base font-semibold uppercase tracking-wider">
            {message}
          </p>
          <span className="text-indigo-300 text-base font-semibold">
            {dots}
          </span>
        </div>

        {/* Loading Spinner */}
        <div className="mt-8 flex justify-center">
          <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
        </div>

        <p className="text-slate-400 text-xs mt-8">
          College of Computing Studies • JRMSU
        </p>
      </div>

      {/* Add animations */}
      <style>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        .animate-logo-spin {
          animation: spin 2s linear infinite;
        }
      `}</style>
    </div>
  );
}
