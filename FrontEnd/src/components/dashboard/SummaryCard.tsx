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
  subtitleColor = "text-emerald-600",
  actionText,
  actionHref
}: SummaryCardProps) {
  return (
    <Card className="p-2.5 sm:p-3.5 flex flex-col justify-between border-slate-200/80 shadow-xs bg-white rounded-xl w-full min-w-0 gap-1.5 transition-all hover:border-slate-300">
      <h3 className="text-[10px] sm:text-xs font-medium text-slate-500 truncate leading-tight">{title}</h3>
      <div className="flex items-end justify-between gap-1">
        <div className="text-base sm:text-xl font-bold text-slate-900 tracking-tight leading-none">{value}</div>

        {subtitle && !actionText && (
          <div className={`text-[10px] sm:text-[11px] font-medium ${subtitleColor} truncate`}>
            {subtitle}
          </div>
        )}

        {actionText && actionHref && !subtitle && (
          <Link href={actionHref} className="text-[10px] sm:text-xs font-semibold text-brand-600 hover:text-brand-700 hover:underline truncate">
            {actionText}
          </Link>
        )}

        {subtitle && actionText && actionHref && (
          <div className="flex flex-col items-end">
            <div className={`text-[9px] sm:text-[10px] font-medium ${subtitleColor}`}>{subtitle}</div>
            <Link href={actionHref} className="text-[10px] sm:text-xs font-semibold text-brand-600 hover:text-brand-700 hover:underline">
              {actionText}
            </Link>
          </div>
        )}
      </div>
    </Card>
  );
}
