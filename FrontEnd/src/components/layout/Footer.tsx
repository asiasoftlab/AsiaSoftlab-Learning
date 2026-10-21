"use client";

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Mail, 
  ArrowRight, 
  Loader2, 
  CheckCircle2, 
  MapPin, 
  ExternalLink 
} from 'lucide-react';
import { api, getApiError } from '@/lib/api';
import toast from 'react-hot-toast';

export function Footer() {
  const [email, setEmail] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSubscribed, setIsSubscribed] = React.useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      toast.error('Please enter your email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.post('/newsletter/subscribe', { email: cleanEmail });
      toast.success(response.data?.message || 'Successfully subscribed to the newsletter!');
      setIsSubscribed(true);
      setEmail('');
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      toast.error(getApiError(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-[#0b132b] text-slate-300 text-xs border-t border-slate-800/80">
      {/* Main Footer Container */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl pt-12 pb-8">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-10">
          
          {/* Brand Info & About (5 Cols on large screen) */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="inline-block transition-opacity hover:opacity-90">
              <Image 
                src="/Home/logo_asva_footer_brand.png" 
                alt="Asia Softlab Virtual Academy (ASVA)" 
                width={200} 
                height={46} 
                className="h-9 w-auto object-contain"
                priority
              />
            </Link>
            
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Asia Softlab Virtual Academy (ASVA) is an industry-driven digital learning ecosystem specializing in Drone Technology, GIS, Remote Sensing, Surveying & Mapping, and modern engineering skills.
            </p>

            <div className="space-y-2 pt-1 text-slate-300">
              <div className="flex items-center gap-2.5 text-xs">
                <Mail className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                <a href="mailto:contact@asiasoftlab.in" className="hover:text-white transition-colors">
                  contact@asiasoftlab.in
                </a>
              </div>
              <div className="flex items-center gap-2.5 text-xs">
                <MapPin className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                <span className="text-slate-400">Asia Softlab Pvt. Ltd. | India</span>
              </div>
            </div>
          </div>

          {/* Quick Links Navigation (3 columns: Programs, Company, Legal) */}
          <div className="lg:col-span-5 grid grid-cols-3 gap-6 sm:gap-8">
            {/* Programs */}
            <div>
              <h4 className="text-[11px] font-semibold uppercase tracking-wider text-white mb-3.5">
                Programs
              </h4>
              <ul className="space-y-2.5 text-xs">
                <li>
                  <Link href="/courses" className="text-slate-300 hover:text-white transition-colors">
                    Drone Tech
                  </Link>
                </li>
                <li>
                  <Link href="/courses" className="text-slate-300 hover:text-white transition-colors">
                    GIS & Mapping
                  </Link>
                </li>
                <li>
                  <Link href="/courses" className="text-slate-300 hover:text-white transition-colors">
                    Remote Sensing
                  </Link>
                </li>
                <li>
                  <Link href="/courses" className="text-slate-300 hover:text-white transition-colors">
                    All Courses
                  </Link>
                </li>
                <li>
                  <Link href="/opportunity" className="text-slate-300 hover:text-white transition-colors">
                    Internships
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-[11px] font-semibold uppercase tracking-wider text-white mb-3.5">
                Company
              </h4>
              <ul className="space-y-2.5 text-xs">
                <li>
                  <Link href="/about" className="text-slate-300 hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/opportunity" className="text-slate-300 hover:text-white transition-colors flex items-center gap-1.5">
                    <span>Careers</span>
                    <span className="text-[9px] font-semibold bg-brand-500/20 text-brand-300 px-1.5 py-0.5 rounded">
                      Hiring
                    </span>
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-slate-300 hover:text-white transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <a 
                    href="https://www.asiasoftlab.in" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-slate-300 hover:text-white transition-colors inline-flex items-center gap-1"
                  >
                    <span>Asia Softlab</span>
                    <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-[11px] font-semibold uppercase tracking-wider text-white mb-3.5">
                Legal
              </h4>
              <ul className="space-y-2.5 text-xs">
                <li>
                  <Link href="/policies&conditions/terms" className="text-slate-300 hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/policies&conditions/privacy" className="text-slate-300 hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/policies&conditions/refund" className="text-slate-300 hover:text-white transition-colors">
                    Refund Policy
                  </Link>
                </li>
                <li>
                  <Link href="/policies&conditions/cookie" className="text-slate-300 hover:text-white transition-colors">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Newsletter Section (3 Cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-white mb-1">
              Stay Connected
            </h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              Subscribe to receive new course releases, webinars, and tech career insights.
            </p>

            {isSubscribed ? (
              <div className="flex items-center gap-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-2.5 text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <p className="text-xs font-medium text-white">Subscribed successfully!</p>
                  <p className="text-[10px] text-emerald-300/80">Welcome to ASVA Community.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                <div className="flex items-center rounded-lg bg-slate-900/90 border border-slate-700 focus-within:border-brand-500 focus-within:ring-1 focus-within:ring-brand-500 transition-all p-1">
                  <div className="pl-2.5 pr-1.5 text-slate-400 shrink-0">
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    disabled={isSubmitting}
                    className="w-full bg-transparent text-xs text-white placeholder-slate-400 focus:outline-none py-1.5 px-1 min-w-0"
                    required
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    aria-label="Subscribe"
                    className="shrink-0 p-1.5 rounded-md bg-brand-600 hover:bg-brand-500 text-white transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <ArrowRight className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
                <p className="text-[10px] text-slate-400">
                  Zero spam. Unsubscribe at any time.
                </p>
              </form>
            )}
          </div>

        </div>

        {/* Bottom Bar: Copyright & Socials */}
        <div className="pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-center sm:text-left">
            <span>© {new Date().getFullYear()} Asia Softlab Virtual Academy (ASVA). All rights reserved.</span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <a 
              href="https://www.asiasoftlab.in" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-white transition-colors"
            >
              An initiative by Asia Softlab Pvt. Ltd.
            </a>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-2">
            {/* LinkedIn */}
            <a 
              href="https://www.linkedin.com/company/asiasoftlab" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="LinkedIn" 
              className="h-7 w-7 rounded-md bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#0A66C2] hover:border-[#0A66C2] transition-all"
            >
              <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
              </svg>
            </a>

            {/* Instagram */}
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Instagram" 
              className="h-7 w-7 rounded-md bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-gradient-to-tr hover:from-[#f9ce34] hover:via-[#ee2a7b] hover:to-[#6228d7] hover:border-transparent transition-all"
            >
              <svg className="h-3.5 w-3.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </a>

            {/* Twitter / X */}
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Twitter" 
              className="h-7 w-7 rounded-md bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-black hover:border-slate-700 transition-all"
            >
              <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>

            {/* YouTube */}
            <a 
              href="https://youtube.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="YouTube" 
              className="h-7 w-7 rounded-md bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#FF0000] hover:border-[#FF0000] transition-all"
            >
              <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
