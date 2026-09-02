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
  // In a real application, these would be fetched from an API
  const activeCourses: any[] = [];
  const recentPerformance: any[] = [];
  const upcomingDeadlines: any[] = [];
  const [availableCourses, setAvailableCourses] = useState<number | string>("...");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get('/courses');
        setAvailableCourses(response.data?.length || 0);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
        setAvailableCourses("-");
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="flex flex-col gap-12 pb-12">
      {/* Summary Cards Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-4 w-full">
        <SummaryCard
          title="Courses Enrolled"
          value="0"
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
          actionText="Update My Profile"
          actionHref="/dashboard/profile"
        />

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Left Column (2/3 width on large screens) */}
        <div className="lg:col-span-2 flex flex-col gap-6">

          {/* Active Courses */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <BellIcon className="h-5 w-5 text-slate-500" /> Active Courses
              </h2>
              <Link href="/dashboard/courses" className="text-sm font-medium text-blue-600 hover:text-blue-700 mr-10">
                View All
              </Link>
            </div>

            {activeCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeCourses.map((course, idx) => (
                  <ActiveCourseCard
                    key={idx} title={course.title} lastLesson={course.lastLesson} progress={course.progress} thumbnailUrl={course.thumbnailUrl} colorScheme="teal" />
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center border-dashed border-2 border-slate-200 shadow-none bg-slate-50/50">
                <p className="text-slate-500 mb-4">You don't have any active courses yet.</p>
                <Link href="/courses" className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline">
                  Browse Courses
                </Link>
              </Card>
            )}
          </section>

          {/* Recent Performance */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <BarChartIcon className="h-5 w-5 text-slate-500" /> Recent Performance
              </h2>
              <Link href="/dashboard/performance" className="text-sm font-medium text-blue-600 hover:text-blue-700 mr-10">
                View All
              </Link>
            </div>
            <Card className="border-slate-200 shadow-sm overflow-hidden">
              {recentPerformance.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50/50">
                        <th className="py-4 px-6 text-sm font-semibold text-slate-500">Assessment</th>
                        <th className="py-4 px-6 text-sm font-semibold text-slate-500 hidden sm:table-cell">Course</th>
                        <th className="py-4 px-6 text-sm font-semibold text-slate-500">Score</th>
                        <th className="py-4 px-6 text-sm font-semibold text-slate-500">Feedback</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {recentPerformance.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-4 px-6 font-medium text-slate-900">{item.title}</td>
                          <td className="py-4 px-6 text-slate-500 hidden sm:table-cell">{item.course}</td>
                          <td className="py-4 px-6 font-bold text-slate-900">{item.score}%</td>
                          <td className="py-4 px-6 text-sm font-medium">{item.feedback}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 text-center text-slate-500">
                  No recent performance data available.
                </div>
              )}
            </Card>
          </section>
          {/*  Recommended Courses*/}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <ChartIcon className="h-5 w-5 text-slate-500" /> Recommended Courses
              </h2>
              <Link href="/dashboard/performance" className="text-sm font-medium text-blue-600 hover:text-blue-700 mr-10">
                View All
              </Link>
            </div>
            <Card className="border-slate-200 shadow-sm flex flex-col items-center">
              <div className="p-8 text-center text-slate-500">
                  No recommended courses data available.
                </div>
            </Card>
          </section>
        </div>

        {/* Right Sidebar Column (1/3 width on large screens) */}
        <div className="flex flex-col gap-6">

          {/* Upcoming Deadlines */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-slate-500" /> Upcoming Deadlines
              </h2>
              <Link href="/dashboard/calendar" className="text-sm font-medium text-blue-600 hover:text-blue-700 mr-2">
                View All
              </Link>
            </div>
            <Card className="border-slate-200 shadow-sm p-5 flex flex-col gap-4">

              {upcomingDeadlines.length > 0 ? (
                upcomingDeadlines.map((deadline, idx) => (
                  <div key={idx} className="flex gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                    <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                      <ClipboardList className="h-5 w-5 text-slate-500" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-900 text-sm">{deadline.title}</h4>
                      <p className="text-xs text-slate-500 mt-1">{deadline.date}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-slate-500 text-sm">
                  No upcoming deadlines. You're all caught up!
                </div>
              )}

            </Card>
          </section>

          {/* Learning Progress */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <ChartIcon className="h-5 w-5 text-slate-500" /> Your Progress
              </h2>
            </div>
            <Card className="border-slate-200 shadow-sm p-6 flex flex-col items-center">

              <ProgressRing
                progress={0}
                completedPercent={0}
                inProgressPercent={0}
                notStartedPercent={100}
              />

              <div className="w-full mt-8 flex flex-col gap-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-indigo-600"></span>
                    <span className="text-slate-600">Completed</span>
                  </div>
                  <span className="font-bold text-slate-900">0%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-sky-500"></span>
                    <span className="text-slate-600">In progress</span>
                  </div>
                  <span className="font-bold text-slate-900">0%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-teal-400"></span>
                    <span className="text-slate-600">Not Started</span>
                  </div>
                  <span className="font-bold text-slate-900">100%</span>
                </div>
              </div>

              <p className="text-xs text-slate-500 text-center mt-6">
                Start your first course to track your progress!
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
