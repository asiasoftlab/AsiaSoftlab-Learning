"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth.store";
import { FileText, CheckCircle2, Clock, BarChart3, Search, ArrowRight, RotateCcw, Target, Loader2, X, Award, AlertCircle, Check, ChevronRight, Sparkles, } from "lucide-react";
import { CertificateModal, CertificateData } from "@/components/dashboard/CertificateModal";
import toast from "react-hot-toast";

interface Question {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation?: string;
  points?: number;
}

interface Assessment {
  id: string;
  title: string;
  courseId?: string;
  courseTitle: string;
  category: string;
  description?: string;
  thumbnailUrl?: string;
  durationMinutes: number;
  passingScore: number;
  maxAttempts: number;
  totalQuestions: number;
  questions?: Question[];
  status?: "Published" | "Draft";
  userStatus?: "not_started" | "in_progress" | "completed" | "failed";
  userScore?: number;
  userAttempts?: number;
  userProgress?: number;
  lastAttemptedAt?: string | Date;
  completedAt?: string | Date;
  createdAt?: string | Date;
}

interface StatsData {
  totalAssessments: number;
  completed: number;
  inProgress: number;
  notStarted: number;
  failed: number;
  averageScore: number;
}

export default function StudentAssessmentsPage() {
  const { user } = useAuthStore();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<StatsData>({
    totalAssessments: 0,
    completed: 0,
    inProgress: 0,
    notStarted: 0,
    failed: 0,
    averageScore: 0,
  });

  // Filters and Sorting
  const [activeTab, setActiveTab] = useState<"all" | "not_started" | "in_progress" | "completed" | "failed">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "highest_score" | "title">("newest");

  // Modals state
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);
  const [selectedCertificate, setSelectedCertificate] = useState<CertificateData | null>(null);

  // Quiz Taker State
  const [quizCurrentIndex, setQuizCurrentIndex] = useState(0);
  const [quizSelectedAnswers, setQuizSelectedAnswers] = useState<Record<string, number>>({});
  const [quizTimeRemaining, setQuizTimeRemaining] = useState(0);
  const [quizSubmitting, setQuizSubmitting] = useState(false);
  const [quizResult, setQuizResult] = useState<any | null>(null);

  // Load Data
  useEffect(() => {
    fetchAssessmentsData();
  }, []);

  const fetchAssessmentsData = async () => {
    try {
      setLoading(true);
      const [listRes, statsRes] = await Promise.all([
        api.get("/assessments"),
        api.get("/assessments/stats"),
      ]);
      setAssessments((listRes.data || []).filter((item: any) => item.status !== "Draft"));
      setStats(statsRes.data || {
        totalAssessments: listRes.data?.length || 0,
        completed: 0,
        inProgress: 0,
        notStarted: 0,
        failed: 0,
        averageScore: 0,
      });
    } catch (error) {
      console.error("Failed to load assessments:", error);
      toast.error("Failed to load assessments.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateValue?: string | Date) => {
    if (!dateValue) return "";
    try {
      const d = new Date(dateValue);
      return d.toLocaleDateString("en-US", {month: "short",day: "numeric",year: "numeric",});
    } catch {
      return String(dateValue);
    }
  };
 
  // Filter & Sort assessments
  const filteredAssessments = useMemo(() => {
    return assessments
      .filter((item) => {
        const itemStatus = item.userStatus || "not_started";
        if (activeTab !== "all" && itemStatus !== activeTab) {
          return false;
        }
        if (searchQuery.trim() !== "") {
          const q = searchQuery.toLowerCase();
          const matchTitle = item.title?.toLowerCase().includes(q);
          const matchCourse = item.courseTitle?.toLowerCase().includes(q);
          const matchCategory = item.category?.toLowerCase().includes(q);
          if (!matchTitle && !matchCourse && !matchCategory) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "newest") {
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        }
        if (sortBy === "oldest") {
          return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
        }
        if (sortBy === "highest_score") {
          return (b.userScore || 0) - (a.userScore || 0);
        }
        if (sortBy === "title") {
          return a.title.localeCompare(b.title);
        }
        return 0;
      });
  }, [assessments, activeTab, searchQuery, sortBy]);

  // Tab counts
  const tabCounts = useMemo(() => {
    const counts = {
      all: assessments.length,
      not_started: 0,
      in_progress: 0,
      completed: 0,
      failed: 0,
    };
    assessments.forEach((item) => {
      const st = item.userStatus || "not_started";
      if (st in counts) {
        counts[st as keyof typeof counts]++;
      }
    });
    return counts;
  }, [assessments]);

  // Start / Continue Quiz
  const handleStartQuiz = async (item: Assessment) => {
    try {
      setLoading(true);
      const res = await api.get(`/assessments/${item.id}`);
      const fullAssessment = res.data;
      if (!fullAssessment.questions || fullAssessment.questions.length === 0) {
        toast.error("This assessment has no questions available yet.");
        return;
      }
      setSelectedAssessment(fullAssessment);
      setQuizCurrentIndex(0);
      setQuizSelectedAnswers({});
      setQuizTimeRemaining((fullAssessment.durationMinutes || 30) * 60);
      setQuizResult(null);
      setIsQuizModalOpen(true);
    } catch (err) {
      console.error("Failed to start assessment:", err);
      toast.error("Could not load assessment.");
    } finally {
      setLoading(false);
    }
  };

  // Submit Quiz
  const handleSubmitQuiz = async () => {
    if (!selectedAssessment) return;
    try {
      setQuizSubmitting(true);
      const answersPayload = (selectedAssessment.questions || []).map((q) => ({
        questionId: q.id,
        selectedOption: quizSelectedAnswers[q.id] !== undefined ? quizSelectedAnswers[q.id] : -1,
      }));

      const res = await api.post(`/assessments/${selectedAssessment.id}/submit`, {
        answers: answersPayload,
        timeSpentSeconds: (selectedAssessment.durationMinutes * 60) - quizTimeRemaining,
      });

      setQuizResult(res.data);
      if (res.data.passed) {
        toast.success("Congratulations! Assessment Passed!");
      } else {
        toast.error("Assessment not passed. You can review your answers and retry.");
      }
      fetchAssessmentsData();
    } catch (err: any) {
      console.error("Failed to submit assessment:", err);
      toast.error("Failed to submit assessment.");
    } finally {
      setQuizSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Assessments</h1>
          <p className="text-slate-500 text-sm mt-1">
            Test your knowledge and complete assessments to earn your certificate.
          </p>
        </div>
      </div>

      {/* 4 Summary Cards (Exact UI from Screenshot) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Assessments */}
        <div className="bg-sky-50/70 border border-sky-100 rounded-xl p-5 flex items-center gap-4 transition-all hover:shadow-xs">
          <div>
            <div className="text-2xl font-extrabold text-slate-900 leading-tight">
              {stats.totalAssessments}
            </div>
            <div className="text-sm font-bold text-slate-800">Total Assessments</div>
            <div className="text-[12px] text-slate-500">Across all enrolled courses</div>
          </div>
        </div>

        {/* Card 2: Completed */}
        <div className="bg-emerald-50/70 border border-emerald-100 rounded-xl p-5 flex items-center gap-4 transition-all hover:shadow-xs">

          <div>
            <div className="text-2xl font-extrabold text-slate-900 leading-tight">
              {stats.completed}
            </div>
            <div className="text-sm font-bold text-slate-800">Completed</div>
            <div className="text-[12px] text-emerald-600 font-medium">
              Great progress{user?.displayName ? `, ${user.displayName}` : ""}!
            </div>
          </div>
        </div>

        {/* Card 3: In Progress */}
        <div className="bg-amber-50/70 border border-amber-100 rounded-xl p-5 flex items-center gap-4 transition-all hover:shadow-xs">

          <div>
            <div className="text-2xl font-extrabold text-slate-900 leading-tight">
              {stats.inProgress}
            </div>
            <div className="text-sm font-bold text-slate-800">In Progress</div>
            <div className="text-[12px] text-amber-600 font-medium">Keep going!</div>
          </div>
        </div>

        {/* Card 4: Average Score */}
        <div className="bg-purple-50/70 border border-purple-100 rounded-xl p-5 flex items-center gap-4 transition-all hover:shadow-xs">

          <div>
            <div className="text-2xl font-extrabold text-slate-900 leading-tight">
              {stats.averageScore}%
            </div>
            <div className="text-sm font-bold text-slate-800">Average Score</div>
            <div className="text-[12px] text-slate-500">Across completed assessments</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search / Sort Controls */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pt-2">
        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${activeTab === "all"
                ? "bg-brand-600 text-white shadow-sm"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
          >
            All ({tabCounts.all})
          </button>
          <button
            onClick={() => setActiveTab("not_started")}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${activeTab === "not_started"
                ? "bg-brand-600 text-white shadow-sm"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
          >
            Not Started ({tabCounts.not_started})
          </button>
          <button
            onClick={() => setActiveTab("in_progress")}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${activeTab === "in_progress"
                ? "bg-brand-600 text-white shadow-sm"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
          >
            In Progress ({tabCounts.in_progress})
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${activeTab === "completed"
                ? "bg-brand-600 text-white shadow-sm"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
          >
            Completed ({tabCounts.completed})
          </button>
          <button
            onClick={() => setActiveTab("failed")}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${activeTab === "failed"
                ? "bg-brand-600 text-white shadow-sm"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
          >
            Failed ({tabCounts.failed})
          </button>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search assessments..."
              className="w-full pl-9 pr-3 py-1.5 text-sm bg-white border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg px-3 py-1.5 shadow-xs w-full sm:w-auto justify-between sm:justify-start">
            <span className="text-slate-500 font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer pr-1"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="highest_score">Highest Score</option>
              <option value="title">Title (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
          <p className="text-sm font-medium text-slate-500">Loading your assessments...</p>
        </div>
      ) : filteredAssessments.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-xs">
          <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-400 mb-4">
            <FileText className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">No assessments found</h3>
          <p className="text-sm text-slate-500 mt-1">
            {searchQuery
              ? `No assessments matched "${searchQuery}".`
              : "No assessments in this status right now."}
          </p>
        </div>
      ) : (
        /* Assessment Items List */
        <div className="space-y-4">
          {filteredAssessments.map((assessment) => {
            const status = assessment.userStatus || "not_started";
            const qCount = assessment.totalQuestions || assessment.questions?.length || 20;
            const duration = assessment.durationMinutes || 30;
            const passingScore = assessment.passingScore || 70;
            const attempts = assessment.userAttempts || 0;
            const maxAttempts = assessment.maxAttempts || 3;
            const progress = assessment.userProgress || 0;

            return (
              <div
                key={assessment.id}
                className="bg-white rounded-xl border border-slate-200/90 hover:border-slate-300 p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6"
              >
                {/* Left Section: Thumbnail & Info */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full xl:w-auto flex-1">
                  {/* Thumbnail */}
                  <div className="w-full sm:w-36 h-24 sm:h-22 rounded-lg overflow-hidden relative bg-slate-900 flex-shrink-0 flex items-center justify-center border border-slate-200/50 shadow-inner">
                    {assessment.thumbnailUrl ? (
                      <Image
                        src={assessment.thumbnailUrl}
                        alt={assessment.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col items-center justify-center p-2 text-center">
                        <Award className="w-6 h-6 text-brand-400 mb-1" />
                        <span className="text-[10px] font-bold text-white tracking-wider uppercase line-clamp-1">
                          {assessment.category}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Information */}
                  <div className="flex-1 space-y-1.5 w-full">
                    <h3 className="text-base font-bold text-slate-900 hover:text-brand-600 transition-colors">
                      {assessment.title}
                    </h3>

                    <p className="text-xs text-slate-500 font-medium">
                      {assessment.courseTitle || assessment.category}
                    </p>

                    {/* Meta Row with Icons */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500 pt-1 font-medium">
                      <div className="flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-slate-400" />
                        <span>{qCount} Questions</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{duration} Minutes</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Target className="w-3.5 h-3.5 text-slate-400" />
                        <span>Passing Score: {passingScore}%</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                        <span>Attempts: {attempts}/{maxAttempts}</span>
                      </div>
                    </div>

                    {/* Progress bar for In Progress */}
                    {status === "in_progress" && (
                      <div className="pt-2 flex items-center gap-3 w-full max-w-sm">
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-brand-600 h-full rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-slate-700 min-w-[32px]">
                          {progress}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Section: Badges and Action Button */}
                <div className="flex flex-col sm:flex-row xl:flex-col items-start sm:items-center xl:items-end justify-between w-full xl:w-auto gap-3 pt-3 xl:pt-0 border-t xl:border-t-0 border-slate-100">
                  {/* Status & Attempt Info */}
                  <div className="flex items-center gap-2 flex-wrap text-xs">
                    {status === "in_progress" && (
                      <>
                        <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          In Progress
                        </span>
                        {assessment.lastAttemptedAt && (
                          <span className="text-[11px] text-slate-500 font-medium">
                            Last attempted: {formatDate(assessment.lastAttemptedAt)}
                          </span>
                        )}
                      </>
                    )}

                    {status === "not_started" && (
                      <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                        Not Started
                      </span>
                    )}

                    {status === "failed" && (
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-red-50 text-red-700 border border-red-200">
                          Failed
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium">
                          Score: <strong className="text-slate-700">{assessment.userScore || 0}%</strong>
                          {assessment.lastAttemptedAt && ` | Last attempted: ${formatDate(assessment.lastAttemptedAt)}`}
                        </span>
                      </div>
                    )}

                    {status === "completed" && (
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Passed
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium">
                          Score: <strong className="text-slate-700">{assessment.userScore || 0}%</strong>
                          {assessment.completedAt && ` | Completed: ${formatDate(assessment.completedAt)}`}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Primary Action Button */}
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    {status === "in_progress" && (
                      <button
                        onClick={() => handleStartQuiz(assessment)}
                        className="w-full sm:w-auto bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
                      >
                        Continue Assessment <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {status === "not_started" && (
                      <button
                        onClick={() => handleStartQuiz(assessment)}
                        className="w-full sm:w-auto bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
                      >
                        Start Assessment <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {status === "failed" && (
                      <button
                        onClick={() => handleStartQuiz(assessment)}
                        className="w-full sm:w-auto bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
                      >
                        Retry Assessment <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {status === "completed" && (
                      <button
                        onClick={() => {
                          setSelectedAssessment(assessment);
                          setIsResultModalOpen(true);
                        }}
                        className="w-full sm:w-auto border border-brand-600 text-brand-600 hover:bg-brand-50 font-semibold text-xs px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
                      >
                        View Results
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ===================== QUIZ TAKER MODAL ===================== */}
      {isQuizModalOpen && selectedAssessment && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full flex flex-col shadow-2xl overflow-hidden border border-slate-200">
            {/* Quiz Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-900 text-white">
              <div>
                <h2 className="text-base font-bold">{selectedAssessment.title}</h2>
                <p className="text-xs text-slate-400">{selectedAssessment.courseTitle}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 bg-slate-800 px-3 py-1 rounded-lg border border-slate-700 text-xs font-bold text-amber-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>
                    {Math.floor(quizTimeRemaining / 60)}:
                    {(quizTimeRemaining % 60).toString().padStart(2, "0")}
                  </span>
                </div>
                <button
                  onClick={() => setIsQuizModalOpen(false)}
                  className="text-slate-400 hover:text-white p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quiz Body */}
            {quizResult ? (
              /* Quiz Result Summary */
              <div className="p-8 text-center space-y-6">
                <div
                  className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center ${quizResult.passed
                      ? "bg-emerald-100 text-emerald-600"
                      : "bg-red-100 text-red-600"
                    }`}
                >
                  {quizResult.passed ? (
                    <Award className="w-10 h-10" />
                  ) : (
                    <AlertCircle className="w-10 h-10" />
                  )}
                </div>

                <div>
                  <h3 className="text-2xl font-extrabold text-slate-900">
                    {quizResult.passed ? "Assessment Passed!" : "Assessment Incomplete / Failed"}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    {quizResult.passed
                      ? "Great job! You have met the required passing criteria."
                      : "You did not achieve the required passing score. You can retry the assessment."}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                  <div>
                    <div className="text-xs text-slate-500 font-medium">Your Score</div>
                    <div className="text-xl font-black text-slate-900">{quizResult.score}%</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-medium">Passing Target</div>
                    <div className="text-xl font-black text-slate-900">
                      {selectedAssessment.passingScore}%
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-medium">Status</div>
                    <div
                      className={`text-sm font-extrabold uppercase mt-1 ${quizResult.passed ? "text-emerald-600" : "text-red-600"
                        }`}
                    >
                      {quizResult.passed ? "Passed" : "Failed"}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3">
                  {quizResult.passed && (
                    <button
                      onClick={() => {
                        setSelectedCertificate({
                          id: `cert_${selectedAssessment.id}`,
                          courseTitle: selectedAssessment.courseTitle || selectedAssessment.title,
                          recipientName: user?.displayName || "Student",
                          score: quizResult.score,
                          issuedDate: new Date(),
                          certificateNumber: `ASVA2025-${selectedAssessment.id.substring(0, 6).toUpperCase()}`,
                          issuer: "ASVA (Asia Softlab Virtual Academy)",
                          ceoName: "Anil Kumar",
                          ceoTitle: "Academic Director, ASVA",
                        });
                        setIsQuizModalOpen(false);
                      }}
                      className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-yellow-200" />
                      View Certificate
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setQuizResult(null);
                      setQuizCurrentIndex(0);
                      setQuizSelectedAnswers({});
                    }}
                    className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Retake Test
                  </button>
                  <button
                    onClick={() => setIsQuizModalOpen(false)}
                    className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-2.5 rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer"
                  >
                    Done & Close
                  </button>
                </div>
              </div>
            ) : (
              /* Question Slide View */
              <div className="p-6 space-y-6">
                {selectedAssessment.questions && selectedAssessment.questions[quizCurrentIndex] && (
                  (() => {
                    const currentQ = selectedAssessment.questions[quizCurrentIndex];
                    const selectedOpt = quizSelectedAnswers[currentQ.id];

                    return (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                          <span>
                            Question {quizCurrentIndex + 1} of{" "}
                            {selectedAssessment.questions.length}
                          </span>
                          <span>{currentQ.points || 5} Points</span>
                        </div>

                        {/* Progress line */}
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-brand-600 h-full rounded-full transition-all"
                            style={{
                              width: `${((quizCurrentIndex + 1) / selectedAssessment.questions.length) * 100
                                }%`,
                            }}
                          />
                        </div>

                        {/* Question Text */}
                        <h3 className="text-base font-bold text-slate-900 pt-2">
                          {currentQ.question}
                        </h3>

                        {/* Options */}
                        <div className="space-y-2.5 pt-2">
                          {currentQ.options.map((opt, optIndex) => {
                            const isSelected = selectedOpt === optIndex;
                            return (
                              <button
                                key={optIndex}
                                type="button"
                                onClick={() =>
                                  setQuizSelectedAnswers({
                                    ...quizSelectedAnswers,
                                    [currentQ.id]: optIndex,
                                  })
                                }
                                className={`w-full text-left p-3.5 rounded-xl border flex items-center gap-3 transition-all cursor-pointer ${isSelected
                                    ? "bg-brand-50 border-brand-500 ring-2 ring-brand-500/20 shadow-xs"
                                    : "bg-white border-slate-200 hover:bg-slate-50"
                                  }`}
                              >
                                <div
                                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${isSelected
                                      ? "bg-brand-600 text-white"
                                      : "bg-slate-100 text-slate-600"
                                    }`}
                                >
                                  {String.fromCharCode(65 + optIndex)}
                                </div>
                                <span className="text-xs font-medium text-slate-800">{opt}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()
                )}

                {/* Quiz Navigation Buttons */}
                <div className="flex items-center justify-between border-t border-slate-200 pt-4">
                  <button
                    disabled={quizCurrentIndex === 0}
                    onClick={() => setQuizCurrentIndex((prev) => Math.max(0, prev - 1))}
                    className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-xs font-bold disabled:opacity-40 hover:bg-slate-50 transition-colors"
                  >
                    Previous
                  </button>

                  {quizCurrentIndex < (selectedAssessment.questions?.length || 1) - 1 ? (
                    <button
                      onClick={() => setQuizCurrentIndex((prev) => prev + 1)}
                      className="bg-brand-600 hover:bg-brand-700 text-white px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      Next Question <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmitQuiz}
                      disabled={quizSubmitting}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      {quizSubmitting ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Check className="w-4 h-4" />
                      )}
                      Submit Assessment
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===================== VIEW RESULTS MODAL ===================== */}
      {isResultModalOpen && selectedAssessment && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5 text-center">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <Award className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-xl font-extrabold text-slate-900">
                {selectedAssessment.title}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Completed on {formatDate(selectedAssessment.completedAt || selectedAssessment.lastAttemptedAt || new Date())}
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 grid grid-cols-2 gap-3 text-left">
              <div>
                <span className="text-[11px] text-slate-500 font-medium">Final Score</span>
                <p className="text-lg font-black text-emerald-600">
                  {selectedAssessment.userScore || 0}%
                </p>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 font-medium">Passing Target</span>
                <p className="text-lg font-black text-slate-800">
                  {selectedAssessment.passingScore || 70}%
                </p>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 font-medium">Attempts Used</span>
                <p className="text-sm font-bold text-slate-800">
                  {selectedAssessment.userAttempts || 0} / {selectedAssessment.maxAttempts || 3}
                </p>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 font-medium">Grade Status</span>
                <p className="text-sm font-bold text-emerald-600 uppercase">
                  {selectedAssessment.userStatus === "failed" ? "Failed" : "Passed"}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              {selectedAssessment.userStatus === "completed" && (
                <button
                  onClick={() => {
                    setSelectedCertificate({
                      id: `cert_${selectedAssessment.id}`,
                      courseTitle: selectedAssessment.courseTitle || selectedAssessment.title,
                      recipientName: user?.displayName || "Student",
                      score: selectedAssessment.userScore || 88,
                      issuedDate: selectedAssessment.completedAt || selectedAssessment.lastAttemptedAt || new Date(),
                      certificateNumber: `ASVA2025-${selectedAssessment.id.substring(0, 6).toUpperCase()}`,
                      issuer: "ASVA (Asia Softlab Virtual Academy)",
                      ceoName: "Anil Kumar",
                      ceoTitle: "Academic Director, ASVA",
                    });
                    setIsResultModalOpen(false);
                  }}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2.5 rounded-lg text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-yellow-200" />
                  View & Download Certificate
                </button>
              )}
              <button
                onClick={() => setIsResultModalOpen(false)}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Verified Certificate Viewer & Print Modal */}
      {selectedCertificate && (
        <CertificateModal
          certificate={selectedCertificate}
          onClose={() => setSelectedCertificate(null)}
        />
      )}
    </div>
  );
}
