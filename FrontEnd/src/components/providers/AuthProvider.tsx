"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";
import { api } from "@/lib/api";
import { usePathname, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const protectedPaths = ['/dashboard', '/courses/enrolled', '/profile'];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setAuth = useAuthStore((state) => state.setAuth);
  const setLoading = useAuthStore((state) => state.setLoading);
  const isLoading = useAuthStore((state) => state.isLoading);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        const response = await api.get("/auth/me");
        if (isMounted) {
          if (response.data?.success && response.data?.user) {
            setAuth(response.data.user);
          } else {
            setAuth(null);
          }
        }
      } catch {
        if (isMounted) {
          setAuth(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [setAuth, setLoading]);

  // Handle route protection separately whenever auth state or pathname changes
  useEffect(() => {
    if (isLoading) return;

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
  }, [isAuthenticated, isLoading, pathname, router]);

  const isProtectedPath = protectedPaths.some(p => pathname.startsWith(p)) || (pathname.startsWith('/admin') && !pathname.startsWith('/admin-login'));
  
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

