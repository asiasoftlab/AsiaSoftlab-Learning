"use client";

import { useAuthStore } from "@/store/auth.store";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import { GraduationCap, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12 text-center">
            
            <h1 className="text-3xl font-bold text-slate-900 mb-4">
              Welcome back, {user?.displayName || "Student"}!
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
              Your personalized student dashboard is currently under development. Soon, you will be able to track your course progress, view certificates, and manage your enrollments here.
            </p>
            
            <Link 
              href="/courses"
              className="inline-flex items-center justify-center bg-brand-600 text-white hover:bg-brand-700 font-semibold py-3 px-8 rounded-xl transition-colors gap-2"
            >
              Explore Courses <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
