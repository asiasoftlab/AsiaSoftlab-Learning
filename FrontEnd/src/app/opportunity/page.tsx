"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Loader2, MapPin, Building, Briefcase, ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  const handleApply = (applyLink: string) => {
    if (!isAuthenticated) {
      router.push("/login");
    } else {
      window.open(applyLink, "_blank", "noopener,noreferrer");
    }
  };

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const response = await api.get("/opportunities");
        // Filter out closed opportunities if needed, or show them with a badge
        setOpportunities(response.data.filter((opp: any) => opp.status === "Open"));
      } catch (error) {
        console.error("Failed to fetch opportunities:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOpportunities();
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">Careers</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">Explore open positions and kickstart your career with our industry partners.</p>
        </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
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
                      className="flex items-center justify-center gap-2 w-full text-center bg-white border-2 border-brand-500 text-brand-600 hover:bg-brand-50 font-semibold py-2.5 rounded-lg transition-colors cursor-pointer"
                    >
                      {isAuthenticated ? (
                        <>
                          Apply Now <ArrowRight className="w-4 h-4" />
                        </>
                      ) : (
                        <>
                          <ArrowLeft className="w-4 h-4" /> Login to Apply
                        </>
                      )}
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
