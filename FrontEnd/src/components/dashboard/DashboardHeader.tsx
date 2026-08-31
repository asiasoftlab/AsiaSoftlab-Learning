"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/auth.store";
import { Bell, Search, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  onMenuClick?: () => void;
}

export function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
  const { user } = useAuthStore();

  return (
    <header className="h-24 px-6 sm:px-8 lg:px-10 flex items-center justify-between sticky top-0 bg-slate-50/80 backdrop-blur-md z-40 border-b border-slate-200">
      <div className="flex items-center gap-4">
        <button 
          className="lg:hidden text-slate-500 hover:text-slate-900"
          onClick={onMenuClick}
        >
          <Menu className="h-6 w-6" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            Welcome back, {user?.displayName?.split(' ')[0] || "Student"}
          </h1>
          <p className="text-sm text-slate-500 hidden sm:block">
            Ready to continue your learning journey?
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden md:block w-64 lg:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            className="pl-9 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-full h-10 w-full hover:border-slate-300 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-blue-300/50 transition-all shadow-sm" 
            placeholder="Search for courses, lessons..."
          />
        </div>
        <Button variant="outline" size="icon" className="rounded-full relative border-slate-200 bg-white">
          <Bell className="h-5 w-5 text-slate-600" />
          <Link href="/notifications"><span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white"></span></Link>
        </Button>
      </div>
    </header>
  );
}
