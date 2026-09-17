import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Map, Target, Award, PlayCircle, ShieldCheck, Clock, CheckCircle2, ArrowUpRight, Star, Globe, Mail } from "lucide-react";
import { api } from "@/lib/api";
import FeaturedCoursesSlider from "@/components/home/FeaturedCoursesSlider";
import FacultiesSlider from "@/components/home/FacultiesSlider";

export default async function Home() {
  let displayCourses = [
    {
      id: "",
      category: "Design",
      title: "UI/UX Design Masterclass",
      desc: "Use Figma to get a job in UI Design, User Interface, User Experience design.",
      rating: "4.3",
      reviews: "(16,325)",
      author: "Hrishikesh",
      enrolled: "2026 Enrolled",
      price: "₹12000",
      duration: "08 hr 12 mins",
      color: "bg-slate-900",
      thumbnailUrl: null
    },
    {
      id: "",
      category: "Development",
      title: "Fullstack Web Development",
      desc: "Design Web Sites and Mobile Apps that Your Users Love and Return to Again.",
      rating: "3.9",
      reviews: "(832)",
      author: "Joseph John",
      enrolled: "2026 Enrolled",
      price: "₹4000",
      duration: "06 hr 3 mins",
      color: "bg-slate-900",
      thumbnailUrl: null
    },
    {
      id: "",
      category: "Design",
      title: "Advanced UX Principles",
      desc: "Learn how to apply User Experience (UX) principles to your website designs.",
      rating: "4.2",
      reviews: "(125)",
      author: "Vishnu Rohit",
      enrolled: "2026 Enrolled",
      price: "₹1000",
      duration: "01 hr 2 mins",
      color: "bg-slate-900",
      thumbnailUrl: null
    }
  ];

  try {
    const res = await api.get('/courses');
    const published = res.data.filter((c: any) => c.status === "Published");
    if (published.length > 0) {
      // Get the latest up to 3 courses
      const latest = published.slice(-3).reverse();

      displayCourses = latest.map((course: any) => {
        let totalMins = 0;
        if (course.lessons && Array.isArray(course.lessons)) {
          course.lessons.forEach((l: any) => {
            const match = l.duration?.match(/(\d+)/g);
            if (match && match.length > 0) {
              if (match.length >= 2) {
                totalMins += (parseInt(match[0]) * 60) + parseInt(match[1]);
              } else {
                totalMins += parseInt(match[0]);
              }
            }
          });
        }
        const durationStr = totalMins > 0
          ? `${Math.floor(totalMins / 60).toString().padStart(2, '0')} hr ${(totalMins % 60).toString().padStart(2, '0')} mins`
          : "TBD";

        return {
          id: course.id,
          category: course.category || "Uncategorized",
          title: course.title,
          desc: course.description,
          rating: (course.averageRating || 0).toFixed(1),
          reviews: `(${course.ratingCount || 0})`,
          author: course.instructorId || "Instructor",
          enrolled: `${course.enrollmentCount || 0} Enrolled`,
          price: `₹${course.price || 0}`,
          duration: durationStr,
          color: "bg-slate-900",
          thumbnailUrl: course.thumbnailUrl || null
        };
      });
    }
  } catch (error) {
    console.error("Failed to fetch latest courses for homepage:", error);
  }

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 py-20 sm:py-24 md:py-32 flex items-center min-h-[calc(100vh-4rem)] sm:min-h-[90vh] md:min-h-[95vh]">
        <div className="absolute inset-0 z-0 overflow-hidden">
          {/* Vibrant Mesh Gradient Background */}
          <div className="absolute top-[-10%] left-[-10%] w-[60%] sm:w-[50%] h-[60%] sm:h-[70%] rounded-full bg-brand-600/50 blur-[80px] sm:blur-[100px]" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>

          {/* Subtle Grid overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:3rem_3rem] sm:bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        </div>
        <div className="container relative z-20 mx-auto px-4 sm:px-6 flex flex-col items-center md:items-start text-center md:text-left">

          <h1 className="max-w-3xl text-3xl sm:text-5xl lg:text-5xl font-bold tracking-tight text-white mb-5 sm:mb-8 leading-tight">
            Learn. Build. Fly. <br className="hidden sm:inline md:block" />
            <span className="text-brand-400 block sm:inline mt-1 sm:mt-0 text-2xl sm:text-4xl lg:text-5xl font-extrabold">Professional Drone & Technology Training</span>
          </h1>
          <p className="max-w-2xl text-sm sm:text-base md:text-lg leading-relaxed text-slate-300 mb-8 sm:mb-10">
            Learn practical drone technology, surveying, mapping, ROV systems, and emerging technologies through expert-led online courses designed for industry professionals.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto max-w-xs sm:max-w-none">
            <Link href="/courses" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto text-sm sm:text-base h-11 sm:h-12 px-6 shadow-md shadow-brand-500/20">Explore Courses</Button>
            </Link>
            <Link href="/register" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-sm sm:text-base h-11 sm:h-12 px-6 bg-transparent text-white border-white/80 hover:bg-white/10 hover:text-white">
                Start Learning
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-12 sm:py-20 bg-slate-50 border-t border-slate-100">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-16">
            <h3 className="text-emerald-500 font-semibold text-xs sm:text-sm tracking-wider uppercase mb-1 sm:mb-2">Journey</h3>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900">How to begin our Journey</h2>
            <p className="mt-2 sm:mt-4 text-xs sm:text-sm md:text-base text-slate-600 max-w-xl mx-auto">Start your learning pathway with these four structured steps to success.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 md:gap-8">
            {[
              { num: "01", title: "Choose a Course", desc: "Browse our catalog of professional technical courses." },
              { num: "02", title: "Enroll & Start", desc: "Get instant access to structured video lessons and materials." },
              { num: "03", title: "Complete Lessons", desc: "Watch videos, download resources, and track your progress." },
              { num: "04", title: "Earn Certificate", desc: "Receive a verified certificate of completion upon finishing." },
            ].map((step, i) => (
              <div key={i} className="relative flex flex-col items-center sm:items-start text-center sm:text-left bg-white p-3.5 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="text-2xl sm:text-4xl font-black text-brand-400 mb-1.5 sm:mb-4">{step.num}</div>
                <h3 className="text-xs sm:text-lg font-bold text-slate-900 mb-1 sm:mb-2">{step.title}</h3>
                <p className="text-slate-600 text-[11px] sm:text-sm leading-relaxed line-clamp-3 sm:line-clamp-none">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-12 sm:py-20 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-16">
            <h3 className="text-emerald-500 font-semibold text-xs sm:text-sm tracking-wider uppercase mb-1 sm:mb-2">Featured Courses</h3>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900">Our Most Popular Classes</h2>
            <p className="mt-2 sm:mt-4 text-xs sm:text-sm md:text-base text-slate-600 max-w-xl mx-auto">Explore our top-rated courses and begin your professional training journey today.</p>
          </div>
          <FeaturedCoursesSlider courses={displayCourses} />
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-12 sm:py-20 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900">Why Asia Softlab Virtual Academy</h2>
            <p className="mt-2 sm:mt-4 text-xs sm:text-sm md:text-base text-slate-600 max-w-xl mx-auto">Everything you need to advance your aviation career - all in one place.</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
            {/* 1 */}
            <div className="flex flex-col items-center text-center bg-white sm:bg-transparent p-3.5 sm:p-5 lg:p-0 rounded-xl sm:rounded-none border border-slate-100 sm:border-0 shadow-xs sm:shadow-none">
              <div className="flex items-center justify-center mb-3 sm:mb-4 lg:mb-6 overflow-hidden w-28 h-28 sm:w-32 sm:h-32 lg:w-40 lg:h-40">
                <Image src="/Home/1.png" alt="Expert-Led Learning" width={280} height={280} className="object-contain w-full h-full" />
              </div>
              <h3 className="text-xs sm:text-base lg:text-xl font-semibold mb-1 sm:mb-2 text-slate-900 leading-snug">Expert-Led Learning</h3>
              <p className="text-slate-600 text-[11px] sm:text-xs lg:text-sm leading-relaxed line-clamp-3 sm:line-clamp-none">Courses taught by industry veterans with thousands of hours of field experience.</p>
            </div>

            {/* 2 */}
            <div className="flex flex-col items-center text-center bg-white sm:bg-transparent p-3.5 sm:p-5 lg:p-0 rounded-xl sm:rounded-none border border-slate-100 sm:border-0 shadow-xs sm:shadow-none">
              <div className="flex items-center justify-center mb-3 sm:mb-4 lg:mb-6 overflow-hidden w-28 h-28 sm:w-32 sm:h-32 lg:w-40 lg:h-40">
                <Image src="/Home/2.png" alt="Practical Skills" width={280} height={280} className="object-contain w-full h-full" />
              </div>
              <h3 className="text-xs sm:text-base lg:text-xl font-semibold mb-1 sm:mb-2 text-slate-900 leading-snug">Practical Skills</h3>
              <p className="text-slate-600 text-[11px] sm:text-xs lg:text-sm leading-relaxed line-clamp-3 sm:line-clamp-none">Hands-on projects and simulations designed to mirror actual industry scenarios.</p>
            </div>

            {/* 3 */}
            <div className="flex flex-col items-center text-center bg-white sm:bg-transparent p-3.5 sm:p-5 lg:p-0 rounded-xl sm:rounded-none border border-slate-100 sm:border-0 shadow-xs sm:shadow-none">
              <div className="flex items-center justify-center mb-3 sm:mb-4 lg:mb-6 overflow-hidden w-28 h-28 sm:w-32 sm:h-32 lg:w-40 lg:h-40">
                <Image src="/Home/3.png" alt="Learner Support" width={240} height={240} className="object-contain w-full h-full" />
              </div>
              <h3 className="text-xs sm:text-base lg:text-xl font-semibold mb-1 sm:mb-2 text-slate-900 leading-snug">Learner Support</h3>
              <p className="text-slate-600 text-[11px] sm:text-xs lg:text-sm leading-relaxed line-clamp-3 sm:line-clamp-none">Dedicated mentors and an active community ready to guide you at every step.</p>
            </div>

            {/* 4 */}
            <div className="flex flex-col items-center text-center bg-white sm:bg-transparent p-3.5 sm:p-5 lg:p-0 rounded-xl sm:rounded-none border border-slate-100 sm:border-0 shadow-xs sm:shadow-none">
              <div className="flex items-center justify-center mb-3 sm:mb-4 lg:mb-6 overflow-hidden w-28 h-28 sm:w-32 sm:h-32 lg:w-40 lg:h-40">
                <Image src="/Home/4.png" alt="DGCA Certification" width={240} height={240} className="object-contain w-full h-full" />
              </div>
              <h3 className="text-xs sm:text-base lg:text-xl font-semibold mb-1 sm:mb-2 text-slate-900 leading-snug">DGCA Certification</h3>
              <p className="text-slate-600 text-[11px] sm:text-xs lg:text-sm leading-relaxed line-clamp-3 sm:line-clamp-none">Prepare for and achieve DGCA-recognised certifications that open doors.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tutors Section */}
      <section className="py-12 sm:py-24 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-16">
            <h3 className="text-emerald-500 font-semibold text-xs sm:text-sm tracking-wider uppercase mb-1 sm:mb-2">Faculties</h3>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-2 sm:mb-4">Meet the Heroes</h2>
            <p className="max-w-2xl mx-auto text-slate-500 text-xs sm:text-sm md:text-base leading-relaxed">
              On Weekend UX, instructors from all over the world instruct millions of students. <br className="hidden md:block" /> We offer the knowledge and abilities.
            </p>
          </div>

          <FacultiesSlider
            tutors={[
              {
                name: "Vishnu Rohit",
                role: "Application Support Analyst",
                desc: "Former co-founder of Opendoor. Early staff at Spotify and Clearbit.",
                image: "/Home/hari-crop.jpeg"
              },
              {
                name: "Adarsh",
                role: "Director, Undergraduate\nAnalytics and Planning",
                desc: "Lead engineering teams at Figma, Pitch, and Protocol Labs.",
                image: "/Home/hari-crop.jpeg"
              },
              {
                name: "Hrishikesh",
                role: "Career Educator",
                desc: "Former PM for Linear, Lambda School, and On Deck.",
                image: "/Home/hari-crop.jpeg"
              },
              {
                name: "Nishadh",
                role: "Co-op & Internships Program\n& Operations Manager",
                desc: "Former frontend dev for Linear, Coinbase, and Postscript.",
                image: "/Home/hari-crop.jpeg"
              }
            ]}
          />
        </div>
      </section>

      {/* Our Success */}
      <section className="py-12 sm:py-24 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-16 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-3 sm:mb-6">Our Success</h2>
            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed max-w-lg mx-auto">
              Empowering learners worldwide through quality education and industry-leading training programs.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 sm:gap-8 text-center">
            {[
              { num: "15K+", label: "Students" },
              { num: "100%", label: "Success rate" },
              { num: "30+", label: "Courses" },
              { num: "10+", label: "Chief experts" },
              { num: "8+", label: "Years experience" },
            ].map((stat, i) => (
              <div key={i} className={`flex flex-col items-center justify-center p-3 rounded-xl bg-white sm:bg-transparent border border-slate-100 sm:border-0 shadow-xs sm:shadow-none ${i === 4 ? 'col-span-2 sm:col-span-1' : ''}`}>
                <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-brand-600 to-cyan-400 bg-clip-text text-transparent mb-1 sm:mb-3">{stat.num}</div>
                <div className="text-slate-700 font-medium text-xs sm:text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-12 sm:py-24 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-16">
            <h3 className="text-emerald-500 font-semibold text-xs sm:text-sm tracking-wider uppercase mb-1 sm:mb-2">Blog & News</h3>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-2 sm:mb-4">Our recent blogs</h2>
            <p className="max-w-2xl mx-auto text-slate-500 text-xs sm:text-sm md:text-base leading-relaxed">
              Stay updated with the latest news, industry insights, and educational resources from our expert instructors.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 lg:gap-12">
            {/* Left Column - Small Posts */}
            <div className="flex flex-col gap-3 sm:gap-6 lg:gap-8">
              {/* Small Post 1 */}
              <div className="flex flex-row sm:flex-row gap-3 sm:gap-6 bg-white sm:bg-transparent p-3 sm:p-0 rounded-xl sm:rounded-none border border-slate-100 sm:border-0 shadow-xs sm:shadow-none group cursor-pointer items-center sm:items-stretch">
                <div className="w-28 sm:w-2/5 aspect-[4/3] relative rounded-lg overflow-hidden shrink-0">
                  <Image src="/Home/College.webp" alt="Blog" fill sizes="(max-width: 768px) 112px, (max-width: 1200px) 50vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="flex flex-col justify-center flex-1 min-w-0">
                  <p className="text-emerald-600 text-[10px] sm:text-sm font-semibold mb-0.5 sm:mb-2">Nov 16, 2024</p>
                  <h3 className="font-bold text-xs sm:text-base md:text-lg text-slate-900 mb-1 sm:mb-2 group-hover:text-brand-600 transition-colors line-clamp-2 leading-snug">Three Pillars of User Delight</h3>
                  <p className="hidden sm:block text-slate-500 text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4 line-clamp-2">
                    Delight can be experienced viscerally, behaviourally, and reflectively. A great design is intuitive and engaging.
                  </p>
                  <div className="flex flex-wrap gap-1 sm:gap-2 mt-auto">
                    <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-pink-50 text-pink-600 rounded-md sm:rounded-lg text-[10px] sm:text-[12px] font-medium">Research</span>
                    <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-blue-50 text-blue-500 rounded-md sm:rounded-lg text-[10px] sm:text-[12px] font-medium">UI UX</span>
                  </div>
                </div>
              </div>

              {/* Small Post 2 */}
              <div className="flex flex-row sm:flex-row gap-3 sm:gap-6 bg-white sm:bg-transparent p-3 sm:p-0 rounded-xl sm:rounded-none border border-slate-100 sm:border-0 shadow-xs sm:shadow-none group cursor-pointer items-center sm:items-stretch">
                <div className="w-28 sm:w-2/5 aspect-[4/3] relative rounded-lg overflow-hidden shrink-0">
                  <Image src="/Home/Health.webp" alt="Blog" fill sizes="(max-width: 768px) 112px, (max-width: 1200px) 50vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="flex flex-col justify-center flex-1 min-w-0">
                  <p className="text-emerald-600 text-[10px] sm:text-sm font-semibold mb-0.5 sm:mb-2">Sep 24, 2024</p>
                  <h3 className="font-bold text-xs sm:text-base md:text-lg text-slate-900 mb-1 sm:mb-2 group-hover:text-brand-600 transition-colors line-clamp-2 leading-snug">UX Mapping Methods</h3>
                  <p className="hidden sm:block text-slate-500 text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4 line-clamp-2">
                    Visual-design principles can be applied consistently throughout the process of creating a polished UX map.
                  </p>
                  <div className="flex flex-wrap gap-1 sm:gap-2 mt-auto">
                    <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-pink-50 text-pink-600 rounded-md sm:rounded-lg text-[10px] sm:text-[12px] font-medium">Research</span>
                    <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-blue-50 text-blue-500 rounded-md sm:rounded-lg text-[10px] sm:text-[12px] font-medium">UI Design</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Large Post */}
            <div className="flex flex-col bg-white sm:bg-transparent p-3 sm:p-0 rounded-xl sm:rounded-none border border-slate-100 sm:border-0 shadow-xs sm:shadow-none group cursor-pointer">
              <div className="w-full aspect-[16/9] sm:aspect-[16/9] lg:h-[260px] relative rounded-lg overflow-hidden mb-2.5 sm:mb-6">
                <Image src="/Home/School.webp" alt="Blog" fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <p className="text-emerald-600 text-[10px] sm:text-sm font-semibold mb-1 sm:mb-3">Mar 13, 2024</p>
              <h3 className="font-bold text-sm sm:text-xl lg:text-2xl text-slate-900 mb-1 sm:mb-3 group-hover:text-brand-600 transition-colors leading-snug">Agile Development Projects and Usability</h3>
              <p className="text-slate-500 text-[11px] sm:text-sm leading-relaxed mb-2.5 sm:mb-6 line-clamp-2 sm:line-clamp-3">
                Agile methods aim to overcome usability barriers in traditional development, but post new threats to user experience quality.
              </p>
              <div className="flex flex-wrap gap-1 sm:gap-2 mt-auto">
                <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-orange-50 text-orange-500 rounded-full text-[10px] sm:text-[12px] font-medium">Programming</span>
                <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-blue-50 text-blue-500 rounded-full text-[10px] sm:text-[12px] font-medium">Research</span>
                <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-pink-50 text-pink-600 rounded-full text-[10px] sm:text-[12px] font-medium">Developments</span>
              </div>
            </div>
          </div>
        </div>
      </section>

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
