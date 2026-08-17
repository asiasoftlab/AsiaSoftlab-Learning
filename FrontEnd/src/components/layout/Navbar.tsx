"use client";
import * as React from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth.store';
import { Button } from '@/components/ui/button';
import { Menu, X, BookOpen, GraduationCap, Search, ChevronDown } from 'lucide-react';

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isExploreOpen, setIsExploreOpen] = React.useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white backdrop-blur supports-[backdrop-filter]:bg-white/100">
      <div className="container mx-auto flex h-24 items-center px-4 md:px-6">
        <Link href="/" className="mr-8 flex items-center space-x-2 shrink-0">
         
          <span className="hidden font-bold text-xl sm:inline-block text-slate-900">
            AsiaSoftlab Learning
          </span>
        </Link>
        
        {/* Search Bar */}
        <div className="hidden lg:flex items-center border rounded-md px-4 py-2 w-[400px] bg-slate-50 border-slate-200 mr-8 focus-within:ring-2 focus-within:ring-brand-500 focus-within:border-transparent transition-all">
          <Search className="h-4 w-4 text-slate-400 mr-3 shrink-0" />
          <input 
            type="text" 
            placeholder="Want to learn?" 
            className="bg-transparent text-sm w-full outline-none placeholder:text-slate-400 text-slate-900" 
          />
          <div className="relative border-l pl-3 ml-2 shrink-0">
            <button 
              onClick={() => setIsExploreOpen(!isExploreOpen)}
              onBlur={() => setTimeout(() => setIsExploreOpen(false), 200)}
              className="flex items-center text-brand-600 text-sm font-medium cursor-pointer outline-none hover:text-brand-700 transition-colors"
            >
              Explore <ChevronDown className={`h-4 w-4 ml-1 transition-transform ${isExploreOpen ? 'rotate-180' : ''}`} />
            </button>
            {isExploreOpen && (
              <div className="absolute right-0 top-full mt-4 w-56 bg-white border border-slate-200 shadow-xl rounded-md overflow-hidden z-50">
                <div className="p-1 flex flex-col">
                  <Link href="/courses?category=drone-survey" className="px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-brand-600 rounded-sm transition-colors">Drone Survey & Mapping</Link>
                  <Link href="/courses?category=agriculture" className="px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-brand-600 rounded-sm transition-colors">Agriculture Drones</Link>
                  <Link href="/courses?category=rov" className="px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-brand-600 rounded-sm transition-colors">Underwater ROV</Link>
                  <Link href="/courses?category=regulatory" className="px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-brand-600 rounded-sm transition-colors">Regulatory Training</Link>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="hidden md:flex gap-8 text-sm font-medium text-slate-600">
          <Link href="/courses" className="relative transition-colors hover:text-brand-600 after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-full after:origin-bottom-left after:scale-x-0 after:bg-brand-600 after:transition-transform after:duration-300 hover:after:scale-x-100">COURSES</Link>
          <Link href="/opportunity" className="relative transition-colors hover:text-brand-600 after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-full after:origin-bottom-left after:scale-x-0 after:bg-brand-600 after:transition-transform after:duration-300 hover:after:scale-x-100">OPPORTUNITY</Link>
          <Link href="/about" className="relative transition-colors hover:text-brand-600 after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-full after:origin-bottom-left after:scale-x-0 after:bg-brand-600 after:transition-transform after:duration-300 hover:after:scale-x-100">ABOUT</Link>
          <Link href="/contact" className="relative transition-colors hover:text-brand-600 after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-full after:origin-bottom-left after:scale-x-0 after:bg-brand-600 after:transition-transform after:duration-300 hover:after:scale-x-100">CONTACT</Link>
          
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <div className="hidden md:flex space-x-2">
            {!isAuthenticated ? (
              <>
                <Link href="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link href="/register">
                  <Button>Get Started</Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost">Dashboard</Button>
                </Link>
                <Button variant="outline" onClick={logout}>
                  Logout
                </Button>
              </>
            )}
          </div>
          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t p-4 bg-white shadow-lg absolute w-full left-0 top-20">
          <div className="flex flex-col space-y-4">
            <Link href="/courses" className="text-sm font-medium" onClick={() => setIsMobileMenuOpen(false)}>
              Courses
            </Link>
            <Link href="/about" className="text-sm font-medium" onClick={() => setIsMobileMenuOpen(false)}>
              About
            </Link>
            <Link href="/contact" className="text-sm font-medium" onClick={() => setIsMobileMenuOpen(false)}>
              Contact
            </Link>
            <hr />
            {!isAuthenticated ? (
              <div className="flex flex-col space-y-2">
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full justify-start">Login</Button>
                </Link>
                <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full justify-start">Get Started</Button>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col space-y-2">
                <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full justify-start">Dashboard</Button>
                </Link>
                <Button variant="ghost" className="w-full justify-start" onClick={() => { logout(); setIsMobileMenuOpen(false); }}>
                  Logout
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
