"use client";

import { Card } from "@/components/ui/card";
import Link from "next/link";
import { ReactNode } from "react";

interface SummaryCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  subtitleColor?: string;
  actionText?: string;
  actionHref?: string;
}

export function SummaryCard({ 
  title, 
  value, 
  subtitle, 
  subtitleColor = "text-green-500",
  actionText,
  actionHref
}: SummaryCardProps) {
  return (
    <Card className="p-5 flex flex-col justify-between border-slate-200 shadow-sm bg-white rounded-2xl min-w-[180px]">
      <h3 className="text-sm font-medium text-slate-500 mb-2">{title}</h3>
      <div className="flex items-end justify-between">
        <div className="text-3xl font-bold text-slate-900">{value}</div>
        
        {subtitle && !actionText && (
          <div className={`text-sm font-medium ${subtitleColor} mb-1`}>
            {subtitle}
          </div>
        )}
        
        {actionText && actionHref && (
          <Link href={actionHref} className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline mb-1">
            {actionText}
          </Link>
        )}
        
        {subtitle && actionText && actionHref && (
          <div className="flex flex-col items-end">
            <div className={`text-xs font-medium ${subtitleColor} mb-1`}>{subtitle}</div>
            <Link href={actionHref} className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline">
              {actionText}
            </Link>
          </div>
        )}
      </div>
    </Card>
  );
}
