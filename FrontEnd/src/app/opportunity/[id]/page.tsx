"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Loader2, MapPin, Building, Briefcase, ArrowLeft, ExternalLink, Lock, BookOpen } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useAuthStore } from "@/store/auth.store";

export default function OpportunityDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { isAuthenticated, user } = useAuthStore();

  const [opportunity, setOpportunity] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hasEnrollment, setHasEnrollment] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);

  const isPrivileged = user?.role === "admin" || user?.role === "instructor";
  const canAccessCareers = isPrivileged || hasEnrollment;

  useEffect(() => {
    const checkAccessAndFetch = async () => {
      if (!isAuthenticated) {
        setCheckingAccess(false);
        setLoading(false);
        return;
      }

      try {
        setCheckingAccess(true);
        if (!isPrivileged) {
          const enrollRes = await api.get("/payments/my-enrollments");
          const active = Array.isArray(enrollRes.data) && enrollRes.data.length > 0;
          setHasEnrollment(active);

          if (!active) {
            setLoading(false);
            setCheckingAccess(false);
            return;
          }
        } else {
          setHasEnrollment(true);
        }

        if (id) {
          const response = await api.get(`/opportunities/${id}`);
          setOpportunity(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch opportunity:", error);
      } finally {
        setLoading(false);
        setCheckingAccess(false);
      }
    };

    checkAccessAndFetch();
  }, [id, isAuthenticated, isPrivileged]);

  const handleApply = () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/opportunity/${id}`);
    } else if (!canAccessCareers) {
      router.push("/courses");
    } else if (opportunity?.applyLink) {
      window.open(opportunity.applyLink, "_blank", "noopener,noreferrer");
    }
  };

  if (checkingAccess || loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-grow flex justify-center items-center">
          <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <main className="flex-grow py-16">
          <div className="container mx-auto px-4 max-w-xl">
            <Link href="/opportunity" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-brand-600 mb-8 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to opportunities
            </Link>
            <div className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-slate-200 text-center">
              {/* <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-5">
                <Lock className="w-8 h-8 text-amber-600" />
              </div> */}
              <h2 className="text-2xl font-bold text-slate-900 mb-3">Careers Portal Locked</h2>
              <p className="text-slate-600 mb-8 leading-relaxed">
                Access to our exclusive career opportunities and industry job placements is reserved for registered students. Please log in or create an account to continue.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href={`/login?redirect=/opportunity/${id}`}
                  className="inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-sm"
                >
                  Log In to Account
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-6 py-3 rounded-xl transition-colors"
                >
                  Register Now
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!canAccessCareers) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <main className="flex-grow py-16">
          <div className="container mx-auto px-4 max-w-xl">
            <Link href="/opportunity" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-brand-600 mb-8 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to opportunities
            </Link>
            <div className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-slate-200 text-center">
              <div className="w-16 h-16 rounded-2xl bg-brand-50 border border-brand-200 flex items-center justify-center mx-auto mb-5">
                <BookOpen className="w-8 h-8 text-brand-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">Course Enrollment Required</h2>
              <p className="text-slate-600 mb-8 leading-relaxed">
                Our career portal and job listings are exclusively open to students enrolled in AsiaSoftlab courses. Enroll in any course today to unlock access to hiring partners and direct job applications.
              </p>
              <Link
                href="/courses"
                className="inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-8 py-3.5 rounded-xl transition-all shadow-sm"
              >
                Browse & Enroll in Courses
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-grow flex flex-col justify-center items-center text-center p-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Opportunity Not Found</h2>
          <p className="text-slate-500 mb-6">This position may have been removed or no longer exists.</p>
          <Link href="/opportunity" className="bg-brand-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-brand-700 transition-colors">
            Back to Opportunities
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-8xl">
          <Link href="/opportunity" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-brand-600 mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to opportunities
          </Link>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="p-8 md:p-10 border-b border-slate-100 bg-slate-50/50">
              <div className="flex flex-wrap items-start justify-between gap-6">
                <div>
                  <div className="inline-flex bg-brand-100 text-brand-700 text-sm font-bold px-3 py-1 rounded-lg mb-4">
                    {opportunity.type}
                  </div>
                  <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-4">{opportunity.title}</h1>
                  <div className="flex flex-wrap gap-6 text-slate-600">
                    <div className="flex items-center gap-2">
                      <Building className="w-5 h-5 text-slate-400" />
                      <span className="font-medium">{opportunity.company}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-slate-400" />
                      <span className="font-medium">{opportunity.location}</span>
                    </div>
                  </div>
                </div>

                <div className="w-full md:w-auto shrink-0">
                  <button
                    onClick={handleApply}
                    className="w-full md:w-auto bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 px-8 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
                  >
                    {isAuthenticated ? (
                      <>Apply Now <ExternalLink className="w-4 h-4" /></>
                    ) : (
                      "Login to Apply"
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="p-8 md:p-10">
              <h3 className="text-xl font-bold text-slate-900 mb-6">About the Role</h3>
              <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed whitespace-pre-wrap">
                {opportunity.description}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
