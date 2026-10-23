"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/auth.store";
import { api } from "@/lib/api";
import { Bell, Search, Menu, X, CheckCheck } from "lucide-react";
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
      
      const clearedIds = JSON.parse(localStorage.getItem('clearedNotifications') || '[]');
      const visibleNotifs = fetchedNotifs.filter((n: any) => !clearedIds.includes(n.id));
      
      setNotifications(visibleNotifs);
      
      // Calculate unread count using local storage
      const lastRead = localStorage.getItem('lastReadNotificationsTimestamp');
      if (!lastRead) {
        setUnreadCount(visibleNotifs.length);
      } else {
        const lastReadTime = new Date(lastRead).getTime();
        const unread = visibleNotifs.filter((n: any) => new Date(n.createdAt).getTime() > lastReadTime).length;
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

  const handleClearAll = () => {
    const currentIds = notifications.map(n => n.id);
    const clearedIds = JSON.parse(localStorage.getItem('clearedNotifications') || '[]');
    localStorage.setItem('clearedNotifications', JSON.stringify([...clearedIds, ...currentIds]));
    setNotifications([]);
    setUnreadCount(0);
  };

  const handleClearSingle = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const clearedIds = JSON.parse(localStorage.getItem('clearedNotifications') || '[]');
    clearedIds.push(id);
    localStorage.setItem('clearedNotifications', JSON.stringify(clearedIds));
    
    setNotifications(prev => {
      const target = prev.find(n => n.id === id);
      if (target) {
        const lastRead = localStorage.getItem('lastReadNotificationsTimestamp');
        if (!lastRead || new Date(target.createdAt).getTime() > new Date(lastRead).getTime()) {
          setUnreadCount(count => Math.max(0, count - 1));
        }
      }
      return prev.filter(n => n.id !== id);
    });
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
    <header className="h-13 sm:h-16 px-3 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-40 border-b border-slate-200">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button 
          className="lg:hidden p-1.5 -ml-1 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors shrink-0"
          onClick={onMenuClick}
          aria-label="Toggle navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="min-w-0">
          <h1 className="text-xs sm:text-sm md:text-base font-bold text-slate-900 truncate">
            Welcome back, {user?.displayName?.split(' ')[0] || "Student"}
          </h1>
          <p className="text-[11px] text-slate-500 hidden sm:block truncate">
            Ready to continue your learning journey?
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <div className="relative hidden md:block w-48 lg:w-64">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <Input 
            className="pl-8 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-full h-8 text-xs w-full hover:border-slate-300 focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-brand-500 shadow-2xs" 
            placeholder="Search courses..."
          />
        </div>
        <div className="relative" ref={dropdownRef}>
          <Button 
            variant="outline" 
            size="icon" 
            className={`rounded-full relative border-slate-200 h-8 w-8 transition-colors ${showNotifications ? 'bg-slate-100 ring-1 ring-brand-300' : 'bg-white hover:bg-slate-50'}`}
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4 text-slate-600" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500 ring-1.5 ring-white"></span>
            )}
          </Button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="fixed sm:absolute right-2 sm:right-0 left-2 sm:left-auto top-14 sm:top-auto sm:mt-2 w-auto sm:w-80 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden transform origin-top-right transition-all animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
                <h3 className="font-bold text-xs text-slate-900">Notifications</h3>
                <div className="flex gap-2">
                  {unreadCount > 0 && (
                    <button 
                      onClick={handleMarkAsRead}
                      title="Mark all as read"
                      className="text-slate-400 hover:text-brand-600 transition-colors cursor-pointer p-0.5"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {notifications.length > 0 && (
                    <button 
                      onClick={handleClearAll}
                      title="Clear all"
                      className="text-slate-400 hover:text-red-500 transition-colors cursor-pointer p-0.5"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {notifications.length > 0 ? (
                  <div className="flex flex-col divide-y divide-slate-100">
                    {notifications.map((notif) => {
                      const notifTime = new Date(notif.createdAt).getTime();
                      const lastReadTime = localStorage.getItem('lastReadNotificationsTimestamp') 
                        ? new Date(localStorage.getItem('lastReadNotificationsTimestamp')!).getTime() 
                        : 0;
                      const isUnread = notifTime > lastReadTime;

                      return (
                        <div key={notif.id} className={`p-2.5 sm:p-3 hover:bg-slate-50 cursor-pointer transition-colors flex gap-2.5 items-start relative group ${isUnread ? 'bg-brand-50/20' : ''}`}>
                          <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                            notif.type === 'alert' ? 'bg-red-500' :
                            notif.type === 'warning' ? 'bg-orange-500' :
                            notif.type === 'success' ? 'bg-emerald-500' :
                            'bg-blue-500'
                          }`}></div>
                          <div className="flex-1 pr-5 min-w-0">
                            <p className="text-xs text-slate-800 font-semibold leading-tight truncate">{notif.title}</p>
                            <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-2 leading-relaxed">{notif.message}</p>
                            <p className="text-[9px] text-slate-400 mt-1 font-medium">
                              {new Date(notif.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <button
                            onClick={(e) => handleClearSingle(notif.id, e)}
                            className="absolute right-2 top-2 p-1 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-md transition-all"
                            title="Clear notification"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="py-6 px-4 text-center flex flex-col items-center justify-center">
                    <div className="w-9 h-9 bg-slate-50 rounded-full flex items-center justify-center mb-2">
                      <Bell className="h-4 w-4 text-slate-400" />
                    </div>
                    <p className="text-slate-500 text-xs font-medium">You're all caught up!</p>
                  </div>
                )}
              </div>
              <div className="py-2 px-3 border-t border-slate-100 bg-slate-50/80 flex justify-between">
                <Link href="/dashboard/notifications" onClick={() => setShowNotifications(false)} className="text-[11px] font-semibold text-brand-600 hover:text-brand-800 transition-colors">
                  View All
                </Link>
                <Link href="/dashboard/profile" onClick={() => setShowNotifications(false)} className="text-[11px] font-semibold text-slate-500 hover:text-slate-900 transition-colors">
                  Settings
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
