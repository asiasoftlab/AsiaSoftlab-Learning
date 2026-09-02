"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/auth.store";
import { api } from "@/lib/api";
import { Bell, Search, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  onMenuClick?: () => void;
}

export function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
  const { user } = useAuthStore();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await api.get("/notifications");
      const fetchedNotifs = response.data || [];
      setNotifications(fetchedNotifs);
      
      // Calculate unread count using local storage
      const lastRead = localStorage.getItem('lastReadNotificationsTimestamp');
      if (!lastRead) {
        setUnreadCount(fetchedNotifs.length);
      } else {
        const lastReadTime = new Date(lastRead).getTime();
        const unread = fetchedNotifs.filter((n: any) => new Date(n.createdAt).getTime() > lastReadTime).length;
        setUnreadCount(unread);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  const handleMarkAsRead = () => {
    setUnreadCount(0);
    localStorage.setItem('lastReadNotificationsTimestamp', new Date().toISOString());
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
        <div className="relative" ref={dropdownRef}>
          <Button 
            variant="outline" 
            size="icon" 
            className={`rounded-full relative border-slate-200 transition-colors ${showNotifications ? 'bg-slate-100 ring-2 ring-brand-200' : 'bg-white hover:bg-slate-50'}`}
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell className="h-5 w-5 text-slate-600" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white"></span>
            )}
          </Button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-[320px] sm:w-[380px] bg-white rounded-2xl shadow-xl border border-slate-200 z-50 overflow-hidden transform origin-top-right transition-all animate-in fade-in zoom-in duration-200">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h3 className="font-bold text-slate-900">Notifications</h3>
                {unreadCount > 0 && (
                  <button 
                    onClick={handleMarkAsRead}
                    className="text-xs font-semibold text-brand-600 hover:text-brand-700 cursor-pointer"
                  >
                    Mark all as read
                  </button>
                )}
              </div>
              <div className="max-h-[360px] overflow-y-auto">
                {notifications.length > 0 ? (
                  <div className="flex flex-col divide-y divide-slate-100">
                    {notifications.map((notif) => {
                      const notifTime = new Date(notif.createdAt).getTime();
                      const lastReadTime = localStorage.getItem('lastReadNotificationsTimestamp') 
                        ? new Date(localStorage.getItem('lastReadNotificationsTimestamp')!).getTime() 
                        : 0;
                      const isUnread = notifTime > lastReadTime;

                      return (
                        <div key={notif.id} className={`p-4 hover:bg-slate-50 cursor-pointer transition-colors flex gap-4 items-start ${isUnread ? 'bg-brand-50/30' : ''}`}>
                          <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${
                            notif.type === 'alert' ? 'bg-red-500' :
                            notif.type === 'warning' ? 'bg-orange-500' :
                            notif.type === 'success' ? 'bg-emerald-500' :
                            'bg-blue-500'
                          }`}></div>
                          <div>
                            <p className="text-sm text-slate-800 font-medium leading-snug">{notif.title}</p>
                            <p className="text-xs text-slate-600 mt-1">{notif.message}</p>
                            <p className="text-[10px] text-slate-400 mt-2 font-medium">
                              {new Date(notif.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="p-8 text-center flex flex-col items-center justify-center">
                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                      <Bell className="h-5 w-5 text-slate-400" />
                    </div>
                    <p className="text-slate-500 text-sm font-medium">You're all caught up!</p>
                  </div>
                )}
              </div>
              <div className="p-3 border-t border-slate-100 bg-slate-50 text-center">
                <Link href="/dashboard/profile" onClick={() => setShowNotifications(false)} className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors">
                  View Notification Settings
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
