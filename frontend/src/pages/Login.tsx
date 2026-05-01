import React, { useState } from "react";
import { Package, Lock, User, ArrowRight } from "lucide-react";

interface LoginProps {
  onLogin: (role: "admin" | "instructor") => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // SUCCESS STATE: This ensures the UI reflects the login immediately
  const [isSuccess, setIsSuccess] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    // CASE-SENSITIVE CHECK
    const user = username.trim().toLowerCase();
    const pass = password.trim();

    if (user === "admin" && pass === "admin123") {
      setIsSuccess(true);
      setTimeout(() => onLogin("admin"), 1000); // 1s delay for "Success" animation
    } else if (user === "instructor" && pass === "pass123") {
      setIsSuccess(true);
      setTimeout(() => onLogin("instructor"), 1000);
    } else {
      setError("Access Denied: Invalid Credentials");
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
        <div className="w-20 h-20 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-6"></div>
        <h1 className="text-white font-black tracking-[0.5em] animate-pulse uppercase">
          Initializing Session...
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 font-sans overflow-hidden relative">
      {/* Background Blurs */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-50 rounded-full blur-[120px] opacity-60"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-100 rounded-full blur-[100px] opacity-40"></div>

      <div className="w-full max-w-[650px] bg-white rounded-md shadow-[0_50px_100px_-20px_rgba(79,70,229,0.15)] p-14 border border-slate-100 relative z-10">
        <div className="flex flex-col items-center mb-14 text-center">
          <div className="relative w-24 h-24 perspective-1000 mb-8">
            <div className="absolute inset-0 bg-indigo-600/20 rounded-full blur-[40px] animate-pulse"></div>
            <div className="w-full h-full relative animate-[flip_8s_linear_infinite] preserve-3d">
              <div className="absolute inset-0 w-full h-full bg-slate-900 rounded-[2rem] flex items-center justify-center border-2 border-indigo-500 shadow-2xl backface-hidden">
                <span className="text-white font-black text-5xl italic tracking-tighter">
                  C
                </span>
              </div>
              <div className="absolute inset-0 w-full h-full bg-indigo-600 rounded-[2rem] flex items-center justify-center border-2 border-white/30 rotate-y-180 backface-hidden">
                <Package className="text-white" size={44} />
              </div>
            </div>
          </div>

          <h1 className="flex items-baseline font-black text-slate-800 tracking-tighter">
            <span className="text-7xl text-indigo-600 mr-1 animate-pulse">
              C
            </span>
            <span className="text-5xl uppercase">LAMS</span>
          </h1>

          <div className="flex items-center gap-4 w-full mt-4">
            <div className="h-px flex-1 bg-slate-100"></div>
            <h2 className="text-[12px] font-black text-slate-400 uppercase tracking-[0.3em] whitespace-nowrap">
              CCS Laboratory Asset Management System
            </h2>
            <div className="h-px flex-1 bg-slate-100"></div>
          </div>
        </div>

        <form
          onSubmit={handleLogin}
          className="space-y-6 max-w-[400px] mx-auto"
        >
          {error && (
            <div className="bg-rose-50 text-rose-500 text-[10px] font-black py-4 rounded-2xl text-center uppercase tracking-widest border border-rose-100 animate-bounce">
              ⚠️ {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-2">
              Authorized ID
            </label>
            <div className="relative group">
              <User
                className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors"
                size={18}
              />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin / instructor"
                className="w-full bg-slate-50 border border-slate-100 py-4 pl-14 pr-6 rounded-2xl outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium text-slate-700"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-2">
              Security Key
            </label>
            <div className="relative group">
              <Lock
                className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors"
                size={18}
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-100 py-4 pl-14 pr-6 rounded-2xl outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium text-slate-700"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-slate-950 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 shadow-2xl hover:bg-indigo-600 transition-all duration-500 group mt-4"
          >
            Initialize Session
            <ArrowRight
              size={18}
              className="group-hover:translate-x-2 transition-transform"
            />
          </button>
        </form>

        <div className="mt-12 text-center text-[10px] text-slate-300 font-bold uppercase tracking-widest">
          System Managed by{" "}
          <span className="text-indigo-400 font-black"> BSIS-2 </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
