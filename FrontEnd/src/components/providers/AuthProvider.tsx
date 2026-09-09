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
    const checkAuth = async () => {
      let isAuth = false;
      let userRole = null;
      try {
        const response = await api.get("/auth/me");
        if (response.data.success && response.data.user) {
          setAuth(response.data.user);
          userRole = response.data.user.role;
          isAuth = true;
        } else {
          setAuth(null);
        }
      } catch (error) {
        setAuth(null);
      } finally {
        setLoading(false);
      }

      // Handle Redirects after resolution
      const isProtectedPath = protectedPaths.some(p => pathname.startsWith(p));
      const isAdminPath = pathname.startsWith('/admin') && !pathname.startsWith('/admin-login');
      const isUserAuthPath = pathname.startsWith('/login') || pathname.startsWith('/register');

      if (!isAuth && isAdminPath) {
        router.replace("/admin-login");
      } else if (!isAuth && isProtectedPath) {
        router.replace("/login");
      } else if (isAuth && isUserAuthPath) {
        router.replace("/");
      } else if (isAuth && isAdminPath && userRole !== 'admin') {
        router.replace("/dashboard");
      }
    };

    checkAuth();
  }, [setAuth, setLoading, pathname, router]);

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

