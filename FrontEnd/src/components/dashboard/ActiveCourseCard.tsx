"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MonitorPlay } from "lucide-react";
import Link from "next/link";

interface ActiveCourseCardProps {
  courseId?: string;
  title: string;
  lastLesson: string;
  progress: number;
  colorScheme?: "teal" | "blue" | "purple" | "orange";
  thumbnailUrl?: string;
}

export function ActiveCourseCard({ 
  courseId,
  title, 
  lastLesson, 
  progress, 
  colorScheme = "teal",
  thumbnailUrl
}: ActiveCourseCardProps) {
  
  // Maps color schemes to Tailwind classes
  const colorMap = {
    teal: {
      bg: "bg-teal-400",
      bgGradient: "from-teal-300 to-teal-500",
      text: "text-teal-900",
      iconBg: "bg-teal-50",
      progressBg: "bg-teal-200/50",
      progressFill: "bg-white",
    },
    blue: {
      bg: "bg-blue-400",
      bgGradient: "from-blue-300 to-blue-500",
      text: "text-blue-900",
      iconBg: "bg-blue-50",
      progressBg: "bg-blue-200/50",
      progressFill: "bg-white",
    },
    purple: {
      bg: "bg-purple-400",
      bgGradient: "from-purple-300 to-purple-500",
      text: "text-purple-900",
      iconBg: "bg-purple-50",
      progressBg: "bg-purple-200/50",
      progressFill: "bg-white",
    },
    orange: {
      bg: "bg-orange-400",
      bgGradient: "from-orange-300 to-orange-500",
      text: "text-orange-900",
      iconBg: "bg-orange-50",
      progressBg: "bg-orange-200/50",
      progressFill: "bg-white",
    }
  };

  const colors = colorMap[colorScheme];

  return (
    <Card className={`overflow-hidden border-0 relative ${!thumbnailUrl ? `bg-gradient-to-br ${colors.bgGradient}` : 'bg-slate-900'} rounded-xl sm:rounded-2xl min-h-[160px] sm:min-h-[210px] flex flex-col shadow-xs`}>
      {thumbnailUrl ? (
        <>
          <img 
            src={thumbnailUrl} 
            alt={title} 
            className="absolute inset-0 w-full h-full object-cover opacity-60" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/15 pointer-events-none" />
        </>
      ) : (
        <>
          {/* Abstract decorative shape in background */}
          <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-20 h-20 sm:w-24 sm:h-24 bg-white/10 rounded-full blur-lg pointer-events-none"></div>
        </>
      )}

      <div className="p-3 sm:p-4.5 relative z-10 flex flex-col h-full flex-1 justify-between gap-2.5">
        <div className="flex justify-between items-center gap-2">
          <div className="h-7 w-7 sm:h-9 sm:w-9 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
            <MonitorPlay className="h-3.5 w-3.5 sm:h-4.5 sm:w-4.5 text-white" />
          </div>
          {courseId ? (
            <Link href={`/courses/${courseId}`}>
              <Button variant="ghost" className="bg-white/95 hover:bg-white text-slate-900 rounded-full text-[10px] sm:text-xs font-semibold px-2.5 sm:px-3 h-6 sm:h-7 cursor-pointer shadow-xs">
                Continue
              </Button>
            </Link>
          ) : (
            <Button variant="ghost" className="bg-white/95 hover:bg-white text-slate-900 rounded-full text-[10px] sm:text-xs font-semibold px-2.5 sm:px-3 h-6 sm:h-7 shadow-xs">
              Continue
            </Button>
          )}
        </div>

        <div className="my-auto py-0.5">
          <h3 className="text-xs sm:text-sm md:text-base font-bold text-white mb-0.5 line-clamp-1 sm:line-clamp-2 leading-snug">
            {title}
          </h3>
          <p className="text-white/80 text-[10px] sm:text-xs line-clamp-1 font-medium">
            Last Lesson: {lastLesson}
          </p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1 text-[10px] sm:text-xs">
            <span className="font-medium text-white/90">In progress</span>
            <span className="font-bold text-white">{progress}%</span>
          </div>
          <div className={`h-1.5 sm:h-2 w-full rounded-full ${colors.progressBg} overflow-hidden`}>
            <div 
              className={`h-full rounded-full ${colors.progressFill}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
