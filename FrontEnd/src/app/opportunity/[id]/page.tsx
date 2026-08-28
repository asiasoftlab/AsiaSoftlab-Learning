"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Loader2, MapPin, Building, Briefcase, ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useAuthStore } from "@/store/auth.store";

export default function OpportunityDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { isAuthenticated } = useAuthStore();
  
  const [opportunity, setOpportunity] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOpportunity = async () => {
      try {
        const response = await api.get(`/opportunities/${id}`);
        setOpportunity(response.data);
      } catch (error) {
        console.error("Failed to fetch opportunity:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchOpportunity();
    }
  }, [id]);

  const handleApply = () => {
    if (!isAuthenticated) {
      router.push("/login");
    } else {
      // Redirect to external application link
      window.open(opportunity.applyLink, "_blank", "noopener,noreferrer");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-grow flex justify-center items-center">
          <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
        </div>
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
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <Link href="/opportunity" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-brand-600 mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to opportunities
          </Link>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="p-8 md:p-10 border-b border-slate-100 bg-slate-50/50">
              <div className="flex flex-wrap items-start justify-between gap-6">
                <div>
                  <div className="inline-flex bg-brand-100 text-brand-700 text-sm font-bold px-3 py-1 rounded-full mb-4">
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
