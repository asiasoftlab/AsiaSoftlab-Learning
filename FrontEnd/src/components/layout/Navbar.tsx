"use client";
import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { Button, buttonVariants } from '@/components/ui/button';
import { Menu, X, BookOpen, Search, ChevronDown, Compass } from 'lucide-react';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = React.useState(false);
  const [isExploreOpen, setIsExploreOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isSearchFocused, setIsSearchFocused] = React.useState(false);
  const [allCourses, setAllCourses] = React.useState<any[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = React.useState(false);
  const searchContainerRef = React.useRef<HTMLDivElement>(null);
  const exploreRef = React.useRef<HTMLDivElement>(null);
  const mobileSearchRef = React.useRef<HTMLDivElement>(null);
  const mobileInputRef = React.useRef<HTMLInputElement>(null);

  // Auto-close open menus on route change
  React.useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsMobileSearchOpen(false);
    setIsSearchFocused(false);
    setIsExploreOpen(false);
  }, [pathname]);

  const loadCourses = React.useCallback(async () => {
    if (allCourses.length > 0 || isLoadingCourses) return;
    try {
      setIsLoadingCourses(true);
      const res = await api.get('/courses');
      const published = (res.data || []).filter((c: any) => c.status === 'Published');
      setAllCourses(published);
    } catch {
      // silently fallback
    } finally {
      setIsLoadingCourses(false);
    }
  }, [allCourses.length, isLoadingCourses]);

  const searchSuggestions = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return allCourses
      .filter((c: any) =>
        c.title?.toLowerCase().includes(q) ||
        c.category?.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q)
      )
      .slice(0, 5);
  }, [allCourses, searchQuery]);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
      if (exploreRef.current && !exploreRef.current.contains(e.target as Node)) {
        setIsExploreOpen(false);
      }
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(e.target as Node)) {
        setIsMobileSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus mobile input when mobile search bar opens
  React.useEffect(() => {
    if (isMobileSearchOpen) {
      loadCourses();
      setTimeout(() => mobileInputRef.current?.focus(), 100);
    }
  }, [isMobileSearchOpen, loadCourses]);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    setIsSearchFocused(false);
    setIsMobileMenuOpen(false);
    setIsMobileSearchOpen(false);
    router.push(`/courses?search=${encodeURIComponent(q)}`);
  };

  const handleCategorySelect = (categorySlug: string) => {
    setIsExploreOpen(false);
    setIsMobileMenuOpen(false);
    setIsMobileSearchOpen(false);
    if (categorySlug === 'all') {
      router.push('/courses');
    } else {
      router.push(`/courses?category=${categorySlug}`);
    }
  };

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

  const exploreCategories = [
    { name: 'Drone Survey & Mapping', slug: 'drone-survey' },
    { name: 'Agriculture Drones', slug: 'agriculture' },
    { name: 'Underwater ROV', slug: 'rov' },
    { name: 'Regulatory Training', slug: 'regulatory' },
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
            className="h-14 sm:h-18 md:h-20 lg:h-24 w-auto object-contain max-w-[130px] sm:max-w-[160px] md:max-w-[190px] lg:max-w-[220px] transition-all"
            priority
          />
        </Link>

        {/* Desktop Search Bar (Visible on lg and above) */}
        <div ref={searchContainerRef} className="relative hidden lg:block mr-4 xl:mr-6">
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center border rounded-lg px-3 py-2 w-[260px] xl:w-[340px] 2xl:w-[400px] bg-slate-50 border-slate-200 focus-within:bg-white focus-within:ring-2 focus-within:ring-brand-500/20 focus-within:border-brand-500 transition-all shadow-xs"
          >
            <button
              type="submit"
              className="text-slate-400 hover:text-brand-600 mr-2 shrink-0 transition-colors focus:outline-none cursor-pointer"
              title="Search courses"
            >
              <Search className="h-4 w-4" />
            </button>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                setIsSearchFocused(true);
                loadCourses();
              }}
              onKeyDown={(e) => {
                if (e.key === 'Escape') setIsSearchFocused(false);
              }}
              placeholder="Want to learn? (e.g. Drone...)"
              suppressHydrationWarning
              className="bg-transparent text-xs xl:text-sm w-full outline-none placeholder:text-slate-400 text-slate-900 pr-2 min-w-0"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-slate-400 hover:text-slate-600 mr-2 shrink-0 p-0.5 rounded-full hover:bg-slate-200 transition-colors cursor-pointer"
                title="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
            <div ref={exploreRef} className="relative border-l border-slate-200 pl-2.5 shrink-0">
              <button
                type="button"
                suppressHydrationWarning
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExploreOpen(!isExploreOpen);
                }}
                className="flex items-center text-brand-600 text-xs xl:text-sm font-medium cursor-pointer outline-none hover:text-brand-700 transition-colors"
              >
                Explore <ChevronDown className={`h-3.5 w-3.5 xl:h-4 xl:w-4 ml-1 transition-transform duration-200 ${isExploreOpen ? 'rotate-180' : ''}`} />
              </button>
              {isExploreOpen && (
                <div className="absolute right-0 top-full mt-3 w-56 bg-white border border-slate-200 shadow-xl rounded-xl overflow-hidden z-50 py-1.5 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Course Categories
                  </div>
                  <div className="flex flex-col">
                    {exploreCategories.map((cat) => (
                      <button
                        key={cat.slug}
                        type="button"
                        onClick={() => handleCategorySelect(cat.slug)}
                        className="text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-600 transition-colors cursor-pointer"
                      >
                        {cat.name}
                      </button>
                    ))}
                    <div className="border-t border-slate-100 my-1"></div>
                    <button
                      type="button"
                      onClick={() => handleCategorySelect('all')}
                      className="text-left px-4 py-2 text-xs font-semibold text-brand-600 hover:bg-brand-50 transition-colors cursor-pointer"
                    >
                      Browse All Courses →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </form>

          {/* Autocomplete / Instant Search Results Dropdown */}
          {isSearchFocused && searchQuery.trim().length > 0 && (
            <div className="absolute left-0 top-full mt-2 w-full bg-white border border-slate-200 shadow-2xl rounded-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="p-2.5 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>Matching Courses</span>
                {searchSuggestions.length > 0 && (
                  <span className="text-[11px] text-slate-400 font-normal">{searchSuggestions.length} found</span>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                {searchSuggestions.length > 0 ? (
                  searchSuggestions.map((course: any) => (
                    <Link
                      key={course.id}
                      href={`/courses/${course.id}`}
                      onClick={() => {
                        setIsSearchFocused(false);
                        setSearchQuery('');
                      }}
                      className="flex items-center gap-3 p-3 hover:bg-brand-50/60 transition-colors group cursor-pointer"
                    >
                      <div className="h-10 w-10 rounded-lg bg-slate-100 overflow-hidden shrink-0 flex items-center justify-center border border-slate-200">
                        {course.thumbnailUrl ? (
                          <img
                            src={course.thumbnailUrl}
                            alt={course.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <BookOpen className="h-5 w-5 text-brand-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <div className="text-xs font-semibold text-slate-900 group-hover:text-brand-600 truncate">
                          {course.title}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                            {course.category || 'Course'}
                          </span>
                          <span className="text-[10px] font-bold text-emerald-600">
                            ₹{course.price || 0}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="p-4 text-center text-xs text-slate-500">
                    No courses found for <span className="font-semibold text-slate-700">"{searchQuery}"</span>
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => handleSearchSubmit()}
                className="w-full text-center py-2.5 px-3 bg-slate-50 hover:bg-brand-50 text-brand-600 text-xs font-semibold border-t border-slate-100 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Press Enter to view all results in catalog</span>
                <span className="text-brand-500 font-bold">→</span>
              </button>
            </div>
          )}
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

        {/* Desktop Auth Buttons (Visible on lg and above) */}
        <div className="hidden lg:flex items-center space-x-2.5 ml-auto">
          {!isAuthenticated ? (
            <>
              <Link
                href="/login"
                className={buttonVariants({
                  variant: 'ghost',
                  size: 'sm',
                  className: 'font-semibold text-slate-700 hover:text-brand-600',
                })}
              >
                Login
              </Link>
              <Link
                href="/register"
                className={buttonVariants({
                  size: 'sm',
                  className: 'rounded-lg px-5 xl:px-6 font-semibold',
                })}
              >
                Get Started
              </Link>
            </>
          ) : (
            <>
              <Link
                href={user?.role === 'admin' ? '/admin' : '/dashboard'}
                className={buttonVariants({
                  variant: 'ghost',
                  size: 'sm',
                  className: 'font-semibold text-slate-700 hover:text-brand-600',
                })}
              >
                {user?.role === 'admin' ? 'Admin Panel' : 'Dashboard'}
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

        {/* Mobile / Tablet Controls (< lg) */}
        <div className="flex items-center gap-1.5 lg:hidden ml-auto">
          {/* Quick Search Toggle */}
          <button
            type="button"
            onClick={() => {
              setIsMobileSearchOpen(!isMobileSearchOpen);
              if (!isMobileSearchOpen) {
                setIsMobileMenuOpen(false);
              }
            }}
            className={`p-2 rounded-lg text-slate-600 hover:text-slate-900 transition-colors ${
              isMobileSearchOpen ? 'bg-brand-50 text-brand-600' : 'hover:bg-slate-100'
            }`}
            aria-label="Toggle search bar"
          >
            <Search className="h-5 w-5" />
          </button>

          {/* Hamburger Menu Toggle */}
          <button
            type="button"
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-colors"
            onClick={() => {
              setIsMobileMenuOpen(!isMobileMenuOpen);
              if (!isMobileMenuOpen) {
                setIsMobileSearchOpen(false);
              }
            }}
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Quick Search Bar Overlay (Slides directly under navbar) */}
      {isMobileSearchOpen && (
        <div
          ref={mobileSearchRef}
          className="lg:hidden border-b border-slate-200 bg-white/98 backdrop-blur shadow-lg px-4 py-3 animate-in slide-in-from-top-2 duration-150"
        >
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <div className="relative flex-1 flex items-center border rounded-xl bg-slate-50 border-slate-200 focus-within:bg-white focus-within:ring-2 focus-within:ring-brand-500/20 focus-within:border-brand-500 transition-all p-1">
              <Search className="h-4 w-4 text-slate-400 ml-2.5 mr-2 shrink-0" />
              <input
                ref={mobileInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search courses, skills, drones..."
                suppressHydrationWarning
                className="bg-transparent text-sm w-full outline-none placeholder:text-slate-400 text-slate-900 py-1.5 pr-2"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-slate-400 hover:text-slate-600 mr-2 p-1"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <button
                type="submit"
                className="bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors shrink-0 shadow-xs cursor-pointer"
              >
                Search
              </button>
            </div>
            <button
              type="button"
              onClick={() => setIsMobileSearchOpen(false)}
              className="ml-2.5 p-2 text-slate-500 hover:text-slate-700 text-xs font-medium cursor-pointer"
            >
              Cancel
            </button>
          </form>

          {/* Mobile Instant Results Preview */}
          {searchQuery.trim().length > 0 && (
            <div className="mt-2.5 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden max-h-64 overflow-y-auto divide-y divide-slate-100">
              {searchSuggestions.length > 0 ? (
                searchSuggestions.map((course: any) => (
                  <Link
                    key={course.id}
                    href={`/courses/${course.id}`}
                    onClick={() => {
                      setIsMobileSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="flex items-center gap-3 p-2.5 hover:bg-brand-50/60 transition-colors"
                  >
                    <div className="h-9 w-9 rounded-lg bg-slate-100 overflow-hidden shrink-0 flex items-center justify-center border border-slate-200">
                      {course.thumbnailUrl ? (
                        <img
                          src={course.thumbnailUrl}
                          alt={course.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <BookOpen className="h-4 w-4 text-brand-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <div className="text-xs font-semibold text-slate-900 truncate">
                        {course.title}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-slate-500 bg-slate-100 px-1 rounded">
                          {course.category}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-600">
                          ₹{course.price || 0}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="p-3 text-center text-xs text-slate-500">
                  No courses found for "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 top-16 sm:top-20 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Content (Drawer) */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white shadow-2xl absolute w-full left-0 top-16 sm:top-20 z-50 animate-in slide-in-from-top-2 duration-150">
          <div className="flex flex-col p-4 sm:p-6 space-y-5 max-h-[calc(100vh-5rem)] overflow-y-auto">
            
            {/* Mobile Search Bar inside Drawer */}
            <form onSubmit={handleSearchSubmit} className="flex items-center border rounded-xl px-3 py-2 bg-slate-50 border-slate-200 focus-within:bg-white focus-within:ring-2 focus-within:ring-brand-500/20 focus-within:border-brand-500 transition-all shadow-xs">
              <Search className="h-4 w-4 text-slate-400 mr-2 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search courses..."
                suppressHydrationWarning
                className="bg-transparent text-sm w-full outline-none placeholder:text-slate-400 text-slate-900"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-slate-400 hover:text-slate-600 mr-2 p-1"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
              <button
                type="submit"
                className="text-xs font-semibold text-brand-600 px-2.5 py-1 rounded-md hover:bg-brand-50 transition-colors shrink-0 cursor-pointer"
              >
                Search
              </button>
            </form>

            {/* Mobile Explore by Category */}
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 px-1">
                <Compass className="h-3.5 w-3.5 text-brand-600" />
                <span>Explore Categories</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {exploreCategories.map((cat) => (
                  <button
                    key={cat.slug}
                    type="button"
                    onClick={() => handleCategorySelect(cat.slug)}
                    className="text-left p-2.5 rounded-lg bg-slate-50 border border-slate-100 hover:bg-brand-50 hover:border-brand-200 hover:text-brand-600 text-xs font-medium text-slate-700 transition-colors cursor-pointer"
                  >
                    {cat.name}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => handleCategorySelect('all')}
                  className="col-span-2 text-center p-2 rounded-lg bg-brand-50 text-brand-600 text-xs font-semibold hover:bg-brand-100 transition-colors cursor-pointer"
                >
                  Browse All Courses Catalog →
                </button>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Mobile Navigation Links */}
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 px-1">
                Navigation
              </div>
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
            </div>

            <hr className="border-slate-100" />

            {/* Mobile Auth Actions */}
            {!isAuthenticated ? (
              <div className="flex flex-col sm:flex-row gap-2 pt-1">
                <Link
                  href="/login"
                  className={buttonVariants({
                    variant: 'outline',
                    className: 'w-full rounded-lg font-semibold flex-1 justify-center',
                  })}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className={buttonVariants({
                    className: 'w-full rounded-lg font-semibold shadow-sm flex-1 justify-center',
                  })}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Get Started
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
                    className={buttonVariants({
                      variant: 'default',
                      className: 'w-full rounded-lg font-semibold flex-1 justify-center',
                    })}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {user?.role === 'admin' ? 'Admin Panel' : 'Dashboard'}
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
