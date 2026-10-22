"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { User, LayoutDashboard, BookOpen, Layers, MessageSquare, CalendarDays, Award, Settings, LifeBuoy, LogOut, ClipboardList } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { api } from "@/lib/api";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "My Courses", href: "/dashboard/courses", icon: BookOpen },
  { name: "Assessments", href: "/dashboard/assessments", icon: ClipboardList },
  { name: "All Courses", href: "/courses", icon: Layers },
  { name: "Messages", href: "/dashboard/messages", icon: MessageSquare },
  { name: "Calendar", href: "/dashboard/calendar", icon: CalendarDays },
  { name: "Certificates", href: "/dashboard/certificates", icon: Award },
  { name: "My Profile", href: "/dashboard/profile", icon: User },
];

const secondaryNavItems = [
  // { name: "Settings", href: "/dashboard/settings", icon: Settings },
  { name: "Help & Support", href: "/dashboard/support", icon: LifeBuoy },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      console.error('Logout error:', e);
    } finally {
      logout();
    }
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-full hidden lg:flex fixed inset-y-0 z-50">
      <div className="h-24 flex items-center px-6 border-b border-slate-200">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/Home/logo_ASVA.png" alt="AsiaSoftlab Virtual Academy Logo" width={240} height={45} className="h-9 w-auto object-contain" priority />
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-8">
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${isActive
                  ? "bg-slate-100 text-slate-900 font-medium"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                  }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? "text-slate-900" : "text-slate-400"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <nav className="flex flex-col gap-1 mt-auto">
          {secondaryNavItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${isActive
                  ? "bg-slate-100 text-slate-900 font-medium"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                  }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? "text-slate-900" : "text-slate-400"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-slate-200">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold flex-shrink-0">
            {user?.displayName?.charAt(0) || "S"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">
              {user?.displayName || "Student User"}
            </p>
            <p className="text-xs text-slate-500 truncate">
              {user?.email || "student@example.com"}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="text-slate-400 hover:text-red-500 transition-colors"
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
