"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import AiAssistant from "@/components/chat/AiAssistant";
import {
  Play,
  Loader2,
  PlayCircle,
  Clock,
  Users,
  Star,
  ArrowLeft,
  Lock,
  LayoutGrid,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  BookOpen,
  Layers,
  FileText,
  Download,
  ArrowRight,
  Award,
  Eye,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/auth.store";
import dynamic from "next/dynamic";
import { CertificateModal, CertificateData } from "@/components/dashboard/CertificateModal";
import { CertificateFeedbackModal } from "@/components/dashboard/CertificateFeedbackModal";

import SecureVideoPlayer from "@/components/SecureVideoPlayer";

// react-pdf uses browser-only Canvas APIs — must be loaded client-side only
const SecureDocumentViewer = dynamic(
  () => import("@/components/SecureDocumentViewer").then((m) => m.SecureDocumentViewer),
  { ssr: false }
);

interface CourseProgressState {
  completedLessonIds: string[];
  unlockedLessonIds: string[];
  isCompleted: boolean;
  progressPercentage: number;
  certificateAvailable: boolean;
  nextLessonId?: string | null;
}

export default function CourseDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const urlLessonId = searchParams.get("lessonId");
  const { isAuthenticated, user } = useAuthStore();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeLesson, setActiveLesson] = useState<any>(null);
  const [viewerUrl, setViewerUrl] = useState<string | null>(null);
  const [viewerTitle, setViewerTitle] = useState("");
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [checkingEnrollment, setCheckingEnrollment] = useState(false);
  // Sequential Progress & Certificate State
  const [progress, setProgress] = useState<CourseProgressState | null>(null);
  const [completingLesson, setCompletingLesson] = useState(false);
  const [certificateData, setCertificateData] = useState<CertificateData | null>(null);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  // Admin or instructor can watch regardless of enrollment. Also free courses (price === 0).
  const isAdminOrInstructor = user?.role === "admin" || user?.role === "instructor";
  const canAccessCourse =
    isEnrolled || (course && (course.price === 0 || course.price === "0")) || isAdminOrInstructor;

  useEffect(() => {
    const initCourseAndProgress = async () => {
      setLoading(true);
      try {
        const courseRes = await api.get(`/courses/${id}`);
        const courseData = courseRes.data;
        setCourse(courseData);

        const sorted = courseData.lessons
          ? [...courseData.lessons].sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
          : [];

        let currentProg: any = null;
        if (isAuthenticated) {
          setCheckingEnrollment(true);
          try {
            const [enrollRes, progRes] = await Promise.all([
              api.get(`/payments/check/${id}`).catch(() => null),
              api.get(`/courses/${id}/progress`).catch(() => null),
            ]);

            if (enrollRes?.data?.isEnrolled) {
              setIsEnrolled(true);
            }

            if (progRes?.data?.canAccess || progRes?.data?.isEnrolled) {
              setIsEnrolled(true);
              currentProg = progRes.data;
              setProgress({
                completedLessonIds: progRes.data.completedLessonIds || [],
                unlockedLessonIds: progRes.data.unlockedLessonIds || [],
                isCompleted: !!progRes.data.isCompleted,
                progressPercentage: progRes.data.progressPercentage || 0,
                certificateAvailable: !!progRes.data.certificateAvailable,
                nextLessonId: progRes.data.nextLessonId,
              });
            }
          } catch (e) {
            console.error("Error loading enrollment or progress:", e);
          } finally {
            setCheckingEnrollment(false);
          }
        }

        // Determine active lesson based on sequential unlocking and URL parameters
        if (sorted.length > 0) {
          const unlockedIds = currentProg?.unlockedLessonIds || [sorted[0].id];
          if (urlLessonId) {
            const requested = sorted.find((l: any) => l.id === urlLessonId);
            if (requested && (unlockedIds.includes(urlLessonId) || isAdminOrInstructor)) {
              setActiveLesson(requested);
            } else if (requested) {
              toast.error("This lesson is locked. Complete the preceding lessons first.", {
                icon: "🔒",
              });
              const fallback =
                sorted.find((l: any) => l.id === currentProg?.nextLessonId) || sorted[0];
              setActiveLesson(fallback);
            } else {
              setActiveLesson(sorted[0]);
            }
          } else if (currentProg?.nextLessonId) {
            const nextL = sorted.find((l: any) => l.id === currentProg.nextLessonId) || sorted[0];
            setActiveLesson(nextL);
          } else {
            setActiveLesson(sorted[0]);
          }
        }
      } catch (error) {
        console.error("Failed to fetch course details:", error);
        toast.error("Failed to load course details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      initCourseAndProgress();
    }
  }, [id, isAuthenticated, isAdminOrInstructor, urlLessonId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <h2 className="text-2xl font-bold text-slate-800">Course not found</h2>
        <Link href="/courses" className="text-brand-600 hover:underline mt-4">
          Return to Courses
        </Link>
      </div>
    );
  }

  const sortedLessons = course.lessons
    ? [...course.lessons].sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
    : [];

  const handleEnrollClick = () => {
    if (isEnrolled) {
      if (sortedLessons.length > 0) {
        setActiveLesson(sortedLessons[0]);
      }
      toast.success("You are enrolled! Enjoy the course lessons.");
      return;
    }

    if (!isAuthenticated) {
      toast.error("Please log in to enroll in this course");
      router.push(`/login?redirect=/checkout?courseId=${id}`);
      return;
    }

    router.push(`/checkout?courseId=${id}`);
  };

  const handleLessonClick = (lesson: any) => {
    if (!isAuthenticated) {
      toast.error("Please log in to view lessons");
      router.push(`/login?redirect=/courses/${id}`);
      return;
    }
    if (!canAccessCourse) {
      toast.error("Please enroll in this course to watch lessons");
      return;
    }

    const isUnlocked =
      isAdminOrInstructor ||
      (progress ? progress.unlockedLessonIds?.includes(lesson.id) : lesson.id === sortedLessons[0]?.id);

    if (!isUnlocked) {
      toast.error("This lesson is locked. You must complete the previous lesson first.", {
        icon: "🔒",
      });
      return;
    }

    setActiveLesson(lesson);
  };

  const handleCompleteLesson = async (lessonId: string, autoAdvanced = false) => {
    if (!isAuthenticated || !canAccessCourse) return;
    try {
      setCompletingLesson(true);
      const res = await api.post(`/courses/${id}/lessons/${lessonId}/complete`);
      if (res.data?.success) {
        setProgress({
          completedLessonIds: res.data.completedLessonIds || [],
          unlockedLessonIds: res.data.unlockedLessonIds || [],
          isCompleted: !!res.data.isCompleted,
          progressPercentage: res.data.progressPercentage || 0,
          certificateAvailable: !!res.data.certificateAvailable,
          nextLessonId: res.data.nextLessonId,
        });

        if (res.data.isCompleted) {
          toast.success("🎉 Course Completed! You have unlocked your official course certificate!", {
            duration: 6000,
          });
        } else {
          toast.success(
            autoAdvanced
              ? "Lesson finished! Next lesson unlocked 🎉"
              : "Lesson marked as completed! Next lesson unlocked 🎉"
          );
        }

        if (autoAdvanced && res.data.nextLessonId && res.data.nextLessonId !== lessonId) {
          const next = sortedLessons.find((l: any) => l.id === res.data.nextLessonId);
          if (next) {
            setActiveLesson(next);
          }
        }
      }
    } catch (error: any) {
      console.error("Failed to complete lesson:", error);
      toast.error(error.response?.data?.message || "Failed to mark lesson as completed.");
    } finally {
      setCompletingLesson(false);
    }
  };

  const handleViewCertificate = async () => {
    if (!canAccessCourse) {
      toast.error("Please enroll in the course first.");
      return;
    }
    try {
      const res = await api.get(`/courses/${id}/certificate`);
      setCertificateData(res.data);
      setIsCertificateModalOpen(true);
    } catch (error: any) {
      console.error("Failed to load certificate:", error);
      toast.error(
        error.response?.data?.message ||
          "Certificate is locked. You must complete every lesson in this course first."
      );
    }
  };

  const handleDocumentClick = async (doc: any) => {
    if (!isAuthenticated) {
      toast.error("Please log in to view documents");
      return;
    }
    if (!canAccessCourse) {
      toast.error("Please enroll in this course to access supporting documents");
      return;
    }

    const isLessonUnlocked =
      isAdminOrInstructor ||
      (progress ? progress.unlockedLessonIds?.includes(activeLesson?.id) : true);

    if (!isLessonUnlocked) {
      toast.error("This lesson is locked. Complete the previous lesson to access study documents.", {
        icon: "🔒",
      });
      return;
    }

    try {
      const toastId = toast.loading("Securely fetching document...");
      const response = await api.get(
        `/courses/${id}/lessons/${activeLesson.id}/documents/${doc.id}/access`
      );
      toast.dismiss(toastId);

      const { url, fileType, filename } = response.data;
      if (fileType === "application/pdf") {
        setViewerUrl(url);
        setViewerTitle(filename || doc.title);
      } else {
        window.open(url, "_blank");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to access document. Access is locked.");
    }
  };

  const isCurrentLessonUnlocked =
    !canAccessCourse ||
    isAdminOrInstructor ||
    !progress ||
    (activeLesson && progress.unlockedLessonIds?.includes(activeLesson.id));

  const isCurrentLessonCompleted =
    canAccessCourse && progress?.completedLessonIds?.includes(activeLesson?.id);

  return (
    <div className="bg-slate-50 min-h-screen py-6 sm:py-8 md:py-10">
      <div className="container mx-auto px-4 sm:px-6">
        <Link
          href="/courses"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-brand-600 transition-colors mb-4 sm:mb-6 font-medium text-xs sm:text-sm"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Courses
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Content Area: Video Player & Description */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Video Player */}
            <div className="bg-black rounded-xl sm:rounded-2xl overflow-hidden shadow-xl aspect-video min-h-[240px] sm:min-h-0 relative">
              {checkingEnrollment ? (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-900 p-6 text-center">
                  <Loader2 className="h-10 w-10 animate-spin text-brand-500 mb-3" />
                  <p className="text-sm">Checking enrollment status...</p>
                </div>
              ) : !isAuthenticated ? (
                <div className="relative w-full h-full flex items-center justify-center md:justify-end text-center p-4 sm:p-6 md:pr-12 overflow-hidden">
                  <Image
                    src="/Courses/course-locked-bg.png"
                    alt="Course Preview"
                    fill
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    className="object-cover object-center select-none"
                    priority
                  />

                  <div className="relative z-10 flex flex-col items-center max-w-xs sm:max-w-sm w-full p-4 sm:px-7 sm:py-8 rounded-xl sm:rounded-2xl bg-slate-950/70 sm:bg-slate-950/40 backdrop-blur-md border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                    <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-lg bg-white/15 backdrop-blur-md flex items-center justify-center mb-2 sm:mb-3.5 shadow-inner border border-white/25">
                      <Lock className="h-5 w-5 sm:h-7 sm:w-7 text-red-400" />
                    </div>
                    <h3 className="text-base sm:text-xl md:text-2xl font-bold text-white mb-1 sm:mb-2 tracking-tight">
                      Member Access Only
                    </h3>
                    <p className="text-[11px] sm:text-xs md:text-sm text-slate-200/90 mb-3 sm:mb-6 leading-relaxed line-clamp-2 sm:line-clamp-none">
                      Please log in to your account to access the video lectures, documents, and
                      course syllabus.
                    </p>
                    <button
                      onClick={() => router.push(`/login?redirect=/courses/${id}`)}
                      className="inline-flex items-center gap-1.5 sm:gap-2 bg-brand-600 hover:bg-brand-500 text-white px-5 sm:px-7 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold transition-all shadow-lg hover:shadow-brand-500/30 hover:scale-[1.02] active:scale-[0.98] cursor-pointer w-full justify-center"
                    >
                      Log in to Watch <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </button>
                  </div>
                </div>
              ) : !canAccessCourse ? (
                <div className="relative w-full h-full overflow-hidden rounded-2xl">
                  {/* Background Image */}
                  <Image
                    src="/Courses/course-locked-bg.png"
                    alt="Course Preview"
                    fill
                    priority
                    sizes="100vw"
                    className="absolute inset-0 w-full h-full object-cover object-center"
                  />

                  {/* Dark overlay */}
                  <div className="absolute inset-0 bg-black/10" />

                  {/* Locked Content */}
                  <div className="absolute inset-0 z-10 flex items-center justify-center md:justify-end p-4 sm:p-6 md:pr-12">
                    <div className="flex flex-col items-center max-w-xs sm:max-w-sm w-full p-4 sm:px-6 sm:py-7 rounded-xl bg-slate-950/70 sm:bg-slate-950/40 backdrop-blur-md border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                      <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-lg bg-emerald-500/20 backdrop-blur-md flex items-center justify-center mb-2 sm:mb-3.5 border border-emerald-400/30">
                        <Lock className="h-5 w-5 sm:h-7 sm:w-7 text-emerald-400" />
                      </div>

                      <h3 className="text-base sm:text-xl md:text-2xl font-bold text-white mb-1 sm:mb-2 tracking-tight">
                        Course Locked
                      </h3>

                      <p className="text-[11px] sm:text-xs md:text-sm text-slate-200/90 mb-3 sm:mb-6 leading-relaxed text-center line-clamp-2 sm:line-clamp-none">
                        You must enroll in this course to unlock and watch the video lessons and
                        access study materials.
                      </p>

                      <button
                        onClick={handleEnrollClick}
                        className="inline-flex items-center gap-1.5 sm:gap-2 bg-brand-600 hover:bg-brand-500 text-white px-5 sm:px-7 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold transition-all shadow-lg hover:shadow-brand-500/30 hover:scale-[1.02] active:scale-[0.98] cursor-pointer w-full justify-center"
                      >
                        Enroll Now to Unlock
                        <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : !isCurrentLessonUnlocked ? (
                /* Sequential Locking Notice Screen */
                <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center bg-slate-950 text-white rounded-xl">
                  <div className="w-14 h-14 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mb-3.5 border border-amber-400/30">
                    <Lock className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-1 tracking-tight">
                    Lesson Locked
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-sm mb-5 leading-relaxed">
                    This lesson is locked. ASVA courses are structured sequentially. Please complete
                    the preceding lessons to unlock this lesson.
                  </p>
                  <button
                    onClick={() => {
                      const fallbackId = progress?.nextLessonId || sortedLessons[0]?.id;
                      const target = sortedLessons.find((l: any) => l.id === fallbackId);
                      if (target) setActiveLesson(target);
                    }}
                    className="bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold px-5 py-2.5 rounded-lg transition-all shadow-md cursor-pointer"
                  >
                    Resume Current Available Lesson
                  </button>
                </div>
              ) : activeLesson && activeLesson.youtubeVideoId ? (
                <SecureVideoPlayer
                  videoId={activeLesson.youtubeVideoId}
                  title={activeLesson.title}
                  onEnded={() => {
                    if (activeLesson && !progress?.completedLessonIds?.includes(activeLesson.id)) {
                      handleCompleteLesson(activeLesson.id, true);
                    }
                  }}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-500">
                  <PlayCircle className="h-16 w-16 mb-4 opacity-50" />
                  <p>No video available for this lesson.</p>
                </div>
              )}
            </div>

            {/* Course Completion Congratulations Banner */}
            {canAccessCourse && progress?.isCompleted && (
              <div className="bg-gradient-to-r from-amber-50 via-emerald-50 to-teal-50 border border-amber-300/80 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm animate-in fade-in duration-300">
                <div className="flex items-center gap-3">
                 
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-1.5">
                      Course Completed!
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Congratulations! You've completed all {sortedLessons.length} lessons. Your official verifiable certificate is ready.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                  <button
                    onClick={handleViewCertificate}
                    className="flex-1 sm:flex-initial bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-4 py-2.5 rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Award className="w-4 h-4" /> View Certificate
                  </button>
                  <button
                    onClick={() => setIsFeedbackModalOpen(true)}
                    className="bg-white hover:bg-amber-50 border border-amber-300 text-amber-800 font-bold text-xs px-3 py-2.5 rounded-lg shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    title="Leave Feedback"
                  >
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  </button>
                </div>
              </div>
            )}

            {/* Lesson Completion Action Bar */}
            {canAccessCourse && activeLesson && (
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                      isCurrentLessonCompleted
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-brand-100 text-brand-700"
                    }`}
                  >
                    {isCurrentLessonCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      sortedLessons.findIndex((l: any) => l.id === activeLesson.id) + 1
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm truncate max-w-xs sm:max-w-md">
                      {activeLesson.title}
                    </h4>
                    <p className="text-xs text-slate-500">
                      {activeLesson.duration || "Video Lesson"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isCurrentLessonCompleted ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Completed
                    </span>
                  ) : (
                    <button
                      onClick={() => handleCompleteLesson(activeLesson.id)}
                      disabled={completingLesson || !isCurrentLessonUnlocked}
                      className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-xs cursor-pointer transition-all"
                    >
                      {completingLesson ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      )}
                      <span>{completingLesson ? "Completing..." : "Mark as Completed"}</span>
                    </button>
                  )}

                  {(() => {
                    const activeIdx = sortedLessons.findIndex((l: any) => l.id === activeLesson.id);
                    const nextLesson =
                      activeIdx >= 0 && activeIdx < sortedLessons.length - 1
                        ? sortedLessons[activeIdx + 1]
                        : null;
                    const isNextUnlocked =
                      nextLesson &&
                      (isAdminOrInstructor || progress?.unlockedLessonIds?.includes(nextLesson.id));
                    if (!nextLesson || !isNextUnlocked) return null;
                    return (
                      <button
                        onClick={() => setActiveLesson(nextLesson)}
                        className="inline-flex items-center gap-1 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3 py-2 rounded-lg shadow-xs cursor-pointer transition-all"
                      >
                        <span>Next</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    );
                  })()}
                </div>
              </div>
            )}

            {/* Course Title & Meta */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 shadow-sm">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-md text-xs font-bold tracking-wide uppercase">
                  {course.category || "Uncategorized"}
                </span>
                <span className="bg-brand-50 text-brand-600 px-2.5 py-1 rounded-md text-xs font-bold tracking-wide uppercase">
                  {course.level || "All Levels"}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 mb-3 sm:mb-4">
                {course.title}
              </h1>

              <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm text-slate-600 pb-4 sm:pb-6 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
                  <span className="font-semibold text-slate-800">
                    {(course.averageRating || 0).toFixed(1)}
                  </span>
                  <span>({course.ratingCount || 0} reviews)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-slate-400" />
                  <span>{course.enrollmentCount || 0} Enrolled</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-slate-400" />
                  <span>{course.totalDuration || "TBD"}</span>
                </div>
              </div>

              <div className="pt-6">
                <h3 className="text-lg font-bold text-slate-800 mb-3">About this course</h3>
                <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                  {course.description}
                </p>
              </div>

              {/* Supporting Documents (Visible only to enrolled students / admins) */}
              {canAccessCourse && activeLesson?.documents && activeLesson.documents.length > 0 && (
                <div className="pt-8 mt-8 border-t border-slate-100">
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-brand-600" />
                    Supporting Documents for {activeLesson.title}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                    {activeLesson.documents.map((doc: any) => (
                      <button
                        key={doc.id}
                        onClick={() => handleDocumentClick(doc)}
                        className="flex items-center gap-3 p-4 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-brand-300 transition-all text-left cursor-pointer group"
                      >
                        {doc.fileType === "application/pdf" ? (
                          <svg
                            className="w-10 h-10 text-red-500 shrink-0"
                            viewBox="0 0 384 512"
                            fill="currentColor"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M181.9 256.1c-5-16-4.9-46.9-2-46.9 8.4 0 7.6 36.9 2 46.9zm-1.7 47.2c-7.7 20.2-17.3 43.3-28.4 62.7 18.3-7 39-17.2 62.9-21.9-12.7-9.6-24.9-23.4-34.5-40.8zM86.1 428.1c0 .8 13.2-5.4 34.9-40.2-6.7 6.3-29.1 24.5-34.9 40.2zM248 160h136v328c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V24C0 10.7 10.7 0 24 0h200v136c0 13.2 10.8 24 24 24zm-8 171.8c-20-12.2-33.3-29-42.7-53.8 4.5-18.5 11.6-46.6 6.2-64.2-4.7-29.4-42.4-26.5-47.8-6.8-5 18.3-.4 44.1 8.1 77-11.6 27.6-28.7 64.6-40.8 85.8-.1 0-.1.1-.2.1-27.1 13.9-73.6 44.5-54.5 68 5.6 6.9 16 10 21.5 10 17.9 0 35.7-18 61.1-61.8 25.8-8.5 54.1-19.1 79-23.2 21.7 11.8 47.1 19.5 64 19.5 29.2 0 31.2-32 19.7-43.4-13.9-13.6-54.3-9.7-73.6-7.2zM377 105L279 7c-4.5-4.5-10.6-7-17-7h-6v128h128v-6.1c0-6.3-2.5-12.4-7-16.9zm-74.1 255.3c4.1-2.7-2.5-11.9-42.8-9 37.1 15.8 42.8 9 42.8 9z" />
                          </svg>
                        ) : (
                          <Download className="w-10 h-10 text-slate-500 shrink-0" />
                        )}
                        <div className="flex-1 truncate">
                          <h4 className="font-semibold text-slate-800 text-sm truncate">
                            {doc.title}
                          </h4>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {doc.fileType === "application/pdf" ? "Secure View" : "Download"}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Course Overview / What You'll Learn */}
              <div className="pt-8 mt-8 border-t border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-4">What You'll Learn</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {course.learningObjectives && course.learningObjectives.length > 0 ? (
                    course.learningObjectives.map((item: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-600 leading-relaxed">{item}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-slate-500 italic col-span-2">
                      No learning objectives specified for this course.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar: Lessons List & Purchase Info */}
          <div className="space-y-6">
            {/* Action Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="text-3xl font-bold text-emerald-600">₹{course.price || 0}</div>
                {course.originalPrice && course.originalPrice > course.price && (
                  <>
                    <div className="text-lg text-slate-400 line-through">₹{course.originalPrice}</div>
                    <div className="bg-rose-50 text-rose-800 text-xs font-bold px-2.5 py-1 rounded-md">
                      {Math.round(
                        ((course.originalPrice - course.price) / course.originalPrice) * 100
                      )}
                      % OFF
                    </div>
                  </>
                )}
              </div>
              <button
                onClick={handleEnrollClick}
                className={`flex items-center justify-center gap-2 w-full font-bold py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer ${
                  isEnrolled
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                    : "bg-brand-600 hover:bg-brand-700 text-white"
                }`}
              >
                {isEnrolled ? (
                  <>
                    Enrolled • Continue Learning <PlayCircle className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    Enroll Now <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              <div className="mt-6 space-y-3">
                <p className="text-sm font-bold text-slate-800">This course includes:</p>
                <ul className="text-sm text-slate-600 space-y-3">
                  <li className="flex items-center gap-3">
                    <PlayCircle className="h-4 w-4 text-brand-500" /> {course.totalDuration || "TBD"} on-demand video
                  </li>
                  <li className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-brand-500" /> Full lifetime access
                  </li>
                  <li className="flex items-center gap-3">
                    <Award className="h-4 w-4 text-brand-500" /> Certificate upon 100% completion
                  </li>
                  <li className="flex items-center gap-3">
                    <Users className="h-4 w-4 text-brand-500" /> Community discussions
                  </li>
                </ul>
              </div>

              <p className="text-xs text-center text-slate-500 mt-6 pt-4 border-t border-slate-100">
                30-Day Money-Back Guarantee
              </p>
            </div>

            {/* Course Certificate Access Card (For Enrolled Students) */}
            {canAccessCourse && (
              <div
                className={`rounded-xl border p-4.5 shadow-xs transition-all ${
                  progress?.isCompleted
                    ? "bg-gradient-to-br from-amber-50 to-emerald-50 border-amber-300"
                    : "bg-white border-slate-200"
                }`}
              >
                <div className="flex items-start gap-3">
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                        Course Certificate
                      </h4>
                      {progress?.isCompleted ? (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                          Unlocked
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Lock className="w-2.5 h-2.5" /> Locked
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                      {progress?.isCompleted
                        ? "You have completed all lessons! Your official verified certificate is ready to view."
                        : `Complete all ${sortedLessons.length} lessons in sequence to unlock your certificate.`}
                    </p>
                    <div className="mt-2.5">
                      {progress?.isCompleted ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={handleViewCertificate}
                            className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" /> View Certificate
                          </button>
                          <button
                            onClick={() => setIsFeedbackModalOpen(true)}
                            className="bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 font-semibold text-xs px-2.5 py-2 rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer"
                            title="Rate & Leave Feedback"
                          >
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                          </button>
                        </div>
                      ) : (
                        <button
                          disabled
                          className="w-full bg-slate-100 text-slate-400 border border-slate-200 text-xs font-semibold py-2 rounded-lg cursor-not-allowed opacity-80 flex items-center justify-center gap-1.5"
                        >
                          <Lock className="w-3.5 h-3.5" /> Locked ({progress?.progressPercentage || 0}% Done)
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Course Content / Curriculum Sidebar */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex flex-col max-h-[500px] lg:max-h-none lg:h-[calc(100vh-18rem)] lg:sticky lg:top-24">
              <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50 shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-brand-500 shrink-0"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <polygon points="5,3 19,12 5,21" />
                    </svg>
                    <h3 className="font-bold text-slate-800 text-sm">Course Syllabus</h3>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">
                    {canAccessCourse && progress
                      ? `${progress.completedLessonIds.length}/${sortedLessons.length} Done`
                      : `${sortedLessons.length} lessons`}
                  </span>
                </div>

                {canAccessCourse && progress && (
                  <div className="mt-2.5">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium mb-1">
                      <span>Sequential Progress</span>
                      <span className="font-bold text-emerald-600">
                        {progress.progressPercentage}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-200/70 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${progress.progressPercentage}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="overflow-y-auto flex-1 p-2">
                {sortedLessons.length === 0 ? (
                  <div className="p-4 text-center text-slate-500 text-sm">
                    No lessons available yet.
                  </div>
                ) : (
                  sortedLessons.map((lesson: any, index: number) => {
                    const isLessonCompleted =
                      canAccessCourse && progress?.completedLessonIds?.includes(lesson.id);
                    const isLessonUnlocked = !canAccessCourse
                      ? false
                      : isAdminOrInstructor
                      ? true
                      : progress
                      ? progress.unlockedLessonIds?.includes(lesson.id)
                      : index === 0;
                    const isLocked = canAccessCourse && !isLessonUnlocked;
                    const isActive = canAccessCourse && activeLesson?.id === lesson.id;

                    return (
                      <button
                        key={lesson.id}
                        onClick={() => handleLessonClick(lesson)}
                        disabled={isLocked}
                        className={`w-full text-left p-3 rounded-lg transition-all flex items-start gap-3 mb-1.5 ${
                          isActive
                            ? "bg-brand-50 border border-brand-200 shadow-xs cursor-pointer"
                            : isLocked
                            ? "bg-slate-50/60 border border-transparent opacity-60 cursor-not-allowed"
                            : isLessonCompleted
                            ? "bg-emerald-50/40 hover:bg-emerald-50/80 border border-transparent cursor-pointer"
                            : "hover:bg-slate-50 border border-transparent cursor-pointer"
                        }`}
                      >
                        <div
                          className={`mt-0.5 shrink-0 h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                            isLessonCompleted
                              ? "bg-emerald-600 text-white shadow-xs"
                              : isActive
                              ? "bg-brand-600 text-white shadow-xs"
                              : isLocked
                              ? "bg-slate-200 text-slate-400"
                              : "bg-slate-200 text-slate-600"
                          }`}
                        >
                          {isLessonCompleted ? (
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          ) : isLocked ? (
                            <Lock className="h-3 w-3" />
                          ) : (
                            index + 1
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div
                            className={`text-xs sm:text-sm font-semibold truncate ${
                              isActive
                                ? "text-brand-800"
                                : isLessonCompleted
                                ? "text-slate-800"
                                : isLocked
                                ? "text-slate-400"
                                : "text-slate-700"
                            }`}
                          >
                            {lesson.title}
                          </div>

                          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5">
                            <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>{lesson.duration || "Video"}</span>

                            {isLessonCompleted ? (
                              <span className="ml-auto text-[9px] uppercase font-bold tracking-wider text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                                <CheckCircle2 className="w-2.5 h-2.5" /> Done
                              </span>
                            ) : isLocked ? (
                              <span className="ml-auto text-[9px] uppercase font-bold tracking-wider text-slate-500 bg-slate-200 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                                <Lock className="w-2.5 h-2.5" /> Locked
                              </span>
                            ) : isActive ? (
                              <span className="ml-auto text-[9px] uppercase font-bold tracking-wider text-brand-700 bg-brand-100 px-1.5 py-0.5 rounded-full">
                                Playing
                              </span>
                            ) : (
                              <span className="ml-auto text-[9px] uppercase font-bold tracking-wider text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded-full">
                                Ready
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Recommended for you Section */}
        <div className="mt-12 sm:mt-16 md:mt-20 border-t border-slate-200 pt-8 sm:pt-12 md:pt-16 mb-8">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Recommended for you</h2>
            <Link
              href="/courses"
              className="text-brand-500 font-semibold text-xs sm:text-sm hover:text-brand-600"
            >
              See all
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 relative cursor-pointer">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex flex-col hover:shadow-md transition-shadow"
              >
                <div className="relative h-40 w-full rounded-xl overflow-hidden mb-4">
                  <img src="/Home/College.webp" alt="Course" className="object-cover w-full h-full" />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-3 px-1">
                  <div className="flex items-center gap-1.5">
                    <LayoutGrid className="w-4 h-4 text-slate-300" />
                    Design
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-slate-300" />
                    3 Month
                  </div>
                </div>

                <h3 className="font-bold text-slate-900 mb-2 px-1 text-[15px] leading-tight">
                  AWS Certified solutions Architect
                </h3>

                <p className="text-slate-500 text-xs leading-relaxed mb-6 px-1 line-clamp-3 flex-1">
                  Comprehensive training in cloud architecture, DevOps, and deployment workflows.
                </p>

                <div className="flex items-center justify-between px-1 pt-4 border-t border-slate-50 mt-auto">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full overflow-hidden relative">
                      <img
                        src="/Home/hari-crop.jpeg"
                        alt="Instructor"
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <span className="text-xs font-bold text-slate-700">Hrishikesh</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 line-through">₹10,000</span>
                    <span className="font-bold text-brand-500 text-sm">₹8,000</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Carousel Arrows */}
          <div className="flex justify-end gap-2 mt-8">
            <button className="w-8 h-8 rounded bg-brand-400/40 hover:bg-brand-400 text-white flex items-center justify-center transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="w-8 h-8 rounded bg-brand-400 hover:bg-brand-500 text-white flex items-center justify-center transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <AiAssistant courseId={id} activeLessonId={activeLesson?.id} />

      {viewerUrl && (
        <SecureDocumentViewer
          url={viewerUrl}
          title={viewerTitle}
          onClose={() => setViewerUrl(null)}
        />
      )}

      {certificateData && isCertificateModalOpen && (
        <CertificateModal
          certificate={certificateData}
          onClose={() => setIsCertificateModalOpen(false)}
        />
      )}

      {course && isFeedbackModalOpen && (
        <CertificateFeedbackModal
          isOpen={isFeedbackModalOpen}
          onClose={() => setIsFeedbackModalOpen(false)}
          data={{
            courseTitle: course.title,
            courseId: course.id,
            certificateId: certificateData?.id || `course_${course.id}`,
            certificateNumber: certificateData?.certificateNumber || "ASVA-COMPLETED",
          }}
        />
      )}
    </div>
  );
}
