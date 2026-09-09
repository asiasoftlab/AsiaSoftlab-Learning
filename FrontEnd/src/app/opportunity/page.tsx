"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Loader2, MapPin, Building, Briefcase, ArrowRight, Lock, BookOpen } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasEnrollment, setHasEnrollment] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

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

        const response = await api.get("/opportunities");
        setOpportunities(response.data.filter((opp: any) => opp.status === "Open"));
      } catch (error) {
        console.error("Failed to load opportunities:", error);
      } finally {
        setLoading(false);
        setCheckingAccess(false);
      }
    };

    checkAccessAndFetch();
  }, [isAuthenticated, isPrivileged]);

  const handleApply = (applyLink: string) => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/opportunity");
    } else if (!canAccessCareers) {
      router.push("/courses");
    } else {
      window.open(applyLink, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">Careers</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">Explore open positions and kickstart your career with our industry partners.</p>
        </div>

        {checkingAccess || loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
          </div>
        ) : !isAuthenticated ? (
          <div className="max-w-xl mx-auto bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-slate-200 text-center">
            {/* <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-5">
              <Lock className="w-8 h-8 text-amber-600" />
            </div> */}
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Careers Portal Locked</h2>
            <p className="text-slate-600 mb-8 leading-relaxed">
              Access to our exclusive career opportunities and industry job placements is reserved for registered students. Please log in or create an account to continue.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/login?redirect=/opportunity"
                className="inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-sm"
              >
                Log In to Account <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-6 py-3 rounded-xl transition-colors"
              >
                Register Now
              </Link>
            </div>
          </div>
        ) : !canAccessCareers ? (
          <div className="max-w-xl mx-auto bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-slate-200 text-center">
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
              Browse & Enroll in Courses <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : opportunities.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl shadow-sm text-center border border-slate-200">
            <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900">No open opportunities right now</h3>
            <p className="text-slate-500 mt-2">Check back later for new career postings.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {opportunities.map((opp) => (
              <div key={opp.id} className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] border border-slate-100 flex flex-col hover:shadow-xl transition-all group">
                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-brand-100 text-brand-600 text-xs font-bold px-3 py-1 rounded-md">
                      {opp.type}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-brand-600 transition-colors mb-2 line-clamp-2">
                    {opp.title}
                  </h3>
                  <div className="space-y-2 mt-4 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-slate-400" />
                      <span>{opp.company}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span>{opp.location}</span>
                    </div>
                  </div>
                  <p className="mt-4 text-slate-500 text-sm line-clamp-3">
                    {opp.description}
                  </p>
                </div>

                <div className="mt-6 flex gap-4">
                  <Link
                    href={`/opportunity/${opp.id}`}
                    className="block w-full text-center bg-white border-2 border-brand-500 text-brand-600 hover:bg-brand-50 font-semibold py-2.5 rounded-lg transition-colors"
                  >
                    View Details
                  </Link>
                  <button
                    onClick={() => handleApply(opp.applyLink)}
                    className="flex items-center justify-center gap-2 w-full text-center bg-brand-600 hover:bg-brand-700 text-white font-semibold py-2.5 rounded-lg transition-colors cursor-pointer"
                  >
                    Apply Now <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
