import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="border-t bg-slate-900 text-slate-300">
      <div className="container mx-auto px-4 py-12 md:px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start gap-4">
          <Image 
            src="/Home/ASVA_logo.png" 
            alt="Asia Softlab Virtual Academy" 
            width={240} 
            height={80} 
            style={{ width: "auto", height: "auto" }}
            className="h-16 w-auto object-contain brightness-0 invert opacity-80"
          />
          <p className="text-sm text-slate-400">Empowering futures with Drone Technology and emerging skills.</p>
        </div>
        <div className="text-sm text-slate-400">
          © {new Date().getFullYear()} Asia Softlab Virtual Academy. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
