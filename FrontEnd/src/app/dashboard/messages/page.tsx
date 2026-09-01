"use client";

import { Wrench, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function MessagesMaintenancePage() {
  return (
    <div className="h-[calc(100vh-6rem)] -m-6 flex flex-col items-center justify-center p-4 relative overflow-hidden bg-slate-50/50">
      {/* Decorative Background Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-brand-100 rounded-full blur-3xl opacity-30 pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center max-w-xl text-center bg-white/80 backdrop-blur-xl p-15 rounded-lg shadow-sm border border-slate-100">
        <h2 className="text-3xl font-bold text-slate-800 mb-4 tracking-tight">
          Message/Chat Under Maintenance
        </h2>

        <p className="text-slate-500 mb-8 leading-relaxed">
          We are currently upgrading the messaging and chat system to bring you a premium real-time experience.
          Please check back later!
        </p>

        <Link
          href="/dashboard"
          className="flex items-center gap-2 bg-brand-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-slate-800 transition-all shadow-md shadow-slate-200"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
