"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuthStore } from "@/store/auth.store";
import { api } from "@/lib/api";
import { usePathname, useRouter } from "next/navigation";
import { Loader2, RefreshCw } from "lucide-react";

const protectedPaths = ['/dashboard', '/courses/enrolled', '/profile'];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setAuth = useAuthStore((state) => state.setAuth);
  const setLoading = useAuthStore((state) => state.setLoading);
  const isLoading = useAuthStore((state) => state.isLoading);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const pathname = usePathname();
  const router = useRouter();

  const [serverError, setServerError] = useState(false);

  const checkAuth = useCallback(async () => {
    try {
      setServerError(false);
      const response = await api.get("/auth/me");
      if (response.data?.success && response.data?.user) {
        setAuth(response.data.user);
      } else {
        setAuth(null);
      }
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 401) {
        // Confirmed unauthenticated response from backend
        setAuth(null);
      } else {
        // 502, 503, 504, timeout or network error: server is cold starting or unreachable
        // Do not treat a gateway warm-up as a confirmed logout!
        console.warn("Auth check encountered transient gateway/server error:", err?.message || err);
        setServerError(true);
      }
    } finally {
      setLoading(false);
    }
  }, [setAuth, setLoading]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Handle route protection separately whenever auth state or pathname changes
  useEffect(() => {
    if (isLoading || serverError) return;

    const isProtectedPath = protectedPaths.some((p) => pathname.startsWith(p));
    const isAdminPath = pathname.startsWith('/admin') && !pathname.startsWith('/admin-login');
    const isUserAuthPath = pathname.startsWith('/login') || pathname.startsWith('/register');
    const userRole = useAuthStore.getState().user?.role;

    if (!isAuthenticated && isAdminPath) {
      router.replace("/admin-login");
    } else if (!isAuthenticated && isProtectedPath) {
      router.replace("/login");
    } else if (isAuthenticated && isUserAuthPath) {
      if (userRole === 'admin') {
        router.replace("/admin");
      } else {
        router.replace("/");
      }
    } else if (isAuthenticated && isAdminPath && userRole !== 'admin') {
      router.replace("/");
    }
  }, [isAuthenticated, isLoading, serverError, pathname, router]);

  const isProtectedPath = protectedPaths.some(p => pathname.startsWith(p)) || (pathname.startsWith('/admin') && !pathname.startsWith('/admin-login'));
  
  // If the server returned a gateway error while trying to access a protected route, show a warm-up screen
  if (serverError && isProtectedPath) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4 text-center">
        <div className="w-10 h-10 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mb-3">
          <Loader2 className="w-5 h-5 animate-spin text-brand-600" />
        </div>
        <h2 className="text-base font-semibold text-slate-800">Connecting to secure server...</h2>
        <p className="text-xs text-slate-500 mt-1 max-w-sm">
          The service is currently warming up. Please wait a moment while the connection is established.
        </p>
        <button
          onClick={() => {
            setLoading(true);
            checkAuth();
          }}
          className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-brand-700 bg-brand-50 rounded-lg hover:bg-brand-100 transition-colors cursor-pointer border border-brand-200"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Retry Connection
        </button>
      </div>
    );
  }

  // Prevent UI flash by rendering a loading state while resolving a protected route
  if (isLoading && isProtectedPath) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
      </div>
    );
  }

  return <>{children}</>;
}

