
import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'About Us | Asia Softlab Virtual Academy (ASVA)',
  description: 'An industry-focused digital learning platform created to make practical, technology-driven education more accessible to students, professionals, and organizations worldwide.',
};

export default function AboutPage() {
  const benefits = [
    {
      id: '01',
      title: 'Drone Technology',
      description:
        'Comprehensive training covering drone operations, flight mechanics, UAV engineering, and industrial autonomous mission planning.',
    },
    {
      id: '02',
      title: 'GIS & Spatial Science',
      description:
        'Master Geographic Information Systems, spatial data analysis, coordinate systems, and geospatial intelligence pipelines.',
    },
    {
      id: '03',
      title: 'Surveying & Mapping',
      description:
        'High-precision aerial surveying, topographic mapping, land inspection, and infrastructure modeling with modern toolsets.',
    },
    {
      id: '04',
      title: 'Remote Sensing',
      description:
        'Multispectral and thermal imaging, satellite data interpretation, crop health monitoring, and environmental resource tracking.',
    },
    {
      id: '05',
      title: 'Data Processing & Photogrammetry',
      description:
        'Converting raw aerial imagery into accurate 3D point clouds, digital surface models (DSM), orthomosaics, and CAD integration.',
    },
    {
      id: '06',
      title: 'Industry Digital Solutions',
      description:
        'End-to-end enterprise digital workflows, connecting knowledge and specialized tools directly with commercial technology products.',
    },
  ];

  return (
    <div className="bg-white min-h-screen text-slate-800 selection:bg-emerald-100 selection:text-emerald-900">
      {/* SECTION 1: HERO ABOUT US */}
      <section className="py-16 md:py-24 overflow-hidden">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6">
              <span className="inline-block text-emerald-600 font-bold text-3xl md:text-4xl tracking-tight">
                About Us
              </span>

              <h1 className="text-3xl sm:text-4xl md:text-4xl font-extrabold text-slate-900 leading-[1.18] tracking-tight">
                <span className="text-[#e28413]">ASIA SOFTLAB</span> Providing The Best Opportunities To Students Around The Globe.
              </h1>

              <div className="space-y-4 text-slate-600 text-sm md:text-base leading-relaxed">
                <p>
                  <strong className="text-slate-900 font-semibold">Asia Softlab Virtual Academy (ASVA)</strong> is an industry-focused digital learning platform created to make practical, technology-driven education more accessible to students, professionals, and organizations worldwide.
                </p>
                <p>
                  As industries rapidly adopt emerging technologies, there is a growing need for learning that goes beyond theory. ASVA focuses on practical, skill-based education in specialized and technology-driven fields, helping learners understand not only how a technology works, but also how it is applied in real-world industry environments.
                </p>
              </div>

              <div className="pt-2">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 bg-[#10b981] hover:bg-[#059669] text-white px-7 py-3.5 rounded-full font-medium text-sm transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/25 cursor-pointer group"
                >
                  Join Us
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            {/* Right Images Composite */}
            <div className="lg:col-span-6 relative flex items-center justify-center">
              <div className="w-full max-w-[460px] h-[340px] md:h-[400px] bg-slate-100/80 rounded-3xl absolute -top-4 right-0 -z-0" />

              <div className="relative z-10 w-full max-w-[460px] space-y-6">
                <div className="relative h-48 sm:h-56 md:h-64 w-full rounded-2xl overflow-hidden shadow-xl border border-slate-100">
                  <Image
                    src="/Home/1.png"
                    alt="Asia Softlab Virtual Academy Innovation"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>

                <div className="relative h-44 sm:h-52 w-4/5 sm:w-3/4 ml-auto rounded-2xl overflow-hidden shadow-2xl border-4 border-white -mt-12 sm:-mt-16">
                  <Image
                    src="/Home/2.png"
                    alt="Practical technical training session"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: FEATURES */}
      <section className="py-16 md:py-24 bg-slate-50/60 border-y border-slate-100">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Feature Showcase Image Card */}
            <div className="lg:col-span-6 order-2 lg:order-1 flex justify-center">
              <div className="relative w-full max-w-[460px] h-[380px] sm:h-[440px] rounded-3xl overflow-hidden shadow-xl border border-slate-200/80 bg-white p-3">
                <div className="relative w-full h-full rounded-2xl overflow-hidden">
                  <Image
                    src="/Home/3.png"
                    alt="Emerging technologies in Drones, GIS, and Remote Sensing"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Right Features Content */}
            <div className="lg:col-span-6 order-1 lg:order-2 space-y-6">
              <span className="inline-block text-emerald-600 font-bold text-sm tracking-wider uppercase">
                Features
              </span>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 leading-[1.18] tracking-tight">
                We are always working to provide you best of the features in all aspects.
              </h2>

              <div className="space-y-4 text-slate-600 text-sm md:text-base leading-relaxed">
                <p>
                  We believe that learning should be connected to real-world application. That is why ASVA brings education, technology, and industry products closer together—creating a seamless journey from learning a skill to applying it with the right tools and technologies.
                </p>
                <p>
                  Powered by <strong className="text-slate-900 font-semibold">Asia Softlab</strong>, ASVA aims to build a global digital learning ecosystem that connects knowledge, skills, technology, and opportunity.
                </p>
                <p className="font-semibold text-emerald-700 pt-1 text-base tracking-wide">
                  Learn. Skill. Apply. Grow. — ASVA
                </p>
              </div>

              <div className="pt-2">
                <Link
                  href="/courses"
                  className="inline-flex items-center gap-2 bg-[#10b981] hover:bg-[#059669] text-white px-7 py-3.5 rounded-full font-medium text-sm transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/25 cursor-pointer group"
                >
                  Learn More
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: OUR BENEFITS / ECOSYSTEM PILLARS */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-6 max-w-7xl">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="inline-block text-emerald-600 font-bold text-sm tracking-wider uppercase">
              Our Benefits
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight tracking-tight">
              By Joining ASVA Platform, One Can Avail a Lot Of Benefits.
            </h2>
            <p className="text-slate-500 text-sm md:text-base leading-relaxed">
              Our learning ecosystem is designed around emerging technologies such as drones, GIS, surveying, mapping, remote sensing, data processing, and industry-relevant digital solutions.
            </p>
          </div>

          {/* 6 Grid Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {benefits.map((b) => (
              <div
                key={b.id}
                className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:border-emerald-200/70 transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  {/* Number Badge */}
                  <div className="text-3xl sm:text-4xl font-extrabold text-emerald-500/90 mb-4 tracking-tight group-hover:scale-105 transition-transform duration-300">
                    {b.id}
                  </div>

                  {/* Title */}
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-3 group-hover:text-emerald-700 transition-colors">
                    {b.title}
                  </h3>

                  {/* Description */}
                  <p className="text-slate-500 text-sm leading-relaxed">
                    {b.description}
                  </p>
                </div>

                {/* Read More Link */}
                <div className="mt-6 pt-4 border-t border-slate-100/80">
                  <Link
                    href="/courses"
                    className="inline-flex items-center text-xs font-semibold text-emerald-600 hover:text-emerald-800 transition-colors group/link"
                  >
                    Read More
                    <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover/link:translate-x-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}