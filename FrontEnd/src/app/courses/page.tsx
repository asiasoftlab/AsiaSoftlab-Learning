"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import { Clock, ArrowUpRight, Star, Loader2, Search, X, BookOpen, Sparkles } from "lucide-react";
import { api } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { useSearchParams } from "next/navigation";

function CoursesContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (categoryParam) {
      // Map URL slug to display category if needed
      const slugMap: Record<string, string> = {
        "drone-survey": "Drone Survey & Mapping",
        "agriculture": "Agriculture Drones",
        "rov": "Underwater ROV",
        "regulatory": "Regulatory Training",
      };
      setSelectedCategory(slugMap[categoryParam] || categoryParam);
    }
  }, [categoryParam]);

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

  // Derive unique categories from available courses
  const categories = useMemo(() => {
    const set = new Set<string>();
    courses.forEach((c) => {
      if (c.category && typeof c.category === "string" && c.category.trim()) {
        set.add(c.category.trim());
      }
    });
    return ["All", ...Array.from(set)];
  }, [courses]);

  // Filter courses based on search query and category
  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesCategory =
        selectedCategory === "All" ||
        (course.category && course.category.toLowerCase().includes(selectedCategory.toLowerCase())) ||
        (selectedCategory.toLowerCase().includes(course.category?.toLowerCase() || ""));

      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        course.title?.toLowerCase().includes(query) ||
        course.description?.toLowerCase().includes(query) ||
        course.category?.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [courses, selectedCategory, searchQuery]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 bg-slate-50">
        <Loader2 className="h-9 w-9 animate-spin text-brand-600 mb-3" />
        <p className="text-slate-500 text-sm font-medium animate-pulse">Loading course catalog...</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-8 sm:py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 text-brand-700 text-xs font-semibold mb-3">
           
            <span>Industry-Standard Curriculum</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 mb-2 sm:mb-4">
            Professional Courses
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-slate-600 max-w-2xl mx-auto px-2 leading-relaxed">
            Master practical drone piloting, GIS mapping, precision surveying, and next-gen engineering from certified industry experts.
          </p>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="mb-6 sm:mb-10 space-y-4">
          
          {/* Search Bar */}
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search courses, skills, or topics..."
              className="w-full pl-10 sm:pl-11 pr-10 py-2.5 sm:py-3 rounded-lg sm:rounded-full bg-white border border-slate-200 text-slate-800 text-xs sm:text-sm placeholder:text-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Category Filter Pills (Touch scrollable on mobile) */}
          {categories.length > 1 && (
            <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto py-1 px-1 -mx-4 sm:mx-0 px-4 sm:px-0 scrollbar-none scroll-smooth">
              {categories.map((cat) => {
                const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`whitespace-nowrap px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                      isSelected
                        ? "bg-brand-600 text-white shadow-sm shadow-brand-500/25 ring-2 ring-brand-600/30"
                        : "bg-white text-slate-600 border border-slate-200 hover:border-brand-300 hover:text-brand-600 hover:bg-slate-50"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Results Counter / Active Filters Indicator */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-4 sm:mb-6 px-1">
          <div>
            Showing <span className="font-bold text-slate-800">{filteredCourses.length}</span> course{filteredCourses.length !== 1 ? "s" : ""}
            {selectedCategory !== "All" && (
              <span> in <span className="text-brand-600 font-semibold">{selectedCategory}</span></span>
            )}
          </div>
          {(selectedCategory !== "All" || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSearchQuery("");
              }}
              className="text-brand-600 font-semibold hover:underline text-xs"
            >
              Reset filters
            </button>
          )}
        </div>

        {/* Courses Grid */}
        {filteredCourses.length === 0 ? (
          <div className="text-center py-12 sm:py-16 md:py-20 bg-white rounded-2xl border border-slate-200/80 shadow-sm px-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <BookOpen className="h-6 w-6 text-slate-400" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-800">No Courses Found</h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-sm mx-auto">
              We couldn't find any courses matching your search criteria. Try using different keywords or resetting filters.
            </p>
            {(searchQuery || selectedCategory !== "All") && (
              <button
                onClick={() => {
                  setSelectedCategory("All");
                  setSearchQuery("");
                }}
                className="mt-4 px-4 py-2 rounded-lg bg-brand-50 text-brand-600 hover:bg-brand-100 text-xs sm:text-sm font-semibold transition-colors"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-7">
            {filteredCourses.map((course, idx) => {
              // Calculate dynamic total duration from lessons
              let totalMins = 0;
              if (course.lessons && Array.isArray(course.lessons)) {
                course.lessons.forEach((l: any) => {
                  const match = l.duration?.match(/(\d+)/g);
                  if (match && match.length > 0) {
                    if (match.length >= 2) {
                      totalMins += parseInt(match[0]) * 60 + parseInt(match[1]);
                    } else {
                      totalMins += parseInt(match[0]);
                    }
                  }
                });
              }
              const displayDuration =
                totalMins > 0
                  ? `${Math.floor(totalMins / 60).toString().padStart(2, "0")}h ${(totalMins % 60).toString().padStart(2, "0")}m`
                  : course.totalDuration || "Self-Paced";

              return (
                <Link
                  href={`/courses/${course.id}`}
                  key={course.id || idx}
                  className="group bg-white border border-slate-200/90 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-xl sm:hover:-translate-y-1.5 hover:border-brand-200 transition-all duration-300 p-3 sm:p-4 flex flex-col cursor-pointer relative"
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-[16/10] w-full sm:rounded-md bg-slate-900 mb-3 sm:mb-4 overflow-hidden shrink-0">
                    {course.thumbnailUrl ? (
                      <Image
                        src={course.thumbnailUrl}
                        alt={course.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 bg-slate-800 text-xs">
                        <BookOpen className="h-7 w-7 text-slate-600 mb-1" />
                        <span>ASVA Course</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                    
                    {/* Duration badge */}
                    <div className="absolute top-2.5 right-2.5 bg-white/95 backdrop-blur px-2 sm:px-2.5 py-1 rounded-md flex items-center gap-1 text-[11px] font-semibold text-slate-700 shadow-sm z-20">
                      <Clock className="h-3 w-3 text-slate-500" />
                      <span>{displayDuration}</span>
                    </div>

                    {/* Level / Status badge */}
                    {course.level && (
                      <div className="absolute bottom-2.5 left-2.5 bg-slate-900/80 backdrop-blur px-2 py-0.5 rounded text-[10px] font-semibold text-white uppercase tracking-wider z-20">
                        {course.level}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-1">
                    {course.category && (
                      <div className="text-brand-600 font-bold text-[11px] mb-1.5 tracking-wide uppercase truncate">
                        {course.category}
                      </div>
                    )}

                    <div className="flex items-start justify-between mb-1.5 gap-2">
                      <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-brand-600 transition-colors duration-200 line-clamp-2 leading-snug">
                        {course.title}
                      </h3>
                      <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-600 transition-all duration-200 shrink-0 mt-0.5" />
                    </div>

                    <p className="text-slate-500 text-xs sm:text-xs mb-3.5 line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>

                    {/* Rating row */}
                    <div className="flex items-center gap-1 text-xs text-slate-500 mb-3.5 font-medium mt-auto">
                      <span className="text-amber-500 font-bold text-xs sm:text-sm">
                        {(course.averageRating || 0).toFixed(1)}
                      </span>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-3 w-3 ${
                              star <= Math.floor(course.averageRating || 0)
                                ? "text-amber-400 fill-amber-400"
                                : "text-slate-200 fill-slate-200"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="ml-1 text-[11px] text-slate-400">
                        ({course.ratingCount || 0})
                      </span>
                    </div>

                    {/* Footer / Instructor & Pricing */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-700 font-bold text-[10px] sm:text-xs uppercase shrink-0">
                          {course.instructorId ? course.instructorId.substring(0, 2) : "AS"}
                        </div>
                        <div className="min-w-0 truncate">
                          <div className="text-[11px] sm:text-xs font-semibold text-slate-900 truncate">
                            {course.instructorName || "ASVA Faculty"}
                          </div>
                          <div className="text-[10px] text-slate-400 truncate">
                            {course.enrollmentCount || 0} enrolled
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end shrink-0">
                        <div className="font-extrabold text-sm sm:text-base text-emerald-600">
                          {course.price === 0 || course.price === "0" ? (
                            <span className="text-emerald-600 font-bold">Free</span>
                          ) : (
                            `₹${course.price || 0}`
                          )}
                        </div>
                        {course.originalPrice && course.originalPrice > course.price && (
                          <div className="text-[10px] font-medium text-slate-400 line-through -mt-0.5">
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

export default function CoursesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 bg-slate-50">
          <Loader2 className="h-9 w-9 animate-spin text-brand-600 mb-3" />
          <p className="text-slate-500 text-sm font-medium">Loading courses...</p>
        </div>
      }
    >
      <CoursesContent />
    </Suspense>
  );
}
