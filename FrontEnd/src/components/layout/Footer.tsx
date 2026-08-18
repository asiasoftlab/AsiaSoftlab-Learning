import * as React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t bg-black">
      <div className="container mx-auto px-4 py-12 md:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-slate-900">AsiaSoftlab Learning</h3>
            <p className="mt-4 text-sm text-slate-600 max-w-sm">
              Professional training platform for Drone Technology, Surveying, Mapping, and emerging technical skills. Learn. Build. Fly.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900">Platform</h4>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li>
                <Link href="/courses" className="hover:text-brand-600 transition-colors">Courses</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-brand-600 transition-colors">About Us</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-brand-600 transition-colors">Contact</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900">Legal</h4>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li>
                <Link href="/privacy" className="hover:text-brand-600 transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-brand-600 transition-colors">Terms & Conditions</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t pt-8">
          <p className="text-center text-sm text-slate-500">
            © {new Date().getFullYear()} AsiaSoftlab. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
