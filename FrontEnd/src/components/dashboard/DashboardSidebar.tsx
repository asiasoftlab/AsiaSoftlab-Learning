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

interface DashboardSidebarProps {
  onClose?: () => void;
  isMobile?: boolean;
}

export function DashboardSidebar({ onClose, isMobile }: DashboardSidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      console.error('Logout error:', e);
    } finally {
      logout();
      onClose?.();
    }
  };

  const handleNavClick = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <aside
      className={`bg-white border-r border-slate-200 flex flex-col h-full ${
        isMobile
          ? "w-full"
          : "w-56 xl:w-64 hidden lg:flex fixed inset-y-0 z-40"
      }`}
    >
      <div className="h-13 sm:h-16 flex items-center justify-between px-4 border-b border-slate-200 shrink-0">
        <Link href="/" onClick={handleNavClick} className="flex items-center gap-2">
          <Image
            src="/Home/logo_ASVA.png"
            alt="AsiaSoftlab Virtual Academy Logo"
            width={200}
            height={36}
            className="h-7 sm:h-8 w-auto object-contain"
            priority
          />
        </Link>
        {isMobile && (
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 lg:hidden"
            aria-label="Close menu"
          >
            <span className="text-xl leading-none">&times;</span>
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-3 px-2.5 sm:px-3 flex flex-col gap-4">
        <nav className="flex flex-col gap-0.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={handleNavClick}
                className={`flex items-center gap-2.5 px-2.5 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm transition-colors ${
                  isActive
                    ? "bg-slate-100 text-slate-900 font-semibold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium"
                }`}
              >
                <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-slate-900" : "text-slate-400"}`} />
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <nav className="flex flex-col gap-0.5 mt-auto pt-2 border-t border-slate-100">
          {secondaryNavItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={handleNavClick}
                className={`flex items-center gap-2.5 px-2.5 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm transition-colors ${
                  isActive
                    ? "bg-slate-100 text-slate-900 font-semibold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium"
                }`}
              >
                <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-slate-900" : "text-slate-400"}`} />
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-2.5 sm:p-3 border-t border-slate-200 shrink-0 bg-slate-50/50">
        <div className="flex items-center gap-2 px-1">
          <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-brand-100 text-brand-700 font-bold text-xs flex items-center justify-center shrink-0">
            {user?.displayName?.charAt(0) || "S"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-900 truncate">
              {user?.displayName || "Student User"}
            </p>
            <p className="text-[10px] text-slate-400 truncate">
              {user?.email || "student@example.com"}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="p-1 text-slate-400 hover:text-red-500 rounded-md hover:bg-red-50 transition-colors"
            title="Logout"
            aria-label="Logout"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
