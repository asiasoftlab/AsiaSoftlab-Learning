import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Map, Target, Award, PlayCircle, ShieldCheck, Clock, CheckCircle2, ArrowUpRight, Star } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 py-24 sm:py-32 flex items-center min-h-[95vh]">
        <div className="absolute inset-0 z-0 overflow-hidden">
          {/* Vibrant Mesh Gradient Background */}
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[70%] rounded-full bg-brand-600/50 blur-[100px]" />
          {/* <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-brand-600/50 blur-[100px]" /> */}
          {/* <div className="absolute top-[20%] left-[30%] w-[40%] h-[50%] rounded-full bg-purple-500/40 blur-[120px]" /> */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>

          {/* Subtle Grid overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        </div>
        <div className="container relative z-20 mx-auto px-4 md:px-6 flex flex-col items-center md:items-start text-center md:text-left">

          <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-5xl mb-8 leading-tight">
            Learn. Build. Fly. <br className="hidden md:block" />
            <span className="text-brand-400">Professional Drone & Technology Training</span>
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-slate-300 mb-10">
            Learn practical drone technology, surveying, mapping, ROV systems, and emerging technologies through expert-led online courses designed for industry professionals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/courses">
              <Button size="lg" className="w-full sm:w-auto text-base">Explore Courses</Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-base bg-transparent text-white border-white hover:bg-white/10 hover:text-white">
                Start Learning
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 bg-slate-50 border-t border-slate-100">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">How to begin our Jouney</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
             
              { num: "01", title: "Choose a Course", desc: "Browse our catalog of professional technical courses." },
              { num: "02", title: "Enroll & Start", desc: "Get instant access to structured video lessons and materials." },
              { num: "03", title: "Complete Lessons", desc: "Watch videos, download resources, and track your progress." },
              { num: "04", title: "Earn Certificate", desc: "Receive a verified certificate of completion upon finishing." },
            ].map((step, i) => (
              <div key={i} className="relative flex flex-col items-center md:items-start text-center md:text-left bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="text-4xl font-black text-brand-300 mb-4">{step.num}</div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-slate-600 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      

      {/* Featured Courses Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-12 text-center md:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Our Most Popular Classes</h2>
            <p className="mt-4 text-lg text-slate-600">
              Learn from structured, practical courses designed by AsiaSoftlab.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                category: "",
                title: "Figma UI UX Design..",
                desc: "Use Figma to get a job in UI Design, User Interface, User Experience design.",
                rating: "4.3",
                reviews: "(16,325)",
                author: "Hrishikesh",
                enrolled: "2026 Enrolled",
                price: "₹12000",
                duration: "08 hr 12 mins",
                color: "bg-slate-900"
              },
              {
                category: "",
                title: "Learn With Shoaib",
                desc: "Design Web Sites and Mobile Apps that Your Users Love and Return to Again.",
                rating: "3.9",
                reviews: "(832)",
                author: "Joseph John",
                enrolled: "2026 Enrolled",
                price: "₹4000",
                duration: "06 hr 3 mins",
                color: "bg-slate-900"
              },
              {
                category: "",
                title: "Building User Interface..",
                desc: "Learn how to apply User Experience (UX) principles to your website designs.",
                rating: "4.2",
                reviews: "(125)",
                author: "Vishnu Rohit",
                enrolled: "2026 Enrolled",
                price: "₹1000",
                duration: "01 hr 2 mins",
                color: "bg-slate-900"
              }
            ].map((course, idx) => (
              <div key={idx} className="group bg-white rounded-2xl border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] overflow-hidden p-4 flex flex-col hover:shadow-xl transition-all cursor-pointer">
                {/* Thumbnail */}
                <div className={`relative h-48 w-full rounded-md ${course.color} mb-4 overflow-hidden`}>
                  <div className="absolute top-3 right-3 bg-white px-2.5 py-1.5 rounded-md flex items-center gap-1.5 text-xs font-medium text-slate-700 shadow-sm">
                    <Clock className="h-3.5 w-3.5 text-slate-500" />
                    {course.duration}
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1">
                  <div className="text-emerald-500 font-semibold text-xs mb-2">{course.category}</div>

                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-lg text-slate-900 group-hover:text-brand-600 transition-colors">
                      {course.title}
                    </h3>
                    <ArrowUpRight className="h-5 w-5 text-slate-400 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>

                  <p className="text-slate-500 text-sm mb-4 line-clamp-2 leading-relaxed">
                    {course.desc}
                  </p>

                  <div className="flex items-center gap-1 text-xs text-slate-500 mb-6 font-medium mt-auto">
                    <span className="text-emerald-500">{course.rating}</span>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                    <span className="ml-1">{course.reviews}</span>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-slate-200" />
                      <div>
                        <div className="font-semibold text-xs text-slate-900">{course.author}</div>
                        <div className="text-[11px] text-slate-500">{course.enrolled}</div>
                      </div>
                    </div>
                    <div className="font-bold text-xl text-emerald-500">
                      {course.price}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Why AsiaSoftlab Learning</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-2xl bg-brand-100 flex items-center justify-center text-brand-600 mb-6">
                <Award className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Expert-Led Learning</h3>
              <p className="text-slate-600">Courses taught by industry veterans with thousands of hours of field experience.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Faculties */}
      <section className="py-24 bg-slate-50 overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl mb-4">Our Faculties</h2>
          <p className="text-slate-600 text-lg max-w-2xl">Learn from industry veterans and recognized experts in Drone Technology, Surveying, and ROV systems.</p>
        </div>
        
        {/* Premium Horizontal Scroll */}
        <div className="flex overflow-x-auto gap-6 px-4 md:px-6 pb-12 snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {/* spacer for alignment */}
          <div className="w-4 shrink-0 md:w-[calc((100vw-1536px)/2)]"></div>
          
          {[
            { name: "Dr. Aris Thorne", position: "Lead Surveyor", expertIn: ["Drone Mapping", "LiDAR", "GIS"], color: "bg-slate-200" },
            { name: "Elena Rostova", position: "Chief Drone Pilot", expertIn: ["Flight Dynamics", "Regulatory", "FPV"], color: "bg-slate-300" },
            { name: "Marcus Chen", position: "ROV Specialist", expertIn: ["Underwater Robotics", "Sonar", "Maintenance"], color: "bg-slate-200" },
            { name: "Sarah Jenkins", position: "Agriculture Tech Lead", expertIn: ["Crop Spraying", "NDVI Analysis"], color: "bg-slate-300" },
            { name: "David Alaba", position: "Software Architect", expertIn: ["Pix4D", "AutoCAD", "Data Processing"], color: "bg-slate-200" }
          ].map((faculty, i) => (
            <div key={i} className="snap-center shrink-0 w-[300px] bg-white rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 group hover:-translate-y-1 transition-transform duration-300 cursor-pointer">
              <div className={`h-64 w-full ${faculty.color} relative overflow-hidden flex items-end justify-center`}>
                {/* Image Placeholder */}
                <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm mb-8"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-xl text-slate-900 mb-1">{faculty.name}</h3>
                <p className="text-brand-600 font-medium text-sm mb-4">{faculty.position}</p>
                <div>
                  <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-2">Expert In</div>
                  <div className="flex flex-wrap gap-2">
                    {faculty.expertIn.map((skill, j) => (
                      <span key={j} className="px-2.5 py-1 bg-slate-50 text-slate-600 rounded-md text-xs font-medium border border-slate-100">{skill}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          <div className="w-4 shrink-0 md:w-[calc((100vw-1536px)/2)]"></div>
        </div>
      </section>

      {/* Our Success */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-20 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl mb-6">Our Success</h2>
            <p className="text-slate-500 text-sm leading-relaxed max-w-lg mx-auto">
              dgfkdgajkgfsdgjhjsdkghjlhsdlghklsdhgljkglsd ldsghljhwdkls SIGILDWHKJVLGSDLJKHGVJKL SHDGILHSDLKHGK;LSDJ  SDFHGLKSDHLGKHI hdfghek;lgk
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-center">
            {[
              { num: "15K+", label: "Students" },
              { num: "100%", label: "Total success rate" },
              { num: "30+", label: "Courses" },
              { num: "10+", label: "Chief experts" },
              { num: "8", label: "Years of experience" },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center justify-center">
                <div className="text-5xl font-light tracking-tight bg-gradient-to-r from-brand-600 to-cyan-400 bg-clip-text text-transparent mb-3">{stat.num}</div>
                <div className="text-slate-700 font-medium text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      

    </div>
  );
}
