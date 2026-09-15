import * as React from 'react';
import Link from 'next/link';
import { FileText, ShieldCheck, UserCheck, BookOpen, CreditCard, AlertCircle, Scale, Mail, ArrowRight, Clock, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'Terms & Conditions | Asia Softlab Virtual Academy (ASVA)',
  description: 'Terms and Conditions governing the use of Asia Softlab Virtual Academy services, courses, certifications, and digital learning platforms.',
};

export default function TermsPage() {
  const sections = [
    {
      id: 'acceptance',
     
      title: '1. Acceptance of Terms',
      content: (
        <>
          <p className="text-slate-600 leading-relaxed mb-3">
            By accessing or using the platform, websites, mobile applications, courses, or services provided by{' '}
            <strong className="text-slate-900 font-semibold">Asia Softlab Virtual Academy (ASVA)</strong>, an initiative powered by{' '}
            <strong className="text-slate-900 font-semibold">Asia Softlab Pvt. Ltd.</strong>, you acknowledge that you have read, understood, and agreed to be bound by these Terms and Conditions.
          </p>
          <p className="text-slate-600 leading-relaxed">
            If you do not agree with any part of these terms, you must discontinue your use of our services immediately.
          </p>
        </>
      ),
    },
    {
      id: 'account-registration',
     
      title: '2. User Accounts & Security',
      content: (
        <>
          <p className="text-slate-600 leading-relaxed mb-3">
            To access certain features, course materials, and simulations on ASVA, you must create a registered account. When registering, you agree to:
          </p>
          <ul className="space-y-2 text-slate-600 list-disc list-inside mb-3">
            <li>Provide true, accurate, current, and complete information about yourself.</li>
            <li>Maintain and promptly update your account information.</li>
            <li>Safeguard your login credentials and prevent unauthorized access.</li>
            <li>Promptly notify ASVA of any security breach or unauthorized use of your account.</li>
          </ul>
          <p className="text-slate-600 leading-relaxed">
            You are entirely responsible for all activities that occur under your account. Sharing account access with third parties without authorization is strictly prohibited.
          </p>
        </>
      ),
    },
    {
      id: 'courses-intellectual-property',
      
      title: '3. Intellectual Property Rights & Course Access',
      content: (
        <>
          <p className="text-slate-600 leading-relaxed mb-3">
            All educational curriculum, video lectures, drone mission training materials, GIS datasets, interactive quizzes, documentation, software tools, graphics, and logos made available on ASVA are the intellectual property of <strong className="text-slate-900 font-semibold">Asia Softlab Pvt. Ltd.</strong> and its licensors.
          </p>
          <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-xl text-amber-900 text-sm leading-relaxed mb-3">
            <strong className="font-semibold block mb-1">Limited License:</strong>
            You are granted a personal, non-exclusive, non-transferable, revocable license to access and complete courses for your own personal educational or authorized professional learning.
          </div>
          <p className="text-slate-600 leading-relaxed">
            You may not copy, record, reproduce, redistribute, broadcast, sell, reverse engineer, or exploit any course materials or proprietary datasets without prior written consent from Asia Softlab.
          </p>
        </>
      ),
    },
    {
      id: 'payments-refunds',
      
      title: '4. Payments, Pricing & Refund Policy',
      content: (
        <>
          <p className="text-slate-600 leading-relaxed mb-3">
            Course fees, training workshops, and subscription pricing are displayed clearly on the platform and are subject to change at ASVA&apos;s discretion.
          </p>
          <ul className="space-y-2 text-slate-600 list-disc list-inside mb-3">
            <li>All payments must be completed through our authorized and encrypted payment gateways.</li>
            <li>Refund requests are subject to our specific Course Refund Policy applicable at the time of purchase.</li>
            <li>Certifications will only be issued upon verified full settlement of applicable course fees and successful completion of assessments.</li>
          </ul>
        </>
      ),
    },
    {
      id: 'code-of-conduct',
    
      title: '5. Student Code of Conduct',
      content: (
        <>
          <p className="text-slate-600 leading-relaxed mb-3">
            We foster a professional, collaborative, and inclusive learning ecosystem. Users and learners agree not to:
          </p>
          <ul className="space-y-2 text-slate-600 list-disc list-inside mb-3">
            <li>Engage in academic dishonesty, plagiarism, or fraudulent assessment submissions.</li>
            <li>Post or transmit unlawful, harassing, defamatory, or offensive content in forums and communities.</li>
            <li>Interfere with platform infrastructure, conduct vulnerability scans, or distribute malicious code.</li>
            <li>Misuse practical laboratory assets, simulation toolsets, or industrial data provided for training.</li>
          </ul>
          <p className="text-slate-600 leading-relaxed">
            Violations may result in immediate suspension or termination of account access without entitlement to refund.
          </p>
        </>
      ),
    },
    {
      id: 'certifications-disclaimer',
     
      title: '6. Certifications & Limitation of Liability',
      content: (
        <>
          <p className="text-slate-600 leading-relaxed mb-3">
            ASVA certificates validate course completion and acquired competency according to our training modules. While we deliver practical, industry-aligned curricula in drone technology, GIS, surveying, and software engineering, ASVA does not guarantee employment, promotion, or regulatory licensing unless explicitly specified.
          </p>
          <p className="text-slate-600 leading-relaxed">
            In no event shall Asia Softlab, its directors, employees, or partners be liable for any indirect, consequential, punitive, or special damages arising from the use or inability to use our platform and educational materials.
          </p>
        </>
      ),
    },
    {
      id: 'governing-law',
    
      title: '7. Governing Law & Jurisdiction',
      content: (
        <p className="text-slate-600 leading-relaxed">
          These Terms and Conditions shall be governed by and construed in accordance with the laws of India. Any legal disputes or claims arising out of or related to these terms shall be subject to the exclusive jurisdiction of the competent courts in India.
        </p>
      ),
    },
    {
      id: 'modifications',
      
      title: '8. Changes to Terms',
      content: (
        <p className="text-slate-600 leading-relaxed">
          We reserve the right to modify or replace these Terms and Conditions at any time. Changes will be posted on this page with an updated revision date. Your continued use of the platform after any such updates constitutes your acceptance of the revised terms.
        </p>
      ),
    },
  ];

  return (
    <div className="bg-white min-h-screen text-slate-800 selection:bg-emerald-100 selection:text-emerald-900">
      {/* HERO SECTION */}
      <section className="relative pt-16 pb-20 md:pt-20 md:pb-24  border-b border-slate-100 overflow-hidden">
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200/90 text-emerald-900 text-xs font-semibold uppercase tracking-wider">
              Legal Documentation
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 leading-[1.18] tracking-tight">
              Terms & <span className="text-[#e28413]">Conditions</span>
            </h1>

            <p className="text-slate-600 text-base md:text-lg leading-relaxed">
              Please read these terms and conditions carefully before using the Asia Softlab Virtual Academy platform, courses, certifications, and services.
            </p>

            <div className="flex items-center justify-center gap-2 text-xs md:text-sm text-slate-500 pt-2">
              <Clock className="h-4 w-4 text-emerald-600" />
              <span>
                Last updated : {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
              <span className="mx-2 text-slate-300">•</span>
              <span>Effective across all ASVA platforms</span>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT SECTION */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
            {/* Table of Contents / Sidebar Navigation (Sticky on desktop) */}
            <aside className="lg:col-span-4 order-2 lg:order-1">
              <div className="sticky top-28 bg-slate-50/80 backdrop-blur-sm border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                    
                    Quick Navigation
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Jump directly to any section of our terms
                  </p>
                </div>

                <nav className="space-y-1.5 text-sm">
                  {sections.map((section) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className="block px-3 py-2 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/70 transition-colors font-medium truncate"
                    >
                      {section.title}
                    </a>
                  ))}
                </nav>

                <div className="pt-4 border-t border-slate-200/80">
                  <div className="p-4 bg-white rounded-xl border border-slate-200/60 shadow-xs space-y-3">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900">
                      Need Clarification?
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      If you have questions regarding these terms, our legal team is ready to assist.
                    </p>
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors group"
                    >
                      Contact Legal Support
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </aside>

            {/* Terms Content Body */}
            <div className="lg:col-span-8 order-1 lg:order-2 space-y-10">
              
              {/* Terms Sections */}
              <div className="space-y-10">
                {sections.map((section) => (
                  <div
                    key={section.id}
                    id={section.id}
                    className="scroll-mt-28 p-6 sm:p-8 bg-white rounded-xl border border-slate-100 shadow-sm hover:border-slate-200 transition-colors"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      
                      <h2 className="text-xl font-bold text-slate-900 tracking-tight pt-1">
                        {section.title}
                      </h2>
                    </div>

                    <div className="text-sm md:text-base leading-relaxed pl-0 sm:pl-14">
                      {section.content}
                    </div>
                  </div>
                ))}
              </div>

              {/* Contact Information Box */}
              <div className="p-6 sm:p-8 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-4">
                <div className="flex items-center gap-3">
                  
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Contact Legal & Compliance
                    </h3>
                    <p className="text-xs text-slate-500">
                      For legal notices or inquiries about these terms
                    </p>
                  </div>
                </div>

                <p className="text-slate-600 text-sm leading-relaxed">
                  Asia Softlab Pvt. Ltd.<br />
                  Email:{' '}
                  <a
                    href="mailto:support@asiasoftlab.in"
                    className="text-emerald-600 hover:text-emerald-700 font-medium underline underline-offset-2"
                  >
                    support@asiasoftlab.in
                  </a>
                  {' / '}
                  <a
                    href="mailto:contact@asiasoftlab.in"
                    className="text-emerald-600 hover:text-emerald-700 font-medium underline underline-offset-2"
                  >
                    contact@asiasoftlab.in
                  </a>
                  <br />
                  Website:{' '}
                  <a
                    href="https://www.asiasoftlab.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-600 hover:text-emerald-700 font-medium underline underline-offset-2"
                  >
                    www.asiasoftlab.in
                  </a>
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <Link
                    href="/privacy"
                    className="text-xs font-semibold text-slate-700 hover:text-emerald-600 transition-colors inline-flex items-center gap-1"
                  >
                    Privacy Policy
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                  <span className="text-slate-300">•</span>
                  <Link
                    href="/contact"
                    className="text-xs font-semibold text-slate-700 hover:text-emerald-600 transition-colors inline-flex items-center gap-1"
                  >
                    Contact Us
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
