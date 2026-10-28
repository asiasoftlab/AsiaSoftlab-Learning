"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, ArrowUpRight, Star } from "lucide-react";

interface CourseItem {
  id: string;
  category: string;
  title: string;
  desc: string;
  rating: string;
  reviews: string;
  author: string;
  enrolled: string;
  price: string;
  duration: string;
  color: string;
  thumbnailUrl: string | null;
}

export default function FeaturedCoursesSlider({ courses }: { courses: CourseItem[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, clientWidth } = scrollContainerRef.current;
    if (clientWidth > 0) {
      const index = Math.round(scrollLeft / (clientWidth * 0.7));
      setActiveIndex(Math.min(Math.max(0, index), courses.length - 1));
    }
  };

  const scrollToIndex = (index: number) => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const items = container.querySelectorAll('.course-card-item');
    if (items[index]) {
      items[index].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      setActiveIndex(index);
    }
  };

  return (
    <>
      {/* Scrollable Container on Mobile, Grid on Desktop */}
      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6 md:gap-8 overflow-x-auto md:overflow-x-visible pb-4 pt-1 -mx-4 sm:-mx-6 md:mx-0 px-4 sm:px-6 md:px-0 snap-x snap-mandatory scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {courses.map((course, idx) => (
          <Link 
            href={`/courses/${course.id || ''}`} 
            key={idx} 
            className="course-card-item group bg-white rounded-xl sm:rounded-2xl border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.08)] overflow-hidden p-3 sm:p-4 flex flex-col hover:shadow-xl transition-all cursor-pointer w-[240px] sm:w-[280px] md:w-auto shrink-0 snap-center"
          >
            {/* Thumbnail */}
            <div className={`relative h-28 sm:h-36 md:h-48 w-full rounded-lg sm:rounded-md ${course.color} mb-2.5 sm:mb-4 overflow-hidden`}>
              {course.thumbnailUrl && (
                <Image src={course.thumbnailUrl} alt={course.title} fill sizes="(max-width: 768px) 240px, (max-width: 1200px) 50vw, 33vw" className="object-cover" />
              )}
              <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-white/95 backdrop-blur-xs px-2 py-0.5 sm:py-1.5 rounded-md flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs font-medium text-slate-700 shadow-sm z-10">
                <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-slate-500" />
                {course.duration}
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1 relative z-20">
              <div className="text-emerald-600 font-semibold text-[10px] sm:text-xs mb-1 sm:mb-2 uppercase tracking-wide">{course.category}</div>

              <div className="flex items-start justify-between mb-1 sm:mb-2">
                <h3 className="font-bold text-xs sm:text-base md:text-lg text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-2 leading-snug">
                  {course.title}
                </h3>
                <ArrowUpRight className="h-3.5 w-3.5 sm:h-5 sm:w-5 text-slate-400 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform shrink-0 ml-1" />
              </div>

              <p className="text-slate-500 text-[11px] sm:text-sm mb-2 sm:mb-4 line-clamp-2 leading-relaxed">
                {course.desc}
              </p>

              <div className="flex items-center gap-1 text-[10px] sm:text-xs text-slate-500 mb-2.5 sm:mb-6 font-medium mt-auto">
                <span className="text-emerald-600 font-semibold">{course.rating}</span>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className={`h-2.5 w-2.5 sm:h-3.5 sm:w-3.5 ${star <= Math.floor(parseFloat(course.rating)) ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}`} />
                  ))}
                </div>
                <span className="ml-1 text-slate-400">{course.reviews}</span>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-2 sm:pt-4 border-t border-slate-100">
                <div className="flex items-center gap-1.5 sm:gap-3">
                  <div className="h-6 w-6 sm:h-9 sm:w-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-[9px] sm:text-xs uppercase overflow-hidden">
                    {course.author.substring(0, 2)}
                  </div>
                  <div>
                    <div className="font-semibold text-[10px] sm:text-xs text-slate-900 leading-tight max-w-[85px] sm:max-w-[100px] truncate">{course.author}</div>
                    <div className="text-[9px] sm:text-[11px] text-slate-500">{course.enrolled}</div>
                  </div>
                </div>
                <div className="font-bold text-sm sm:text-xl text-emerald-600">
                  {course.price}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Interactive Dots for mobile carousel & Button */}
      <div className="mt-4 sm:mt-10 flex flex-col items-center gap-3 sm:gap-6">
        <div className="flex md:hidden items-center gap-1.5 py-1">
          {courses.map((_, i) => (
            <button
              key={i}
              type="button"
              suppressHydrationWarning
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => scrollToIndex(i)}
              className={`cursor-pointer transition-all duration-300 rounded-full ${
                activeIndex === i 
                  ? "h-1.5 w-6 bg-emerald-500" 
                  : "h-1.5 w-1.5 bg-slate-200 hover:bg-slate-300"
              }`}
            />
          ))}
        </div>

        <Link
          href="/courses"
          className="border border-slate-200 text-slate-700 hover:bg-slate-100 active:bg-slate-200 font-medium rounded-md px-4 py-1.5 sm:px-6 sm:py-2 text-xs sm:text-sm transition-colors shadow-2xs inline-block text-center"
        >
          Explore All Courses
        </Link>
      </div>
    </>
  );
}
