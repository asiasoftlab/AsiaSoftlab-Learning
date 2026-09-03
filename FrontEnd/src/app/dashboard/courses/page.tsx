"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { ActiveCourseCard } from "@/components/dashboard/ActiveCourseCard";
import { BookOpen, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function MyCoursesPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get("/payments/my-enrollments");
        const enrolledItems = response.data || [];
        const mapped = enrolledItems.map((item: any) => ({
          id: item.courseId,
          title: item.course?.title || item.courseTitle,
          thumbnailUrl: item.course?.thumbnailUrl || item.courseThumbnailUrl,
          lastLesson: item.course?.lessons?.[0]?.title 
            ? `Lesson 1: ${item.course.lessons[0].title}` 
            : "Course Materials Ready",
          progress: 0,
        }));
        setCourses(mapped);
      } catch (error) {
        console.error("Failed to fetch enrolled courses:", error);
        // Fallback: empty courses list
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(c => {
    if (activeTab === "All") return true;
    if (activeTab === "In Progress") return c.progress < 100;
    if (activeTab === "Completed") return c.progress === 100;
    return true;
  });

  return (
    <div className="flex flex-col gap-8 pb-12">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
         
          My Courses
        </h1>
        <p className="text-slate-500">Pick up right where you left off and track your progress.</p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
          {["All", "In Progress", "Completed"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                activeTab === tab 
                  ? "bg-white text-slate-900 shadow-sm" 
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            className="pl-9 bg-white border-slate-200" 
            placeholder="Search my courses..."
          />
        </div> */}
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-24">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCourses.map((course, idx) => (
            <ActiveCourseCard 
              key={course.id || idx}
              courseId={course.id}
              title={course.title}
              lastLesson={course.lastLesson}
              progress={course.progress}
              thumbnailUrl={course.thumbnailUrl}
              colorScheme={idx % 2 === 0 ? "teal" : "blue"}
            />
          ))}
          {filteredCourses.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-16 text-center bg-white rounded-2xl border border-dashed border-slate-200 p-8 shadow-sm">
              <BookOpen className="h-12 w-12 text-slate-300 mb-4" />
              <h3 className="text-lg font-semibold text-slate-900">No Enrolled Courses Found</h3>
              <p className="text-slate-500 mt-1 max-w-sm mb-6 text-sm">
                You haven't enrolled in any courses yet. Discover skills and advance your career with our top-rated programs.
              </p>
              <a 
                href="/courses" 
                className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold px-6 py-2.5 rounded-xl shadow-sm transition-all"
              >
                Browse Academy Courses
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
