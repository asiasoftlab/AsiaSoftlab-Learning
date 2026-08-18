"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { api, getApiError } from "@/lib/api";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const displayName = formData.get("username");
    const password = formData.get("password");

    try {
      await api.post("/auth/register", { email, displayName, password });
      toast.success("Account created successfully!");
      router.push("/login?registered=true");
    } catch (err) {
      const errorMsg = getApiError(err);
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#f8f9fa] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:40px_40px]"></div>

      <div className="relative z-10 max-w-5xl w-full bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[650px]">

        {/* Left Side - Image */}
        <div className="relative w-full md:w-1/2 h-64 md:h-auto hidden md:block">
          <Image src="/Home/School.webp" alt="Students in classroom" fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-10">
            <h2 className="text-3xl font-bold text-white mb-2">Start Your Journey.</h2>
            <p className="text-white/80 text-sm">Join thousands of students learning emerging technologies and practical industry skills.</p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col items-center justify-center">
          <h2 className="text-xl font-bold text-slate-800 mb-6 text-center">Welcome to AsiaSoftlab!</h2>

          {/* Toggle Button */}
          <div className="bg-brand-100 p-1 rounded-full flex w-[280px] mb-8">
            <Link href="/login" className="w-1/2 text-center py-2.5 rounded-full text-brand-700 font-semibold text-sm hover:text-brand-800 transition-colors">
              Login
            </Link>
            <div className="w-1/2 text-center py-2.5 rounded-full bg-brand-500 text-white font-semibold text-sm shadow-sm cursor-default">
              Register
            </div>
          </div>

          <p className="text-slate-500 text-sm text-center mb-6 leading-relaxed max-w-sm">
            Create an account to enroll in courses, track your progress, and join our professional community.
          </p>

          <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 block ml-1">Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your Email Address"
                className="w-full px-5 py-3 rounded-full bg-white border border-brand-200 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-sm transition-all text-slate-900 placeholder:text-slate-400"
                required
              />
             
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 block ml-1">User name</label>
              <input
                type="text"
                name="username"
                placeholder="Enter your User name"
                className="w-full px-5 py-3 rounded-full bg-white border border-brand-200 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-sm transition-all text-slate-900 placeholder:text-slate-400"
                required
              />
            </div>

            <div className="space-y-1.5 relative mb-4">
              <label className="text-sm font-semibold text-slate-700 block ml-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your Password"
                  className="w-full pl-5 pr-12 py-3 rounded-full bg-white border border-brand-200 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-sm transition-all text-slate-900 placeholder:text-slate-400"
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
              <div className="text-red-500 text-sm text-center font-medium bg-red-50 py-2 rounded-lg">
                {error}
              </div>
            )}

            <div className="pt-3">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-full bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Register"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
