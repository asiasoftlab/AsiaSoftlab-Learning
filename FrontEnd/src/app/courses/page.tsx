"use client";

import { useEffect, useState } from "react";
import { Clock, ArrowUpRight, Star, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";

export default function CoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await api.get("/courses");
      // Filter out Drafts/Unpublished on frontend just in case backend sends all
      const published = response.data.filter((c: any) => c.status === "Published");
      setCourses(published);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
      toast.error("Failed to load course catalog.");
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

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">Courses</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">Explore our comprehensive catalog of courses taught by industry experts.</p>
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="text-xl font-semibold text-slate-800">No Courses Available</h3>
            <p className="text-slate-500 mt-2">Check back later for exciting new courses!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {courses.map((course, idx) => {
              // Calculate dynamic total duration from lessons
              let totalMins = 0;
              if (course.lessons && Array.isArray(course.lessons)) {
                course.lessons.forEach((l: any) => {
                  const match = l.duration?.match(/(\d+)/g);
                  if (match && match.length > 0) {
                     // VERY simplistic parsing just for display purposes if backend didn't compute
                     if (match.length >= 2) {
                       totalMins += (parseInt(match[0]) * 60) + parseInt(match[1]);
                     } else {
                       totalMins += parseInt(match[0]);
                     }
                  }
                });
              }
              const displayDuration = totalMins > 0 
                ? `${Math.floor(totalMins / 60).toString().padStart(2, '0')} hr ${(totalMins % 60).toString().padStart(2, '0')} mins` 
                : "TBD";

              return (
                <Link href={`/courses/${course.id}`} key={idx} className="group bg-white rounded-2xl border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] overflow-hidden p-4 flex flex-col hover:shadow-2xl hover:-translate-y-2 hover:border-emerald-100 transition-all duration-300 ease-out cursor-pointer relative">
                  
                  {/* Thumbnail with slight scale animation on hover */}
                  <div className={`relative h-48 w-full rounded-xl bg-slate-100 mb-5 overflow-hidden`}>
                    {course.thumbnailUrl ? (
                      <Image src={course.thumbnailUrl} alt={course.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-500">No Image</div>
                    )}
                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-500 z-10" />
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur px-2.5 py-1.5 rounded-md flex items-center gap-1.5 text-xs font-medium text-slate-700 shadow-sm z-20 transition-transform duration-300 group-hover:scale-105">
                      <Clock className="h-3.5 w-3.5 text-slate-500" />
                      {displayDuration}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-1 relative z-20">
                    {course.category && (
                      <div className="text-emerald-500 font-semibold text-xs mb-2 tracking-wide uppercase">{course.category}</div>
                    )}

                    <div className="flex items-start justify-between mb-2 gap-2">
                      <h3 className="font-bold text-lg text-slate-900 group-hover:text-emerald-600 transition-colors duration-300 line-clamp-2">
                        {course.title}
                      </h3>
                      <ArrowUpRight className="h-5 w-5 text-slate-400 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-emerald-500 transition-all duration-300 shrink-0" />
                    </div>

                    <p className="text-slate-500 text-sm mb-5 line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>

                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-6 font-medium mt-auto">
                      <span className="text-emerald-600 font-bold text-sm">{(course.averageRating || 0).toFixed(1)}</span>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className={`h-3.5 w-3.5 ${star <= Math.floor(course.averageRating || 0) ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}`} />
                        ))}
                      </div>
                      <span className="ml-1 opacity-75">({course.ratingCount || 0})</span>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100/80">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-xs uppercase overflow-hidden">
                          {course.instructorId ? course.instructorId.substring(0, 2) : "IN"}
                        </div>
                        <div>
                          <div className="font-semibold text-xs text-slate-900">Instructor</div>
                          <div className="text-[11px] text-slate-500">{course.enrollmentCount || 0} Enrolled</div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end group-hover:scale-110 transition-transform origin-right duration-300">
                        <div className="font-bold text-xl text-emerald-500">
                          ₹{course.price || 0}
                        </div>
                        {course.originalPrice && (
                          <div className="text-xs font-semibold text-slate-400 line-through -mt-1">
                            ₹{course.originalPrice}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

