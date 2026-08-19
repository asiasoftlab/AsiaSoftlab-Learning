"use client";
import { useState, useEffect } from "react";
import { Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { api, getApiError } from "@/lib/api";
import { useAuthStore } from "@/store/auth.store";
import toast from "react-hot-toast";

export default function AdminLoginPage() {
  const router = useRouter();
  const { setAuth, user, isAuthenticated, isLoading: authLoading } = useAuthStore();
  
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // If already logged in as admin, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      router.push("/admin");
    }
  }, [isAuthenticated, user, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      await api.post("/auth/login", { email, password });
      
      // Fetch full profile to verify role
      const meResponse = await api.get("/auth/me");
      const fullUser = meResponse.data.user;
      
      if (fullUser.role !== "admin") {
        await api.post("/auth/logout");
        setAuth(null);
        setError("Access denied. Admin privileges required.");
        toast.error("Access denied");
      } else {
        setAuth(fullUser);
        toast.success("Welcome, Admin!");
        router.push("/admin");
      }
    } catch (err) {
      const errorMsg = getApiError(err);
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-slate-50 flex items-center justify-center p-4 overflow-hidden">
      <style>{`
        @keyframes pan {
          0% { transform: translateY(0) translateX(0); }
          100% { transform: translateY(-40px) translateX(-40px); }
        }
        .animate-grid {
          animation: pan 4s linear infinite;
        }
      `}</style>
      
      {/* Animated Grid */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute inset-[-100%] bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-[size:40px_40px] opacity-30 animate-grid"
          style={{ maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 70%)', WebkitMaskImage: 'radial-gradient(ellipse at center, black 20%, transparent 70%)' }}
        />
      </div>

      <div className="relative z-10 max-w-md w-full bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-white/50 overflow-hidden">
        <div className="bg-white/50 p-8 text-center border-b border-slate-100/50 relative overflow-hidden">
          {/* Subtle gradient glow in header */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-brand-500/10 rounded-full blur-2xl"></div>
          
          <h2 className="relative z-10 text-3xl font-bold text-slate-800 tracking-tight">Admin Portal</h2>
          <p className="relative z-10 text-slate-500 mt-2 text-sm">Sign in to access the management dashboard</p>
        </div>
        
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Email</label>
              <input 
                type="email"
                name="email" 
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-lg bg-white border border-slate-200 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all text-slate-900 placeholder:text-slate-400 shadow-sm"
                required 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 rounded-lg bg-white border border-slate-200 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all text-slate-900 placeholder:text-slate-400 shadow-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-500"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center font-medium bg-red-50 p-3 rounded-lg border border-red-100">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
