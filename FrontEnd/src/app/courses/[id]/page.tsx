"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import AiAssistant from "@/components/chat/AiAssistant";
import { Loader2, PlayCircle, Clock, Users, Star, ArrowLeft, Lock, LayoutGrid, ChevronLeft, ChevronRight, CheckCircle2, BookOpen, Layers } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/auth.store";

export default function CourseDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeLesson, setActiveLesson] = useState<any>(null);

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      const response = await api.get(`/courses/${id}`);
      setCourse(response.data);
      if (response.data.lessons && response.data.lessons.length > 0) {
        // Sort by order and set active
        const sorted = [...response.data.lessons].sort((a, b) => a.order - b.order);
        setActiveLesson(sorted[0]);
      }
    } catch (error) {
      console.error("Failed to fetch course details:", error);
      toast.error("Failed to load course details.");
    } finally {
      setLoading(false);
    }
  };

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
        <Link href="/courses" className="text-brand-600 hover:underline mt-4">Return to Courses</Link>
      </div>
    );
  }

  const sortedLessons = course.lessons ? [...course.lessons].sort((a, b) => a.order - b.order) : [];

  const handleEnrollClick = () => {
    if (!isAuthenticated) {
      toast.error("Please log in to enroll in this course");
      router.push("/login");
      return;
    }
    toast.success("Enrollment process initiated!");
  };

  const handleLessonClick = (lesson: any) => {
    if (!isAuthenticated) {
      toast.error("Please log in to view lessons");
      router.push("/login");
      return;
    }
    setActiveLesson(lesson);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="container mx-auto px-4 md:px-6">
        
        <Link href="/courses" className="inline-flex items-center gap-2 text-slate-500 hover:text-brand-600 transition-colors mb-6 font-medium text-sm">
          <ArrowLeft className="h-4 w-4" /> Back to Courses
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Area: Video Player & Description */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Video Player */}
            <div className="bg-black rounded-2xl overflow-hidden shadow-xl aspect-video relative">
              {!isAuthenticated ? (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-900 p-6 text-center">
                  <Lock className="h-12 w-12 mb-4 opacity-50" />
                  <p className="mb-6">Please log in to access this course content.</p>
                  <button onClick={() => router.push("/login")} className="bg-brand-600 hover:bg-brand-700 text-white px-8 py-3 rounded-lg font-bold transition-colors shadow-lg cursor-pointer">
                    Log in to Watch
                  </button>
                </div>
              ) : activeLesson && activeLesson.youtubeVideoId ? (
                <div className="relative w-full h-full bg-black group">
                  <iframe 
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${activeLesson.youtubeVideoId}?autoplay=0&rel=0&modestbranding=1&iv_load_policy=3&showinfo=0&controls=1&disablekb=1&fs=0`}
                    title={activeLesson.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    sandbox="allow-scripts allow-same-origin allow-presentation"
                  />
                  
                  {/* Block entire top area (Title, Share, Watch Later) */}
                  <div className="absolute top-0 left-0 w-full h-24 z-10 bg-transparent"></div>
                  
                  {/* Block right edge (More videos, extra buttons) */}
                  <div className="absolute top-0 right-0 w-24 h-full z-10 bg-transparent"></div>
                  
                  {/* Block bottom right (Watch on YouTube logo) - leaves room for volume/settings */}
                  <div className="absolute bottom-10 right-0 w-32 h-20 z-10 bg-transparent"></div>
                  
                  {/* Block bottom left just above controls (Sometimes Share appears here) */}
                  <div className="absolute bottom-10 left-0 w-48 h-20 z-10 bg-transparent"></div>
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-500">
                  <PlayCircle className="h-16 w-16 mb-4 opacity-50" />
                  <p>No video available for this lesson.</p>
                </div>
              )}
            </div>

            {/* Course Title & Meta */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-md text-xs font-bold tracking-wide uppercase">
                  {course.category || "Uncategorized"}
                </span>
                <span className="bg-brand-50 text-brand-600 px-2.5 py-1 rounded-md text-xs font-bold tracking-wide uppercase">
                  {course.level || "All Levels"}
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">{course.title}</h1>
              
              <div className="flex flex-wrap items-center gap-6 text-sm text-slate-600 pb-6 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
                  <span className="font-semibold text-slate-800">{(course.averageRating || 0).toFixed(1)}</span>
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
                <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{course.description}</p>
              </div>

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
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="text-3xl font-bold text-emerald-600">₹{course.price || 0}</div>
                {course.originalPrice && course.originalPrice > course.price && (
                  <>
                    <div className="text-lg text-slate-400 line-through">₹{course.originalPrice}</div>
                    <div className="bg-rose-50 text-rose-800 text-xs font-bold px-2.5 py-1 rounded-md">
                      {Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)}% OFF
                    </div>
                  </>
                )}
              </div>
              <button onClick={handleEnrollClick} className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all">
                Enroll Now
              </button>
              
              <div className="mt-6 space-y-3">
                <p className="text-sm font-bold text-slate-800">This course includes:</p>
                <ul className="text-sm text-slate-600 space-y-3">
                  <li className="flex items-center gap-3"><PlayCircle className="h-4 w-4 text-brand-500" /> {course.totalDuration || "TBD"} on-demand video</li>
                  <li className="flex items-center gap-3"><Clock className="h-4 w-4 text-brand-500" /> Full lifetime access</li>
                  <li className="flex items-center gap-3"><Users className="h-4 w-4 text-brand-500" /> Community discussions</li>
                </ul>
              </div>

              <p className="text-xs text-center text-slate-500 mt-6 pt-4 border-t border-slate-100">30-Day Money-Back Guarantee</p>
            </div>

            {/* Course Content / Curriculum */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex flex-col h-[calc(100vh-20rem)] sticky top-24">
              <div className="p-5 border-b border-slate-100 bg-slate-50 shrink-0">
                <h3 className="font-bold text-slate-800">Course Content</h3>
                <p className="text-xs text-slate-500 mt-1">{sortedLessons.length} lessons</p>
              </div>
              
              <div className="overflow-y-auto flex-1 p-2">
                {sortedLessons.length === 0 ? (
                  <div className="p-4 text-center text-slate-500 text-sm">No lessons available yet.</div>
                ) : (
                  sortedLessons.map((lesson: any, index: number) => (
                    <button 
                      key={lesson.id} 
                      onClick={() => handleLessonClick(lesson)}
                      className={`w-full text-left p-3 rounded-md transition-colors flex items-start gap-3 mb-1
                        ${activeLesson?.id === lesson.id 
                          ? 'bg-brand-50 border border-brand-100' 
                          : 'hover:bg-slate-50 border border-transparent'
                        }`}
                    >
                      <div className={`mt-0.5 shrink-0 h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold
                        ${activeLesson?.id === lesson.id ? 'bg-brand-600 text-white' : 'bg-slate-200 text-slate-500'}
                      `}>
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className={`text-sm font-semibold line-clamp-2 ${activeLesson?.id === lesson.id ? 'text-brand-700' : 'text-slate-700'}`}>
                          {lesson.title}
                        </div>
                        <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                          <PlayCircle className="h-3 w-3" />
                          {lesson.duration || "Video"}
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

          </div>

        </div>

        {/* Recommended for you Section */}
        <div className="mt-20 border-t border-slate-200 pt-16 mb-10">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-bold text-slate-900">Recommended for you</h2>
            <Link href="/courses" className="text-brand-500 font-semibold text-sm hover:text-brand-600">
              See all
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex flex-col hover:shadow-md transition-shadow">
                <div className="relative h-40 w-full rounded-xl overflow-hidden mb-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
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
                  fgjadfjgbk ghjdhghsdh lkdhglksdhgkh hsgshdkghs hsdgklhds sdlhglsdhglkhlsdhgkl klsdhgdksh hgklshdklghlksdglhks
                </p>

                <div className="flex items-center justify-between px-1 pt-4 border-t border-slate-50 mt-auto">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full overflow-hidden relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/Home/hari-crop.jpeg" alt="Lina" className="object-cover w-full h-full" />
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
    </div>
  );
}
