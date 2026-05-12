import { useState, useEffect } from "react";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

export default function Login({ onLogin, darkMode }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedUsername = localStorage.getItem("savedUsername");
    if (savedUsername) {
      setUsername(savedUsername);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:3000/auth/login", {
        username,
        password,
      });

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role || "admin");
      localStorage.setItem("userName", user.username);
      localStorage.setItem("userEmail", user.email || "");
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userData", JSON.stringify(user));

      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
        localStorage.setItem("savedUsername", username);
      } else {
        localStorage.removeItem("rememberMe");
        localStorage.removeItem("savedUsername");
      }

      toast.success(`Welcome back, ${user.username}!`);
      onLogin(user);
    } catch (err) {
      const errorMsg =
        err.response?.data?.msg || err.response?.data?.error || "Login failed";
      setError(errorMsg);
      toast.error(errorMsg);
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    toast("Contact system administrator to reset password", {
      icon: "📧",
      duration: 4000,
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-slate-200 dark:border-slate-700 border-t-slate-900 dark:border-t-slate-100 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500 dark:text-slate-400">Authenticating credentials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Left Side - Logo & Branding with Background Image */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900 flex-col items-center justify-center relative overflow-hidden">
        {/* Background Image Placeholder */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage: "url('/bg.jpg')",
          }}
        />
        
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-3xl" />
        </div>

        {/* Centered Content - Logo and Text */}
        <div className="relative z-10 text-center flex-1 flex flex-col items-center justify-center">
          {/* Logo - Much Bigger */}
          <div className="mb-8 flex justify-center">
            <img
              src="/logo.png"
              alt="CLAMS Logo"
              className="w-96 h-96 object-contain animate-logo-spin"
              style={{
                filter: "drop-shadow(0 0 30px rgba(0,0,0,0.4))",
              }}
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/384x384?text=CLAMS";
              }}
            />
          </div>
          
          {/* Title - Bigger */}
          <h1 className="text-8xl font-black text-white mb-4 tracking-tighter">
            CLAMS
          </h1>
          <p className="text-indigo-300 text-lg font-semibold uppercase tracking-wider">
            Laboratory Asset Management System
          </p>
        </div>
        
        {/* Copyright - Very Bottom */}
        <div className="relative z-10 w-full py-6 text-center">
          <p className="text-sm text-slate-400">© 2026 CLAMS — All Rights Reserved</p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <img
              src="/logo.png"
              alt="CLAMS Logo"
              className="w-32 h-32 object-contain mx-auto mb-4 animate-logo-spin"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/128x128?text=CLAMS";
              }}
            />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome Back</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Sign in to continue</p>
          </div>

          {/* Form Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 p-8">
            {/* Welcome Text - Centered */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Welcome Back
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Sign in to continue to CLAMS
              </p>
            </div>

            {error && (
              <div className="mb-6 p-3 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-800 rounded-xl flex items-center gap-2">
                <AlertCircle size={16} className="text-red-500 shrink-0" />
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100 focus:border-transparent transition dark:text-white"
                  placeholder="Enter your username"
                  required
                  autoComplete="username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100 focus:border-transparent transition pr-10 dark:text-white"
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

             

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-slate-900 dark:bg-slate-700 text-white text-sm font-semibold rounded-xl hover:bg-slate-700 dark:hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            
          </div>
        </div>
      </div>

      {/* Animation Styles */}
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
          animation: spin 20s linear infinite;
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.6;
          }
        }
        
        .animate-pulse {
          animation: pulse 3s ease-in-out infinite;
        }
        
        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
}