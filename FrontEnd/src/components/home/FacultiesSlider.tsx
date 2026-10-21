"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Mail } from "lucide-react";

interface Tutor {
  name: string;
  role: string;
  desc: string;
  image: string;
}

export default function FacultiesSlider({ tutors }: { tutors: Tutor[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Repeat the list for continuous infinite loop scrolling on mobile
  const infiniteTutors = [...tutors, ...tutors, ...tutors];

  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof window === "undefined") return;

    let animationFrameId: number;
    let lastTime: number | null = null;
    const speed = 0.6;

    const step = (time: number) => {
      if (window.innerWidth >= 1024) {
        animationFrameId = requestAnimationFrame(step);
        return;
      }

      if (!isPaused && container) {
        if (lastTime !== null) {
          container.scrollLeft += speed;
          const maxScroll = (container.scrollWidth - container.clientWidth) / 2;
          if (container.scrollLeft >= maxScroll && maxScroll > 0) {
            container.scrollLeft = 1;
          }
        }
        lastTime = time;
      } else {
        lastTime = null;
      }

      animationFrameId = requestAnimationFrame(step);
    };

    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPaused, tutors.length]);

  return (
    <div
      ref={containerRef}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setTimeout(() => setIsPaused(false), 2000)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="flex lg:grid lg:grid-cols-[repeat(auto-fit,minmax(240px,1fr))] justify-center gap-4 sm:gap-6 overflow-x-auto lg:overflow-x-visible pb-4 pt-1 -mx-4 sm:-mx-6 lg:mx-0 px-4 sm:px-6 lg:px-0 no-scrollbar"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      {infiniteTutors.map((tutor, i) => (
        <div
          key={i} 
          className={`faculty-card-item shrink-0 ${i >= tutors.length ? "flex lg:hidden" : "flex"} w-[170px] sm:w-[220px] lg:w-full lg:max-w-[280px] lg:mx-auto h-[290px] sm:h-[310px] lg:h-[320px] [perspective:1000px] group`}
        >
          {/* Flip Container for Webview (Desktop >= 1024px) / Normal Card for Mobile */}
          <div className="relative w-full h-full transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] [transform-style:preserve-3d] lg:group-hover:[transform:rotateY(180deg)]">
            
            {/* FRONT SIDE (Visible on Mobile & Default Desktop) */}
            <div className="w-full h-full bg-white lg:bg-slate-100/90 p-3 sm:p-5 lg:p-6 flex flex-col items-center text-center shadow-xs lg:shadow-sm border border-slate-100 lg:border-slate-200/80 [backface-visibility:hidden]">
              <div className="flex flex-col items-center w-full my-auto">
                <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full overflow-hidden mb-3 relative ring-3 sm:ring-4 ring-slate-100 lg:ring-white shadow-sm shrink-0">
                  <Image
                    src={tutor.image}
                    alt={tutor.name}
                    fill
                    sizes="(max-width: 768px) 112px, 140px"
                    className="object-cover"
                  />
                </div>
                <h4 className="font-semibold text-slate-900 text-sm sm:text-base mb-1 leading-tight">
                  {tutor.name}
                </h4>
                <p className="text-emerald-600 text-xs sm:text-xs font-semibold whitespace-pre-line leading-tight px-1 line-clamp-2">
                  {tutor.role}
                </p>
              </div>

              {/* Bottom aligned divider & social icons */}
              <div className="flex items-center gap-3 sm:gap-4 text-slate-400 pt-3 border-t border-slate-200 lg:border-slate-300 w-full justify-center mt-auto">
                <TwitterIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 hover:text-brand-500 cursor-pointer transition-colors" />
                <LinkedinIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 hover:text-brand-500 cursor-pointer transition-colors" />
                <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 hover:text-brand-500 cursor-pointer transition-colors" />
              </div>
            </div>

            {/* BACK SIDE (Flipped on Desktop Webview >= 1024px) */}
            <div className="hidden lg:flex absolute inset-0 w-full h-full bg-white lg:bg-slate-100/90 text-slate-900 p-6 flex-col items-center justify-between text-center [transform:rotateY(180deg)] [backface-visibility:hidden] shadow-xl border border-slate-200/80">
              <div className="flex flex-col items-center w-full my-auto">
                <h4 className="font-bold text-base text-slate-900 mb-0.5">{tutor.name}</h4>
                <p className="text-emerald-600 text-xs font-medium mb-3">{tutor.role.replace('\n', ' ')}</p>
                <p className="text-slate-600 text-xs leading-relaxed line-clamp-5 px-1">{tutor.desc}</p>
              </div>

              {/* Bottom aligned divider & social icons on back */}
              <div className="flex items-center gap-4 text-slate-400 pt-3 border-t border-slate-300 w-full justify-center mt-auto">
                <TwitterIcon className="w-4 h-4 hover:text-brand-500 cursor-pointer transition-colors" />
                <LinkedinIcon className="w-4 h-4 hover:text-brand-500 cursor-pointer transition-colors" />
                <Mail className="w-4 h-4 hover:text-brand-500 cursor-pointer transition-colors" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function LinkedinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function TwitterIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  );
}
