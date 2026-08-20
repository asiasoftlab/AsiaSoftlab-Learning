"use client";

import { useState } from "react";
import { Loader2, MapPin } from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success("Message sent successfully!");
    setIsSubmitting(false);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="min-h-screen bg-[#f4fbfa] relative overflow-hidden flex items-center justify-center py-20 px-4">
      {/* Background decorations */}
      <div className="absolute top-20 right-20 w-40 h-40 opacity-20">
        <div className="grid grid-cols-5 gap-2">
          {Array.from({ length: 25 }).map((_, i) => (
            <div key={i} className="w-2 h-2 rounded-full bg-slate-400"></div>
          ))}
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 opacity-20">
        <div className="w-32 h-32 border-4 border-brand-400 absolute bottom-10 left-10"></div>
        <div className="w-32 h-32 border-4 border-brand-300 absolute bottom-0 left-0"></div>
      </div>

      <div className="absolute bottom-0 right-10 opacity-20">
         <div className="w-24 h-24 border-4 border-amber-400 absolute bottom-10 right-10"></div>
         <div className="w-24 h-24 border-4 border-amber-500 absolute bottom-0 right-0"></div>
      </div>

      <div className="relative z-10 w-full max-w-5xl bg-white rounded-3xl shadow-xl p-8 md:p-12 lg:p-16">
        
        {/* Header */}
        <div className="flex flex-col items-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-brand-600 uppercase tracking-wide">
            Contact Us
          </h2>
          <div className="h-1 w-24 bg-brand-500 mt-2"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          
          {/* Left Side: Form */}
          <div>
            <h3 className="text-xl font-bold text-slate-800 mb-6">Leave us a message</h3>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1">
                <input 
                  type="text" 
                  name="name"
                  placeholder="First_Name Last_Name" 
                  required
                  className="w-full border border-slate-200 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 text-slate-700 placeholder:text-slate-400"
                />
              </div>

              <div className="space-y-1">
                <input 
                  type="email" 
                  name="email"
                  placeholder="Email Address" 
                  required
                  className="w-full border border-slate-200 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 text-slate-700 placeholder:text-slate-400"
                />
              </div>

              <div className="space-y-1">
                <textarea 
                  name="message"
                  placeholder="Your Message" 
                  required
                  rows={5}
                  className="w-full border border-slate-200 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 text-slate-700 placeholder:text-slate-400 resize-none"
                />
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 rounded-md transition-colors shadow-md disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send"}
              </button>
            </form>
          </div>

          {/* Right Side: Contact Info & Map */}
          <div className="flex flex-col h-full space-y-6">
            <div className="space-y-4">
              <div className="text-slate-700 text-sm leading-relaxed font-medium">
                <p className="font-bold text-slate-900 mb-1">AsiaSoftlab Learning</p>
                <p>B 37/3 Ground Floor Double</p>
                <p>StoryRamesh Nagar, Near Raja Garden</p>
                <p>Chowk, Delhi: 110015</p>
              </div>

              <div>
                <a href="tel:+919599272754" className="text-slate-800 font-bold text-sm hover:text-brand-600 transition-colors border-b border-slate-400 pb-0.5">
                  +91 9599272754
                </a>
              </div>

              <div>
                <a href="mailto:hello@info.com.ng" className="text-slate-800 font-bold text-sm hover:text-brand-600 transition-colors">
                  hello@info.com.ng
                </a>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-4 pt-2">
              <a href="#" className="text-slate-800 hover:text-brand-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                </svg>
              </a>
              <a href="#" className="text-slate-800 hover:text-brand-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="#" className="text-slate-800 hover:text-brand-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="#" className="text-slate-800 hover:text-brand-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </a>
            </div>

            {/* Map Placeholder */}
            <div className="relative w-full flex-grow min-h-[150px] bg-slate-100 rounded-lg overflow-hidden mt-4 border border-slate-200">
               {/* Note: In a real app, use an iframe or a mapping library like Google Maps / Leaflet. Using a placeholder visual here. */}
               <div className="absolute inset-0 opacity-40 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=New+Delhi&zoom=13&size=600x300&maptype=roadmap&key=YOUR_API_KEY')] bg-cover bg-center"></div>
               <div className="absolute inset-0 flex items-center justify-center bg-slate-200/50">
                 <div className="bg-white px-3 py-1.5 rounded shadow flex items-center gap-2 text-xs font-semibold text-slate-700">
                    <MapPin className="w-4 h-4 text-brand-600" />
                    Delhi, India
                 </div>
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
