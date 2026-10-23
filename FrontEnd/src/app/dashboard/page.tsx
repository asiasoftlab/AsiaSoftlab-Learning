"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { SummaryCard } from "@/components/dashboard/SummaryCard";
import { ActiveCourseCard } from "@/components/dashboard/ActiveCourseCard";
import { ProgressRing } from "@/components/dashboard/ProgressRing";
import { Card } from "@/components/ui/card";
import { ChevronRight, ClipboardList, PlayCircle, Star, Sparkles } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const [activeCourses, setActiveCourses] = useState<any[]>([]);
  const recentPerformance: any[] = [];
  const upcomingDeadlines: any[] = [];
  const [availableCourses, setAvailableCourses] = useState<number | string>("...");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/courses');
        setAvailableCourses(response.data?.length || 0);

        const enrollmentsResponse = await api.get('/payments/my-enrollments');
        const enrollments = enrollmentsResponse.data || [];
        
        const mappedCourses = enrollments.map((e: any, index: number) => {
          const colors: ("teal" | "blue" | "purple" | "orange")[] = ['teal', 'blue', 'purple', 'orange'];
          return {
            courseId: e.courseId,
            title: e.courseTitle || 'Enrolled Course',
            thumbnailUrl: e.courseThumbnailUrl,
            lastLesson: 'Getting Started',
            progress: 0,
            colorScheme: colors[index % colors.length]
          };
        });
        
        setActiveCourses(mappedCourses);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        setAvailableCourses("-");
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <div className="flex flex-col gap-4 sm:gap-6 pb-6 w-full">
      {/* Summary Cards Section */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 w-full">
        <SummaryCard
          title="Courses Enrolled"
          value={activeCourses.length.toString()}
        />
        <SummaryCard
          title="Hours Learned"
          value="0"
        />
        <SummaryCard
          title="Certificates Earned"
          value="0"
          actionText="View all"
          actionHref="/dashboard/certificates"
        />
        <SummaryCard
          title="Available Courses"
          value={availableCourses.toString()}
          actionText="View all"
          actionHref="/dashboard/courses"
        />
        <SummaryCard
          title="Complete your profile"
          value=""
          actionText="Update Profile"
          actionHref="/dashboard/profile"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5 sm:gap-5 w-full">
        {/* Main Left Column (2/3 width on large screens) */}
        <div className="lg:col-span-2 flex flex-col gap-4 sm:gap-5 min-w-0">

          {/* Active Courses */}
          <section>
            <div className="flex items-center justify-between mb-2.5">
              <h2 className="text-xs sm:text-sm md:text-base font-bold text-slate-900 flex items-center gap-1.5">
                <BellIcon className="h-4 w-4 text-slate-500" /> Active Courses
              </h2>
              <Link href="/dashboard/courses" className="text-[11px] sm:text-xs font-semibold text-brand-600 hover:text-brand-700">
                View All
              </Link>
            </div>

            {activeCourses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3.5">
                {activeCourses.map((course, idx) => (
                  <ActiveCourseCard
                    key={idx} 
                    courseId={course.courseId}
                    title={course.title} 
                    lastLesson={course.lastLesson} 
                    progress={course.progress} 
                    thumbnailUrl={course.thumbnailUrl} 
                    colorScheme={course.colorScheme} 
                  />
                ))}
              </div>
            ) : (
              <Card className="p-4 sm:p-6 text-center border-dashed border border-slate-200/90 shadow-none bg-slate-50/60 rounded-xl">
                <p className="text-slate-500 text-xs sm:text-sm mb-2.5 font-medium">You don't have any active courses yet.</p>
                <Link href="/courses" className="text-xs font-semibold text-brand-600 hover:text-brand-700 hover:underline">
                  Browse Courses
                </Link>
              </Card>
            )}
          </section>

          {/* Recent Performance */}
          <section>
            <div className="flex items-center justify-between mb-2.5">
              <h2 className="text-xs sm:text-sm md:text-base font-bold text-slate-900 flex items-center gap-1.5">
                <BarChartIcon className="h-4 w-4 text-slate-500" /> Recent Performance
              </h2>
              <Link href="/dashboard/performance" className="text-[11px] sm:text-xs font-semibold text-brand-600 hover:text-brand-700">
                View All
              </Link>
            </div>
            <Card className="border-slate-200/90 shadow-xs overflow-hidden rounded-xl">
              {recentPerformance.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200/80 bg-slate-50/60">
                        <th className="py-2.5 px-3 text-[11px] sm:text-xs font-semibold text-slate-500">Assessment</th>
                        <th className="py-2.5 px-3 text-[11px] sm:text-xs font-semibold text-slate-500 hidden sm:table-cell">Course</th>
                        <th className="py-2.5 px-3 text-[11px] sm:text-xs font-semibold text-slate-500">Score</th>
                        <th className="py-2.5 px-3 text-[11px] sm:text-xs font-semibold text-slate-500">Feedback</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {recentPerformance.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-2.5 px-3 font-medium text-slate-900">{item.title}</td>
                          <td className="py-2.5 px-3 text-slate-500 hidden sm:table-cell">{item.course}</td>
                          <td className="py-2.5 px-3 font-bold text-slate-900">{item.score}%</td>
                          <td className="py-2.5 px-3 text-slate-600">{item.feedback}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-4 sm:p-6 text-center text-xs text-slate-500 font-medium">
                  No recent performance data available.
                </div>
              )}
            </Card>
          </section>

          {/* Recommended Courses */}
          <section>
            <div className="flex items-center justify-between mb-2.5">
              <h2 className="text-xs sm:text-sm md:text-base font-bold text-slate-900 flex items-center gap-1.5">
                <ChartIcon className="h-4 w-4 text-slate-500" /> Recommended Courses
              </h2>
              <Link href="/courses" className="text-[11px] sm:text-xs font-semibold text-brand-600 hover:text-brand-700">
                Explore
              </Link>
            </div>
            <Card className="border-slate-200/90 shadow-xs flex flex-col items-center rounded-xl">
              <div className="p-4 sm:p-6 text-center text-xs text-slate-500 font-medium">
                No recommended courses data available right now.
              </div>
            </Card>
          </section>
        </div>

        {/* Right Sidebar Column (1/3 width on large screens) */}
        <div className="flex flex-col gap-4 sm:gap-5 min-w-0">

          {/* Upcoming Deadlines */}
          <section>
            <div className="flex items-center justify-between mb-2.5">
              <h2 className="text-xs sm:text-sm md:text-base font-bold text-slate-900 flex items-center gap-1.5">
                <CalendarIcon className="h-4 w-4 text-slate-500" /> Deadlines
              </h2>
              <Link href="/dashboard/calendar" className="text-[11px] sm:text-xs font-semibold text-brand-600 hover:text-brand-700">
                View All
              </Link>
            </div>
            <Card className="border-slate-200/90 shadow-xs p-3 sm:p-3.5 flex flex-col gap-2 rounded-xl">
              {upcomingDeadlines.length > 0 ? (
                upcomingDeadlines.map((deadline, idx) => (
                  <div key={idx} className="flex gap-2.5 p-2 rounded-lg hover:bg-slate-50 transition-colors items-center">
                    <div className="h-7 w-7 rounded-md bg-slate-100 flex items-center justify-center shrink-0">
                      <ClipboardList className="h-3.5 w-3.5 text-slate-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-slate-900 text-xs truncate">{deadline.title}</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">{deadline.date}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-slate-500 text-xs font-medium">
                  No upcoming deadlines. You're all caught up!
                </div>
              )}
            </Card>
          </section>

          {/* Learning Progress */}
          <section>
            <div className="flex items-center justify-between mb-2.5">
              <h2 className="text-xs sm:text-sm md:text-base font-bold text-slate-900 flex items-center gap-1.5">
                <ChartIcon className="h-4 w-4 text-slate-500" /> Your Progress
              </h2>
            </div>
            <Card className="border-slate-200/90 shadow-xs p-3.5 sm:p-4.5 flex flex-col items-center rounded-xl">
              <ProgressRing
                progress={0}
                completedPercent={0}
                inProgressPercent={0}
                notStartedPercent={100}
                size={110}
                strokeWidth={9}
              />

              <div className="w-full mt-4 flex flex-col gap-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-indigo-600"></span>
                    <span className="text-slate-600 text-[11px] sm:text-xs">Completed</span>
                  </div>
                  <span className="font-bold text-slate-900 text-[11px] sm:text-xs">0%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-sky-500"></span>
                    <span className="text-slate-600 text-[11px] sm:text-xs">In progress</span>
                  </div>
                  <span className="font-bold text-slate-900 text-[11px] sm:text-xs">0%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-teal-400"></span>
                    <span className="text-slate-600 text-[11px] sm:text-xs">Not Started</span>
                  </div>
                  <span className="font-bold text-slate-900 text-[11px] sm:text-xs">100%</span>
                </div>
              </div>

              <p className="text-[10px] text-slate-400 text-center mt-3 font-medium">
                Start your first course to track progress!
              </p>
            </Card>
          </section>
          
        </div>
      </div>
    </div>
  );
}

// Simple Icon wrappers
function BellIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
  );
}

function BarChartIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="18" x2="18" y1="20" y2="10" /><line x1="12" x2="12" y1="20" y2="4" /><line x1="6" x2="6" y1="20" y2="14" /></svg>
  );
}

function CalendarIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /><path d="M8 14h.01" /><path d="M12 14h.01" /><path d="M16 14h.01" /><path d="M8 18h.01" /><path d="M12 18h.01" /><path d="M16 18h.01" /></svg>
  );
}

function ChartIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" /></svg>
  );
}
