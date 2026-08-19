"use client";

import { AdminRoute } from "@/components/auth/AdminRoute";
import Link from "next/link";
import { LayoutDashboard, Users, BookOpen, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { api } from "@/lib/api";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = time.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await api.post("/auth/logout");
      setAuth(null);
      toast.success("Successfully logged out");
      router.push("/admin-login");
    } catch (error) {
      console.error("Logout failed", error);
      toast.error("Failed to log out");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <AdminRoute>
      <div className="flex h-screen bg-slate-50">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-xl font-bold text-brand-600">Asia Softlab</h2>
          </div>
          <nav className="flex-1 p-4 space-y-2">
            <Link href="/admin" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-slate-50 text-slate-700 hover:text-brand-600 transition-colors">
              <LayoutDashboard className="w-5 h-5" />
              <span className="font-medium">Dashboard</span>
            </Link>
            <Link href="/admin/users" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-slate-50 text-slate-700 hover:text-brand-600 transition-colors">
              <Users className="w-5 h-5" />
              <span className="font-medium">Users</span>
            </Link>
            <Link href="/admin/courses" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-slate-50 text-slate-700 hover:text-brand-600 transition-colors">
              <BookOpen className="w-5 h-5" />
              <span className="font-medium">Courses</span>
            </Link>
          </nav>
          <div className="p-4 border-t border-slate-200">
            <button 
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-50 text-red-600 transition-colors disabled:opacity-50"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">{isLoggingOut ? "Exiting..." : "Exit Admin"}</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <header className="h-24 bg-white border-b border-slate-200 flex items-center px-6 lg:px-10 justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-800">
                {mounted ? getGreeting() : "Welcome"}, Admin
              </h1>
              <p className="text-sm text-slate-500 mt-1">Here's what's happening on your platform today.</p>
            </div>
            
            <div className="hidden md:flex items-center space-x-4 bg-white px-4 py-2">
              <div className="flex flex-col text-right">
                <span className="text-lg font-bold text-slate-800">
                  {mounted ? time.toLocaleDateString('en-US', { month: 'long', day: 'numeric', weekday: 'long'}) : "Loading date..."}
                </span>
                <span className="text-sm text-slate-500 font-medium">
                  {mounted ? time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : "--:--:--"}
                </span>
              </div>
            </div>
          </header>
          <div className="flex-1 overflow-y-auto p-6 lg:p-10">
            {children}
          </div>
        </main>
      </div>
    </AdminRoute>
  );
}
