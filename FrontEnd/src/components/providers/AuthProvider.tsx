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
      try {
        const response = await api.get("/auth/me");
        if (response.data.success && response.data.user) {
          setAuth(response.data.user);
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
      const authPaths = ['/login', '/register'];
      const isAuthPath = authPaths.some(p => pathname.startsWith(p));

      if (!isAuth && isProtectedPath) {
        router.replace("/login");
      } else if (isAuth && isAuthPath) {
        router.replace("/");
      }
    };

    checkAuth();
  }, [setAuth, setLoading, pathname, router]);

  const isProtectedPath = protectedPaths.some(p => pathname.startsWith(p));
  
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

