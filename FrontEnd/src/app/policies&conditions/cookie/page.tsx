import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';

export const metadata = {
  title: 'Cookie Policy | Asia Softlab Virtual Academy (ASVA)',
  description: 'Cookie Policy explaining how Asia Softlab Virtual Academy uses cookies and similar technologies to enhance your learning experience.',
};

export default function CookiePage() {
  const sections = [
    {
      id: 'what-are-cookies',
      title: '1. What Are Cookies?',
      content: (
        <>
          <p className="text-slate-600 leading-relaxed mb-3">
            Cookies are small text files placed on your device (computer, tablet, or mobile phone) when you visit websites. They are widely used by web platforms to make websites work efficiently, remember user preferences, and provide analytical reporting.
          </p>
          <p className="text-slate-600 leading-relaxed">
            At <strong className="text-slate-900 font-semibold">Asia Softlab Virtual Academy (ASVA)</strong>, an initiative powered by <strong className="text-slate-900 font-semibold">Asia Softlab Pvt. Ltd.</strong>, we use cookies and similar technologies (such as local storage and session storage) to provide seamless access to courses, simulations, and interactive learning tools.
          </p>
        </>
      ),
    },
    {
      id: 'types-of-cookies',
      title: '2. Types of Cookies We Use',
      content: (
        <>
          <p className="text-slate-600 leading-relaxed mb-3">
            We use both first-party cookies (set directly by ASVA) and third-party cookies (set by our trusted service partners) categorized as follows:
          </p>
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
              <h4 className="font-semibold text-slate-900 text-sm mb-1">
                A. Strictly Necessary / Essential Cookies
              </h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                These cookies are crucial for the basic operation of the ASVA platform. They enable you to log into secure student dashboards, navigate between lessons, maintain active sessions, and access course content. Without these, the platform cannot function properly.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
              <h4 className="font-semibold text-slate-900 text-sm mb-1">
                B. Performance & Analytics Cookies
              </h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                These cookies help us collect aggregated, anonymous data on how learners interact with our pages, which courses are visited most frequently, and whether users encounter error pages. This allows us to continuously optimize page speed, layout, and stability.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
              <h4 className="font-semibold text-slate-900 text-sm mb-1">
                C. Functionality & Preference Cookies
              </h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                These cookies enable our platform to remember your custom preferences—such as language settings, volume controls in video players, theme mode, and saved progress in interactive simulators.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
              <h4 className="font-semibold text-slate-900 text-sm mb-1">
                D. Security Cookies
              </h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Used to identify security risks, verify session tokens, prevent CSRF attacks, and protect student accounts against unauthorized access attempts.
              </p>
            </div>
          </div>
        </>
      ),
    },
    {
      id: 'third-party-cookies',
      title: '3. Third-Party Cookies & Integrations',
      content: (
        <>
          <p className="text-slate-600 leading-relaxed mb-3">
            In specific parts of our platform, third-party services may set cookies to power embedded services, video streaming, interactive map layers (GIS datasets), and secure payment processing.
          </p>
          <ul className="space-y-2 text-slate-600 list-disc list-inside mb-3">
            <li><strong className="text-slate-900">Payment Processors:</strong> Encrypted payment gateways use cookies for fraud prevention and transaction validation.</li>
            <li><strong className="text-slate-900">Video & Simulator Streaming:</strong> Video hosting servers maintain playback position and video quality optimization.</li>
            <li><strong className="text-slate-900">Analytics Providers:</strong> Aggregated analytical tools help us understand course navigation and drop-off points.</li>
          </ul>
        </>
      ),
    },
    {
      id: 'how-to-manage-cookies',
      title: '4. How You Can Manage Cookies',
      content: (
        <>
          <p className="text-slate-600 leading-relaxed mb-3">
            You have the right to choose whether to accept or decline cookies. Most web browsers automatically accept cookies by default, but you can modify your browser settings to decline or delete them at any time.
          </p>
          <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-xl text-amber-900 text-sm leading-relaxed mb-3">
            <strong className="font-semibold block mb-1">Please Note:</strong>
            Disabling strictly necessary cookies may restrict your access to interactive labs, quizzes, and logged-in student dashboard features.
          </div>
          <p className="text-slate-600 leading-relaxed">
            To manage cookies in common browsers, consult your browser&apos;s help documentation (e.g., Google Chrome, Mozilla Firefox, Apple Safari, or Microsoft Edge).
          </p>
        </>
      ),
    },
    {
      id: 'cookie-duration',
      title: '5. Cookie Duration & Expiry',
      content: (
        <>
          <p className="text-slate-600 leading-relaxed mb-3">
            Cookies on our platform fall into two categories based on lifespan:
          </p>
          <ul className="space-y-2 text-slate-600 list-disc list-inside">
            <li><strong className="text-slate-900">Session Cookies:</strong> Temporary cookies that remain active only while you browse and are automatically erased when you close your browser.</li>
            <li><strong className="text-slate-900">Persistent Cookies:</strong> Remain stored on your device until they reach their configured expiry date or until you manually clear them.</li>
          </ul>
        </>
      ),
    },
    {
      id: 'updates-to-cookie-policy',
      title: '6. Updates to This Cookie Policy',
      content: (
        <p className="text-slate-600 leading-relaxed">
          We may update this Cookie Policy from time to time in order to reflect changes to the cookies we use or for operational, legal, or regulatory reasons. Please re-visit this page periodically to stay informed about our use of cookies and related technologies.
        </p>
      ),
    },
  ];

  return (
    <div className="bg-white min-h-screen text-slate-800 selection:bg-emerald-100 selection:text-emerald-900">
      {/* HERO SECTION */}
      <section className="relative pt-16 pb-20 md:pt-20 md:pb-24 border-b border-slate-100 overflow-hidden">
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200/90 text-emerald-900 text-xs font-semibold uppercase tracking-wider">
              Legal Documentation
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 leading-[1.18] tracking-tight">
              Cookie <span className="text-[#e28413]">Policy</span>
            </h1>

            <p className="text-slate-600 text-base md:text-lg leading-relaxed">
              Understand how Asia Softlab Virtual Academy uses cookies and related technologies to ensure security, enhance performance, and personalize your digital learning journey.
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
                    Jump directly to any section of our cookie policy
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
                      Cookie Questions?
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      If you have questions about our cookie practices or your browser preferences, reach out to us.
                    </p>
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors group"
                    >
                      Contact Support
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </aside>

            {/* Cookie Content Body */}
            <div className="lg:col-span-8 order-1 lg:order-2 space-y-10">
              {/* Sections */}
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
                      Contact Data & Privacy Team
                    </h3>
                    <p className="text-xs text-slate-500">
                      For any questions or requests regarding our cookie policy
                    </p>
                  </div>
                </div>

                <p className="text-slate-600 text-sm leading-relaxed">
                  Asia Softlab Pvt. Ltd.<br />
                  Email:{' '}
                  <a
                    href="mailto:privacy@asiasoftlab.in"
                    className="text-emerald-600 hover:text-emerald-700 font-medium underline underline-offset-2"
                  >
                    privacy@asiasoftlab.in
                  </a>
                  {' / '}
                  <a
                    href="mailto:support@asiasoftlab.in"
                    className="text-emerald-600 hover:text-emerald-700 font-medium underline underline-offset-2"
                  >
                    support@asiasoftlab.in
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
                    href="/terms"
                    className="text-xs font-semibold text-slate-700 hover:text-emerald-600 transition-colors inline-flex items-center gap-1"
                  >
                    Terms & Conditions
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                  <span className="text-slate-300">•</span>
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
