"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MonitorPlay } from "lucide-react";

interface ActiveCourseCardProps {
  title: string;
  lastLesson: string;
  progress: number;
  colorScheme?: "teal" | "blue" | "purple" | "orange";
  thumbnailUrl?: string;
}

export function ActiveCourseCard({ 
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
    <Card className={`overflow-hidden border-0 relative ${!thumbnailUrl ? `bg-gradient-to-br ${colors.bgGradient}` : 'bg-slate-900'} rounded-2xl min-h-[280px] flex flex-col`}>
      {thumbnailUrl ? (
        <>
          <img 
            src={thumbnailUrl} 
            alt={title} 
            className="absolute inset-0 w-full h-full object-cover opacity-60" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
        </>
      ) : (
        <>
          {/* Abstract decorative shape in background */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-xl -ml-10 -mb-10 pointer-events-none"></div>
        </>
      )}

      <div className="p-6 relative z-10 flex flex-col h-full flex-1">
        <div className="flex justify-between items-start mb-6">
          <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
            <MonitorPlay className="h-6 w-6 text-white" />
          </div>
          <Button variant="ghost" className="bg-white/90 hover:bg-white text-slate-800 rounded-full text-xs font-medium px-4 h-8">
            Continue Learning
          </Button>
        </div>

        <div className="mb-8 mt-auto">
          <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 leading-tight">
            {title}
          </h3>
          <p className="text-white/80 text-sm line-clamp-1">
            Last Lesson: {lastLesson}
          </p>
        </div>

        <div className="mt-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-white/90">In progress</span>
            <span className="text-sm font-bold text-white">{progress}%</span>
          </div>
          <div className={`h-2 w-full rounded-full ${colors.progressBg} overflow-hidden`}>
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
