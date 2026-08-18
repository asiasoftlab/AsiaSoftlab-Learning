import { Clock, ArrowUpRight, Star } from "lucide-react";

export default function CoursesPage() {
  const courses = [
    {
      category: "",
      title: "bfjwqbfjlql",
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
      title: "bfvqklbvkl nef;kqnv",
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
      title: "lhfqhf hfhlf ohfnk hfipqb",
      desc: "Learn how to apply User Experience (UX) principles to your website designs.",
      rating: "4.2",
      reviews: "(125)",
      author: "Vishnu Rohit",
      enrolled: "2026 Enrolled",
      price: "₹1000",
      duration: "01 hr 2 mins",
      color: "bg-slate-900"
    },
    {
      category: "",
      title: "Advanced JavaScript Concepts",
      desc: "Master closures, prototypes, and asynchronous programming in modern JavaScript.",
      rating: "4.8",
      reviews: "(4,210)",
      author: "Jane Doe",
      enrolled: "5021 Enrolled",
      price: "₹5500",
      duration: "10 hr 45 mins",
      color: "bg-slate-900"
    },
    {
      category: "",
      title: "React Native for Beginners",
      desc: "Build cross-platform mobile applications using React Native and Expo.",
      rating: "4.6",
      reviews: "(2,105)",
      author: "Mark Smith",
      enrolled: "3100 Enrolled",
      price: "₹6000",
      duration: "12 hr 30 mins",
      color: "bg-slate-900"
    },
    {
      category: "",
      title: "Mastering Python Data Science",
      desc: "Learn Pandas, NumPy, and Matplotlib to analyze and visualize complex datasets.",
      rating: "4.7",
      reviews: "(8,940)",
      author: "Alice Johnson",
      enrolled: "12500 Enrolled",
      price: "₹8000",
      duration: "20 hr 15 mins",
      color: "bg-slate-900"
    },
    {
      category: "",
      title: "Fullstack Next.js Bootcamp",
      desc: "Learn server actions, routing, and deployment with Next.js 14.",
      rating: "4.9",
      reviews: "(1,540)",
      author: "Sam Alt",
      enrolled: "2400 Enrolled",
      price: "₹15000",
      duration: "18 hr 0 mins",
      color: "bg-slate-900"
    },
    {
      category: "",
      title: "Introduction to Cybersecurity",
      desc: "Understand the basics of network security, cryptography, and ethical hacking.",
      rating: "4.5",
      reviews: "(5,320)",
      author: "Evan Wright",
      enrolled: "6800 Enrolled",
      price: "₹4500",
      duration: "09 hr 10 mins",
      color: "bg-slate-900"
    },
    
    
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">Courses</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">Explore our comprehensive catalog of courses taught by industry experts.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {courses.map((course, idx) => (
            <div key={idx} className="group bg-white rounded-2xl border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] overflow-hidden p-4 flex flex-col hover:shadow-2xl hover:-translate-y-2 hover:border-emerald-100 transition-all duration-300 ease-out cursor-pointer relative">
              
              {/* Thumbnail with slight scale animation on hover */}
              <div className={`relative h-48 w-full rounded-xl ${course.color} mb-5 overflow-hidden`}>
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-500 z-10" />
                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur px-2.5 py-1.5 rounded-md flex items-center gap-1.5 text-xs font-medium text-slate-700 shadow-sm z-20 transition-transform duration-300 group-hover:scale-105">
                  <Clock className="h-3.5 w-3.5 text-slate-500" />
                  {course.duration}
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-col flex-1 relative z-20">
                {course.category && (
                  <div className="text-emerald-500 font-semibold text-xs mb-2 tracking-wide uppercase">{course.category}</div>
                )}

                <div className="flex items-start justify-between mb-2 gap-2">
                  <h3 className="font-bold text-lg text-slate-900 group-hover:text-emerald-600 transition-colors duration-300 line-clamp-2">
                    {course.title}
                  </h3>
                  <ArrowUpRight className="h-5 w-5 text-slate-400 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-emerald-500 transition-all duration-300 shrink-0" />
                </div>

                <p className="text-slate-500 text-sm mb-5 line-clamp-2 leading-relaxed">
                  {course.desc}
                </p>

                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-6 font-medium mt-auto">
                  <span className="text-emerald-600 font-bold text-sm">{course.rating}</span>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className={`h-3.5 w-3.5 ${star <= Math.floor(parseFloat(course.rating)) ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}`} />
                    ))}
                  </div>
                  <span className="ml-1 opacity-75">{course.reviews}</span>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100/80">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-xs uppercase overflow-hidden">
                      {course.author.slice(0, 2)}
                    </div>
                    <div>
                      <div className="font-semibold text-xs text-slate-900">{course.author}</div>
                      <div className="text-[11px] text-slate-500">{course.enrolled}</div>
                    </div>
                  </div>
                  <div className="font-bold text-xl text-emerald-500 group-hover:scale-110 transition-transform origin-right duration-300">
                    {course.price}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
