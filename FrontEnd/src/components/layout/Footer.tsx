"use client";

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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
    <footer className="bg-[#0b132b] text-slate-300 pt-16 pb-12 border-t border-slate-800/80">
      <div className="container mx-auto px-6 max-w-9xl">
        {/* Top Section: Brand, Navigation Columns, and Right-Aligned Newsletter */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-14">
          
          {/* Brand Info */}
          <div className="md:col-span-2 lg:col-span-4 space-y-4">
            <Link href="/" className="inline-block">
              <Image 
                src="/Home/ASVA_logo.png" 
                alt="Asia Softlab Virtual Academy" 
                width={200} 
                height={60} 
                style={{ width: "auto", height: "auto" }}
                className="h-12 w-auto object-contain brightness-0 invert"
              />
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Top learning experiences that create more talent in the world. Empowering futures with Drone Technology and emerging skills.
            </p>
          </div>

          {/* Links Columns (Product, Company, Legal) */}
          <div className="md:col-span-1 lg:col-span-4 grid grid-cols-3 gap-6 sm:gap-8">
            {/* Product Column */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
                Product
              </h4>
              <ul className="space-y-3 text-sm text-slate-200">
                <li>
                  <Link href="/courses" className="hover:text-white transition-colors">
                    Overview
                  </Link>
                </li>
                <li>
                  <Link href="/courses" className="hover:text-white transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/opportunities" className="hover:text-white transition-colors">
                    Solutions
                  </Link>
                </li>
                <li>
                  <Link href="/courses" className="hover:text-white transition-colors">
                    Tutorials
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-white transition-colors">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company Column */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
                Company
              </h4>
              <ul className="space-y-3 text-sm text-slate-200">
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    About us
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-white transition-colors">
                    Careers
                  </Link>
                </li>
                <li className="flex items-center gap-2">
                  <Link href="/press" className="hover:text-white transition-colors">
                    Press
                  </Link>
                  <span className="text-[10px] font-semibold bg-white text-slate-900 px-1.5 py-0.2 rounded-full">
                    New
                  </span>
                </li>
                <li>
                  <Link href="/" className="hover:text-white transition-colors">
                    News
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal Column */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
                Legal
              </h4>
              <ul className="space-y-3 text-sm text-slate-200">
                <li>
                  <Link href="/policies&conditions/terms" className="hover:text-white transition-colors">
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link href="/policies&conditions/privacy" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/policies&conditions/cookie" className="hover:text-white transition-colors">
                    Cookie Policy
                  </Link>
                </li>
                <li>
                  <Link href="/policies&conditions/refund" className="hover:text-white transition-colors">
                    Refund Policy
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Side: Newsletter Section */}
          <div className="md:col-span-1 lg:col-span-4 space-y-4">
            <div className="space-y-1.5">
              <p className="text-sm font-medium text-white">
                Stay updated with Drone Tech & Skills
              </p>
              <p className="text-xs text-slate-400 leading-relaxed">
                Get weekly course updates, industry insights, and scholarship announcements.
              </p>
            </div>

            {isSubscribed ? (
              <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 text-emerald-300">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-white">You're subscribed!</p>
                  <p className="text-[11px] text-emerald-300/80">Thank you for joining our newsletter. Team ASVA</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      disabled={isSubmitting}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-lg bg-slate-800/90 border border-slate-300 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 transition-all shadow-inner disabled:opacity-50"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm shadow-md shadow-brand-600/30 hover:shadow-brand-500/40 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none shrink-0 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Subscribing...</span>
                      </>
                    ) : (
                      <>
                        <span>Subscribe</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
                <p className="text-[11px] text-slate-400/80">
                  No spam ever. We respect your privacy. Unsubscribe at any time.
                </p>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Section: Copyright & Social Icons */}
        <div className="pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-md text-slate-400">
          <div>
            © {new Date().getFullYear()} Asia Softlab Virtual Academy. All rights reserved.
          </div>

          <div>
            <a href="https://www.asiasoftlab.in" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              Designed and Developed by Asia Softlab Pvt. Ltd.
            </a>
          </div>

          <div className="flex items-center gap-3">
            {/* Twitter / X */}
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Twitter" 
              className="h-10 w-10 rounded-full bg-slate-800/80 border border-slate-700/50 flex items-center justify-center text-slate-400 hover:text-white hover:bg-black hover:border-slate-500 transition-all duration-300 hover:scale-110 shadow-sm"
            >
              <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>

            {/* LinkedIn */}
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="LinkedIn" 
              className="h-10 w-10 rounded-full bg-slate-800/80 border border-slate-700/50 flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#0A66C2] hover:border-[#0A66C2] transition-all duration-300 hover:scale-110 shadow-sm"
            >
              <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
              </svg>
            </a>

            {/* Instagram */}
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Instagram" 
              className="h-10 w-10 rounded-full bg-slate-800/80 border border-slate-700/50 flex items-center justify-center text-slate-400 hover:text-white hover:bg-gradient-to-tr hover:from-[#f9ce34] hover:via-[#ee2a7b] hover:to-[#6228d7] hover:border-transparent transition-all duration-300 hover:scale-110 shadow-sm"
            >
              <svg className="h-5 w-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </a>

            {/* Facebook */}
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Facebook" 
              className="h-10 w-10 rounded-full bg-slate-800/80 border border-slate-700/50 flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#1877F2] hover:border-[#1877F2] transition-all duration-300 hover:scale-110 shadow-sm"
            >
              <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95C18.05 21.45 22 17.19 22 12z"/>
              </svg>
            </a>
            {/* Whatsapp */}
            <a 
              href="https://whatsapp.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="WhatsApp" 
              className="h-10 w-10 rounded-full bg-slate-800/80 border border-slate-700/50 flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#25D366] hover:border-[#25D366] transition-all duration-300 hover:scale-110 shadow-sm"
            >
              <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
            </a>

            {/* YouTube */}
            <a 
              href="https://youtube.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="YouTube" 
              className="h-10 w-10 rounded-full bg-slate-800/80 border border-slate-700/50 flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#FF0000] hover:border-[#FF0000] transition-all duration-300 hover:scale-110 shadow-sm"
            >
              <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
