import { useState, useEffect } from "react";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import Loading from "../components/loading";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Check for saved email on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem("savedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simulate API delay
    setTimeout(() => {
      let user = null;

      // Valid credentials
      if (email === "admin" && password === "admin123") {
        user = { role: "admin", name: "Admin User", email: "admin@clams.edu" };
      } else if (email === "ins" && password === "ins123") {
        user = {
          role: "instructor",
          name: "John Doe",
          email: "instructor@clams.edu",
        };
      }

      if (user) {
        // Store in localStorage
        localStorage.setItem("token", "mock-jwt-token-" + Date.now());
        localStorage.setItem("role", user.role);
        localStorage.setItem("userName", user.name);
        localStorage.setItem("userEmail", user.email);
        localStorage.setItem("isLoggedIn", "true");

        if (rememberMe) {
          localStorage.setItem("rememberMe", "true");
          localStorage.setItem("savedEmail", email);
        } else {
          localStorage.removeItem("rememberMe");
          localStorage.removeItem("savedEmail");
        }

        onLogin(user.role);
      } else {
        setError("Invalid credentials. Use: admin/admin123 or ins/ins123");
        setIsLoading(false);
      }
    }, 800);
  };

  const handleForgotPassword = () => {
    alert(
      "Please contact the system administrator to reset your password.\n\nAdmin: admin / admin123\nInstructor: ins / ins123",
    );
  };

  if (isLoading) {
    return <Loading message="Authenticating credentials" />;
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Left Side - Logo & Branding */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-slate-900 to-slate-800 items-center justify-center relative overflow-hidden">
        {/* Animated background circles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-3xl" />
        </div>

        {/* Logo Container - NO BOX, JUST PURE LOGO */}
        <div className="relative z-10 text-center">
          <div className="mb-8 flex justify-center">
            <img
              src="/logo.png"
              alt="CLAMS Logo"
              className="w-96 h-96 object-contain animate-logo-spin"
              style={{
                animation: "spin 20s linear infinite",
                filter: "drop-shadow(0 0 20px rgba(0,0,0,0.3))",
              }}
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/384x384?text=CLAMS";
              }}
            />
          </div>
          <h1 className="text-7xl font-black text-white mb-3 tracking-tighter">
            CLAMS
          </h1>
          <p className="text-indigo-300 text-base font-semibold uppercase tracking-wider">
            Laboratory Asset Management System
          </p>
          <p className="text-slate-400 text-sm mt-6 max-w-md mx-auto">
            College of Computing Studies • JRMSU Main Campus
          </p>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-10 left-10 text-xs text-slate-500">
          <p>© 2026 CLAMS</p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo (visible only on mobile) */}
          <div className="lg:hidden text-center mb-8">
            <img
              src="/logo.png"
              alt="CLAMS Logo"
              className="w-24 h-24 object-contain mx-auto mb-4"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/96x96?text=CLAMS";
              }}
            />
            <h2 className="text-2xl font-bold text-slate-900">Welcome Back</h2>
            <p className="text-sm text-slate-500 mt-1">Sign in to continue</p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
            <div className="hidden lg:block mb-8">
              <h2 className="text-2xl font-bold text-slate-900">
                Welcome Back
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Sign in to continue to CLAMS
              </p>
            </div>

            {error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2">
                <AlertCircle size={16} className="text-red-500 shrink-0" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Username
                </label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition"
                  placeholder="Enter your username"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition pr-10"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                  />
                  <span className="text-sm text-slate-600">Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-indigo-600 hover:text-indigo-700 font-medium transition"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                Sign In
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-100">
              <div className="text-center">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-2">
                  Demo Credentials
                </p>
                <div className="space-y-1">
                  <p className="text-xs text-slate-500">
                    <span className="font-mono bg-slate-100 px-2 py-0.5 rounded">
                      admin
                    </span>
                    <span className="mx-2">/</span>
                    <span className="font-mono bg-slate-100 px-2 py-0.5 rounded">
                      admin123
                    </span>
                    <span className="ml-2 text-indigo-600">(Admin)</span>
                  </p>
                  <p className="text-xs text-slate-500">
                    <span className="font-mono bg-slate-100 px-2 py-0.5 rounded">
                      ins
                    </span>
                    <span className="mx-2">/</span>
                    <span className="font-mono bg-slate-100 px-2 py-0.5 rounded">
                      ins123
                    </span>
                    <span className="ml-2 text-emerald-600">(Instructor)</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add spin animation */}
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
      `}</style>
    </div>
  );
}
