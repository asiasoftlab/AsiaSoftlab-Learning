"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth.store";
import { Award, Download, Eye, Calendar, CheckCircle2, Search, ArrowRight, Loader2, Sparkles, BookOpen } from "lucide-react";
import { CertificateModal, CertificateData } from "@/components/dashboard/CertificateModal";
import Link from "next/link";
import toast from "react-hot-toast";

function formatCertificateDate(dateVal?: any): string {
  if (!dateVal) {
    return new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  try {
    let d: Date;
    if (typeof dateVal === "object") {
      if (dateVal instanceof Date) {
        d = dateVal;
      } else if (typeof dateVal.toDate === "function") {
        d = dateVal.toDate();
      } else if ("_seconds" in dateVal && typeof dateVal._seconds === "number") {
        d = new Date(dateVal._seconds * 1000);
      } else if ("seconds" in dateVal && typeof dateVal.seconds === "number") {
        d = new Date(dateVal.seconds * 1000);
      } else {
        d = new Date(dateVal);
      }
    } else if (typeof dateVal === "number") {
      d = new Date(dateVal > 1e11 ? dateVal : dateVal * 1000);
    } else {
      d = new Date(dateVal);
    }

    if (isNaN(d.getTime())) {
      return new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }

    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }
}

export default function CertificatesPage() {
  const { user } = useAuthStore();
  const [certificates, setCertificates] = useState<CertificateData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCert, setSelectedCert] = useState<CertificateData | null>(null);

  useEffect(() => {
    fetchCertificates();
  }, [user]);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      // Try backend endpoint first
      const res = await api.get("/assessments/user/my-certificates");
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        setCertificates(res.data);
      } else {
        // Fallback: check completed assessments
        const [assessmentsRes] = await Promise.all([
          api.get("/assessments"),
        ]);
        const passedAssessments = (assessmentsRes.data || []).filter(
          (a: any) => a.userStatus === "completed" || (a.userScore && a.userScore >= (a.passingScore || 70))
        );

        const mapped: CertificateData[] = passedAssessments.map((a: any, idx: number) => ({
          id: `cert_${a.id || idx}`,
          courseTitle: a.courseTitle || a.title,
          recipientName: user?.displayName || "Student",
          score: a.userScore || 88,
          issuedDate: a.completedAt || a.lastAttemptedAt || new Date(),
          certificateNumber: `ASVA2025-${(a.id || "001234").substring(0, 6).toUpperCase()}`,
          issuer: "ASVA (Asia Softlab Virtual Academy)",
          ceoName: "Mr.Nishadh S",
          ceoTitle: "CEO of Asia Softlab Pvt.Ltd.",
        }));

        setCertificates(mapped);
      }
    } catch (error) {
      console.error("Failed to load certificates:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCerts = certificates.filter((c) =>
    c.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.certificateNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            My Certificates
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Official verifiable certificates of achievement for every course and assessment you complete.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search certificates..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all shadow-xs"
          />
        </div>
      </div>

      {/* Main Certificate Cards List */}
      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
          <p className="text-sm font-medium text-slate-500">Loading your verified certificates...</p>
        </div>
      ) : filteredCerts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-12 text-center max-w-lg mx-auto shadow-xs space-y-4">
          <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto">
            <Award className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">No Certificates Earned Yet</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
              Complete any enrolled course and score 70% or higher on its assessment to unlock your official certificate!
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/dashboard/assessments"
              className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs px-5 py-2.5 rounded-lg shadow-sm transition-all"
            >
              Take an Assessment <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCerts.map((cert) => (
            <div
              key={cert.id}
              className="bg-white rounded-2xl border border-slate-200/90 hover:border-amber-400/80 p-6 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
            >
              
              <div className="space-y-4">
                {/* Badge and ID header */}
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[12px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                   Verified Certificate
                  </span>
                  <span className="text-[12px] font-mono text-slate-400 font-semibold">
                    {cert.certificateNumber}
                  </span>
                </div>

                {/* Course Title */}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-2">
                    {cert.courseTitle}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Awarded to <strong className="text-slate-800">{cert.recipientName}</strong>
                  </p>
                </div>

                {/* Meta details */}
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex items-center justify-between text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{formatCertificateDate(cert.issuedDate)}</span>
                  </div>
                  {cert.score !== undefined && (
                    <div className="flex items-center gap-1 text-emerald-700 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Score: {cert.score}%</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 mt-4 border-t border-slate-100 flex items-center gap-3">
                <button
                  onClick={() => setSelectedCert(cert)}
                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" /> View Certificate
                </button>
                <button
                  onClick={() => setSelectedCert(cert)}
                  className="bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 font-semibold text-xs px-3.5 py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  title="Print or Download PDF"
                >
                  <Download className="w-3.5 h-3.5" /> Download
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Certificate Viewer Modal */}
      {selectedCert && (
        <CertificateModal
          certificate={selectedCert}
          onClose={() => setSelectedCert(null)}
        />
      )}
    </div>
  );
}