"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Routes where Navbar and Footer should be hidden (fullscreen auth/dashboard experiences)
  const isExcludedRoute =
    pathname?.startsWith('/admin') ||
    pathname?.startsWith('/admin-login') ||
    pathname?.startsWith('/dashboard') ||
    pathname === '/login' ||
    pathname === '/register';

  if (isExcludedRoute) {
    return <main className="flex-1 flex flex-col">{children}</main>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 flex flex-col">{children}</main>
      <Footer />
    </>
  );
}
