import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Map, Target, Award, PlayCircle, ShieldCheck, Clock, CheckCircle2, ArrowUpRight, Star, Globe, Mail } from "lucide-react";
import { api } from "@/lib/api";

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
             <h3 className="text-emerald-500 font-semibold mb-2">Journey</h3>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">How to begin our Jouney</h2>
            <p className="mt-4 text-lg text-slate-600">lskdjf nwofknwo fneowjfb oeiwjfoi nqefoi wenoifnq;ef oiwnoif qnoiw</p>
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
          <div className="text-center mb-16">
            <h3 className="text-emerald-500 font-semibold mb-2">Featured Courses</h3>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Our Most Popular Classes</h2>
            <p className="mt-4 text-lg text-slate-600">lskdjf nwofknwo fneowjfb oeiwjfoi nqefoi wenoifnq;ef oiwnoif qnoiw</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayCourses.map((course, idx) => (
              <Link href={`/courses/${course.id || ''}`} key={idx} className="group bg-white rounded-2xl border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] overflow-hidden p-4 flex flex-col hover:shadow-xl transition-all cursor-pointer">
                {/* Thumbnail */}
                <div className={`relative h-48 w-full rounded-md ${course.color} mb-4 overflow-hidden`}>
                  {course.thumbnailUrl && (
                    <Image src={course.thumbnailUrl} alt={course.title} fill className="object-cover" />
                  )}
                  <div className="absolute top-3 right-3 bg-white px-2.5 py-1.5 rounded-md flex items-center gap-1.5 text-xs font-medium text-slate-700 shadow-sm z-10">
                    <Clock className="h-3.5 w-3.5 text-slate-500" />
                    {course.duration}
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 relative z-20">
                  <div className="text-emerald-500 font-semibold text-xs mb-2">{course.category}</div>

                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-lg text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-2">
                      {course.title}
                    </h3>
                    <ArrowUpRight className="h-5 w-5 text-slate-400 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform shrink-0" />
                  </div>

                  <p className="text-slate-500 text-sm mb-4 line-clamp-2 leading-relaxed">
                    {course.desc}
                  </p>

                  <div className="flex items-center gap-1 text-xs text-slate-500 mb-6 font-medium mt-auto">
                    <span className="text-emerald-500">{course.rating}</span>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className={`h-3.5 w-3.5 ${star <= Math.floor(parseFloat(course.rating)) ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}`} />
                      ))}
                    </div>
                    <span className="ml-1">{course.reviews}</span>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-xs uppercase overflow-hidden">
                        {course.author.substring(0, 2)}
                      </div>
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
              </Link>
            ))}
          </div>
          <div className="mt-12 flex flex-col items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="h-2 w-8 rounded-full bg-emerald-400"></div>
              <div className="h-2 w-2 rounded-full bg-slate-200"></div>
              <div className="h-2 w-2 rounded-full bg-slate-200"></div>
            </div>
            <Link href="/courses">
              <Button variant="outline" className="border-slate-200 text-slate-700 hover:bg-slate-50 font-medium rounded-lg px-6 py-2 h-auto">
                Explore All Courses
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Why AsiaSoftlab Learning</h2>
            <p className="mt-4 text-lg text-slate-600">lskdjf nwofknwo fneowjfb oeiwjfoi nqefoi wenoifnq;ef oiwnoif qnoiw</p>
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
      {/* Tutors Section */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h3 className="text-emerald-500 font-semibold mb-2">Faculties</h3>
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl mb-4">Meet the Heroes</h2>
            <p className="max-w-2xl mx-auto text-slate-500 text-sm md:text-base leading-relaxed">
              On Weekend UX, instructors from all over the world instruct millions of students. <br className="hidden md:block" /> We offer the knowledge and abilities.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
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
            ].map((tutor, i) => (
              <div key={i} className="bg-slate-100/80 rounded-lg p-10 flex flex-col items-center text-center transition-transform hover:-translate-y-1 hover:shadow-sm">
                <div className="w-35 h-35 rounded-full overflow-hidden mb-5 relative">
                  <Image src={tutor.image} alt={tutor.name} fill sizes="(max-width: 768px) 140px, 140px" className="object-cover" />
                </div>
                <h4 className="font-semibold text-slate-900 text-md md:text-base mb-1">{tutor.name}</h4>
                <p className="text-emerald-500 text-sm whitespace-pre-line leading-relaxed mb-4">{tutor.role}</p>
                <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-grow px-2">{tutor.desc}</p>
                
                <div className="flex items-center gap-4 text-slate-400 mt-auto">
                  <TwitterIcon className="w-4 h-4 hover:text-emerald-500 cursor-pointer transition-colors" />
                  <LinkedinIcon className="w-4 h-4 hover:text-emerald-500 cursor-pointer transition-colors" />
                  <Mail className="w-4 h-4 hover:text-emerald-500 cursor-pointer transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Our Success */}
      <section className="py-24 bg-slate-50">
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
      {/* Blog Section */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h3 className="text-emerald-500 font-semibold mb-2">Blog & News</h3>
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl mb-4">Our recent blogs</h2>
            <p className="max-w-2xl mx-auto text-slate-500 text-sm md:text-base leading-relaxed">
              Stay updated with the latest news, industry insights, and educational resources from our expert instructors.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left Column - Small Posts */}
            <div className="flex flex-col gap-8">
              {/* Small Post 1 */}
              <div className="flex flex-col sm:flex-row gap-6 group cursor-pointer">
                <div className="w-full sm:w-2/5 aspect-[4/3] relative rounded-lg overflow-hidden shrink-0">
                  <Image src="/Home/College.webp" alt="Blog" fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="flex flex-col justify-center flex-1">
                  <p className="text-emerald-500 text-sm font-semibold mb-2">November 16, 2014</p>
                  <h3 className="font-bold text-lg text-slate-900 mb-2 group-hover:text-brand-600 transition-colors">Three Pillars of User Delight</h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-3">
                    Delight can be experienced viscerally, behaviourally, and reflectively. A great design is ...
                  </p>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    <span className="px-3 py-1 bg-pink-50 text-pink-600 rounded-lg text-[12px] font-medium">Research</span>
                    <span className="px-3 py-1 bg-blue-50 text-blue-500 rounded-lg text-[12px] font-medium">UI UX</span>
                  </div>
                </div>
              </div>

              {/* Small Post 2 */}
              <div className="flex flex-col sm:flex-row gap-6 group cursor-pointer">
                <div className="w-full sm:w-2/5 aspect-[4/3] relative rounded-lg overflow-hidden shrink-0">
                  <Image src="/Home/Health.webp" alt="Blog" fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="flex flex-col justify-center flex-1">
                  <p className="text-emerald-500 text-sm font-semibold mb-2">September 24, 2017</p>
                  <h3 className="font-bold text-lg text-slate-900 mb-2 group-hover:text-brand-600 transition-colors">UX Mapping Methods</h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-3">
                    Visual-design principles can be applied consistently throughout the process of creating a polished UX map...
                  </p>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    <span className="px-3 py-1 bg-pink-50 text-pink-600 rounded-lg text-[12px] font-medium">Research</span>
                    <span className="px-3 py-1 bg-blue-50 text-blue-500 rounded-lg text-[12px] font-medium">UI Design</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Large Post */}
            <div className="flex flex-col group cursor-pointer">
              <div className="w-full aspect-[16/9] lg:aspect-auto lg:h-[260px] relative rounded-lg overflow-hidden mb-6">
                <Image src="/Home/School.webp" alt="Blog" fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <p className="text-emerald-500 text-sm font-semibold mb-3">March 13, 2014</p>
              <h3 className="font-bold text-2xl text-slate-900 mb-3 group-hover:text-brand-600 transition-colors">Agile Development Projects and Usability</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">
                Agile methods aim to overcome usability barriers in traditional development, but post new threats to user experience quality.
              </p>
              <div className="flex flex-wrap gap-2 mt-auto">
                <span className="px-3 py-1 bg-orange-50 text-orange-500 rounded-full text-[12px] font-medium">Programming</span>
                <span className="px-3 py-1 bg-blue-50 text-blue-500 rounded-full text-[12px] font-medium">Research</span>
                <span className="px-3 py-1 bg-pink-50 text-pink-600 rounded-full text-[12px] font-medium">Developments</span>
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
