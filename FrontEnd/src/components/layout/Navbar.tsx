"use client";
import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { Button } from '@/components/ui/button';
import { Menu, X, BookOpen, GraduationCap, Search, ChevronDown } from 'lucide-react';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isExploreOpen, setIsExploreOpen] = React.useState(false);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      toast.success('Logged out successfully');
    } catch (e) {
      console.error('Logout failed', e);
      toast.error('Failed to log out');
    } finally {
      logout();
      router.push('/login');
    }
  };

  if (pathname === '/login' || pathname === '/register') {
    return null;
  }

  const navLinks = [
    { name: 'COURSES', href: '/courses' },
    { name: 'OPPORTUNITY', href: '/opportunity' },
    { name: 'ABOUT', href: '/about' },
    { name: 'CONTACT', href: '/contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-slate-100 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/95 transition-all">
      <div className="container mx-auto flex h-16 sm:h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo */}
        <Link href="/" className="mr-3 sm:mr-6 flex items-center shrink-0 py-1 focus:outline-none">
          <Image
            src="/Home/logo_ASVA.png"
            alt="Asia Softlab Virtual Academy"
            width={240}
            height={100}
            className="h-16 sm:h-20 md:h-24 lg:h-32 w-auto object-contain max-w-[140px] sm:max-w-[170px] md:max-w-[200px] lg:max-w-[230px] transition-all"
            priority
          />
        </Link>

        {/* Search Bar (XL and above) */}
        <div className="hidden xl:flex items-center border rounded-sm px-4 py-2 w-[340px] 2xl:w-[400px] bg-slate-50 border-slate-200 mr-6 focus-within:ring-2 focus-within:ring-brand-500/20 focus-within:border-brand-500 transition-all">
          <Search className="h-4 w-4 text-slate-400 mr-2.5 shrink-0" />
          <input
            type="text"
            placeholder="Want to learn?"
            className="bg-transparent text-sm w-full outline-none placeholder:text-slate-400 text-slate-900"
          />
          <div className="relative border-l border-slate-200 pl-3 ml-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsExploreOpen(!isExploreOpen)}
              onBlur={() => setTimeout(() => setIsExploreOpen(false), 200)}
              className="flex items-center text-brand-600 text-sm font-medium cursor-pointer outline-none hover:text-brand-700 transition-colors"
            >
              Explore <ChevronDown className={`h-4 w-4 ml-1 transition-transform ${isExploreOpen ? 'rotate-180' : ''}`} />
            </button>
            {isExploreOpen && (
              <div className="absolute right-0 top-full mt-3 w-56 bg-white border border-slate-200 shadow-xl rounded-xl overflow-hidden z-50 py-1">
                <div className="flex flex-col">
                  <Link href="/courses?category=drone-survey" className="px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 hover:text-brand-600 transition-colors">Drone Survey & Mapping</Link>
                  <Link href="/courses?category=agriculture" className="px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 hover:text-brand-600 transition-colors">Agriculture Drones</Link>
                  <Link href="/courses?category=rov" className="px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 hover:text-brand-600 transition-colors">Underwater ROV</Link>
                  <Link href="/courses?category=regulatory" className="px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 hover:text-brand-600 transition-colors">Regulatory Training</Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Links (Desktop) */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-8 text-xs xl:text-sm font-semibold text-slate-600">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`relative transition-colors hover:text-brand-600 py-1 ${
                  isActive ? 'text-brand-600 font-bold' : ''
                } after:absolute after:-bottom-0.5 after:left-0 after:h-[2px] after:w-full after:origin-bottom-left after:scale-x-0 after:bg-brand-600 after:transition-transform after:duration-300 hover:after:scale-x-100 ${
                  isActive ? 'after:scale-x-100' : ''
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center space-x-2.5 ml-auto lg:ml-0">
          {!isAuthenticated ? (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm" className="font-semibold text-slate-700 hover:text-brand-600">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="rounded-lg px-6 font-semibold">
                  Get Started
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link href={user?.role === 'admin' ? '/admin' : '/dashboard'}>
                <Button variant="ghost" size="sm" className="font-semibold text-slate-700 hover:text-brand-600">
                  {user?.role === 'admin' ? 'Admin Panel' : 'Dashboard'}
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="rounded-full text-slate-600 hover:text-red-600 hover:border-red-200 hover:bg-red-50"
              >
                Logout
              </Button>
            </>
          )}
        </div>

        {/* Mobile / Tablet Toggle Hamburger */}
        <div className="flex items-center md:hidden ml-auto">
          <button
            type="button"
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 top-16 sm:top-20 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Content */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white shadow-xl absolute w-full left-0 top-16 sm:top-20 z-50 animate-in slide-in-from-top-2 duration-150">
          <div className="flex flex-col p-4 sm:p-6 space-y-4 max-h-[calc(100vh-5rem)] overflow-y-auto">
            
            {/* Mobile Navigation Links */}
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                      isActive
                        ? 'bg-brand-50 text-brand-600'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-brand-600'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>

            <hr className="border-slate-100" />

            {/* Mobile Auth Actions */}
            {!isAuthenticated ? (
              <div className="flex flex-col sm:flex-row gap-2 pt-1">
                <Link href="/login" className="flex-1" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full rounded-lg font-semibold">Login</Button>
                </Link>
                <Link href="/register" className="flex-1" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full rounded-lg font-semibold shadow-sm">Get Started</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-2 pt-1">
                <div className="text-xs font-semibold text-slate-500 px-3 truncate">
                  Signed in as <span className="text-slate-800 font-bold">{user?.displayName || user?.email}</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Link
                    href={user?.role === 'admin' ? '/admin' : '/dashboard'}
                    className="flex-1"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button variant="default" className="w-full rounded-lg font-semibold">
                      {user?.role === 'admin' ? 'Admin Panel' : 'Dashboard'}
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto rounded-full font-semibold text-red-600 hover:bg-red-50 hover:border-red-200"
                    onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                  >
                    Logout
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
