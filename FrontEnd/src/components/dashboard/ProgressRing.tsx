"use client";

interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  completedColor?: string;
  inProgressColor?: string;
  notStartedColor?: string;
  completedPercent?: number;
  inProgressPercent?: number;
  notStartedPercent?: number;
}

export function ProgressRing({
  progress,
  size = 160,
  strokeWidth = 16,
  completedColor = "#4f46e5", // Indigo 600
  inProgressColor = "#0ea5e9", // Sky 500
  notStartedColor = "#2dd4bf", // Teal 400
  completedPercent = 43,
  inProgressPercent = 29,
  notStartedPercent = 28,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  
  // Calculate stroke dasharrays for segments
  const completedDash = (completedPercent / 100) * circumference;
  const inProgressDash = (inProgressPercent / 100) * circumference;
  const notStartedDash = (notStartedPercent / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Not Started Segment */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={notStartedColor}
          strokeWidth={strokeWidth}
          strokeDasharray={`${notStartedDash} ${circumference}`}
          strokeDashoffset={0}
          strokeLinecap="round"
        />
        
        {/* In Progress Segment */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={inProgressColor}
          strokeWidth={strokeWidth}
          strokeDasharray={`${inProgressDash} ${circumference}`}
          strokeDashoffset={-notStartedDash}
          strokeLinecap="round"
        />
        
        {/* Completed Segment */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={completedColor}
          strokeWidth={strokeWidth}
          strokeDasharray={`${completedDash} ${circumference}`}
          strokeDashoffset={-(notStartedDash + inProgressDash)}
          strokeLinecap="round"
        />
      </svg>
      
      {/* Center Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-slate-900">{progress}%</span>
        <span className="text-xs text-slate-500 font-medium">Overall Progress</span>
      </div>
    </div>
  );
}
