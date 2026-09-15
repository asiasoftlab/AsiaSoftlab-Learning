import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | Asia Softlab Virtual Academy (ASVA)',
  description: 'Privacy Policy describing how Asia Softlab Virtual Academy collects, uses, protects, and handles your personal data.',
};

export default function PrivacyPage() {
  const sections = [
    {
      id: 'information-we-collect',
      title: '1. Information We Collect',
      content: (
        <>
          <p className="text-slate-600 leading-relaxed mb-3">
            At <strong className="text-slate-900 font-semibold">Asia Softlab Virtual Academy (ASVA)</strong>, powered by <strong className="text-slate-900 font-semibold">Asia Softlab Pvt. Ltd.</strong>, we collect information to provide and enhance our educational services, courses, and digital tools.
          </p>
          <p className="text-slate-600 leading-relaxed mb-2 font-medium text-slate-800">
            The types of personal data we may collect include:
          </p>
          <ul className="space-y-2 text-slate-600 list-disc list-inside mb-3">
            <li><strong className="text-slate-900">Account & Profile Information:</strong> Name, email address, contact phone number, educational/professional background, and profile credentials.</li>
            <li><strong className="text-slate-900">Learning & Assessment Data:</strong> Course progress, quiz scores, project submissions, attendance in live sessions, and certification records.</li>
            <li><strong className="text-slate-900">Transaction & Billing Details:</strong> Payment history, invoice data, and transaction identifiers (sensitive payment details are processed directly by PCI-compliant payment gateways).</li>
            <li><strong className="text-slate-900">Usage & Technical Data:</strong> IP address, device specifications, browser type, operating system, log files, and interaction with our platform modules.</li>
          </ul>
        </>
      ),
    },
    {
      id: 'how-we-use-information',
      title: '2. How We Use Your Information',
      content: (
        <>
          <p className="text-slate-600 leading-relaxed mb-3">
            We utilize the collected information for specific, lawful educational and operational purposes:
          </p>
          <ul className="space-y-2 text-slate-600 list-disc list-inside mb-3">
            <li>To deliver, maintain, and personalize courses, virtual simulations, and laboratory workflows.</li>
            <li>To verify your identity, process enrollments, and issue verifiable digital credentials.</li>
            <li>To communicate crucial updates, course announcements, security alerts, and technical support notices.</li>
            <li>To improve our curriculum, user experience, and platform performance through aggregated analytics.</li>
            <li>To comply with regulatory standards and protect against unauthorized or malicious activities.</li>
          </ul>
        </>
      ),
    },
    {
      id: 'data-sharing-disclosure',
      title: '3. Data Sharing & Third-Party Disclosure',
      content: (
        <>
          <p className="text-slate-600 leading-relaxed mb-3">
            We do not sell, rent, or trade your personal information to third parties for commercial advertising. We only share information under strict confidentiality circumstances:
          </p>
          <ul className="space-y-2 text-slate-600 list-disc list-inside mb-3">
            <li><strong className="text-slate-900">Trusted Service Providers:</strong> Cloud hosting, encrypted payment gateways, automated mailing systems, and customer support infrastructure.</li>
            <li><strong className="text-slate-900">Institutional / Corporate Sponsors:</strong> If your access is sponsored by an employer or academic institution, relevant progress and certification data may be shared with that sponsor.</li>
            <li><strong className="text-slate-900">Legal Requirements:</strong> When required to comply with court orders, applicable law, or to protect the vital rights and security of ASVA and its users.</li>
          </ul>
        </>
      ),
    },
    {
      id: 'data-security',
      title: '4. Data Security & Storage',
      content: (
        <>
          <p className="text-slate-600 leading-relaxed mb-3">
            We implement industry-standard administrative, technical, and physical safeguards to protect your personal data against unauthorized access, loss, misuse, alteration, or destruction.
          </p>
          <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-xl text-emerald-950 text-sm leading-relaxed mb-3">
            <strong className="font-semibold block mb-1">Security Protocols:</strong>
            All network communication is secured using Transport Layer Security (TLS/SSL) encryption. Access to user records is strictly restricted based on role-based authentication controls.
          </div>
          <p className="text-slate-600 leading-relaxed">
            While we take rigorous measures, no electronic transmission over the internet or storage system is 100% immune to potential risks. We urge you to use strong passwords and keep credentials confidential.
          </p>
        </>
      ),
    },
    {
      id: 'cookies-tracking',
      title: '5. Cookies & Tracking Technologies',
      content: (
        <>
          <p className="text-slate-600 leading-relaxed mb-3">
            ASVA uses cookies, local storage, and similar analytical technologies to remember your preferences, keep you logged in, analyze web traffic, and enhance your navigation experience.
          </p>
          <p className="text-slate-600 leading-relaxed">
            You can configure your browser to refuse cookies or alert you when cookies are being sent. Note that disabling cookies may affect the functionality and accessibility of certain interactive course features.
          </p>
        </>
      ),
    },
    {
      id: 'your-privacy-rights',
      title: '6. Your Privacy Rights & Choices',
      content: (
        <>
          <p className="text-slate-600 leading-relaxed mb-3">
            Depending on your jurisdiction and applicable data protection regulations, you have rights concerning your personal information:
          </p>
          <ul className="space-y-2 text-slate-600 list-disc list-inside mb-3">
            <li><strong className="text-slate-900">Access & Rectification:</strong> Review and update your personal information through your account settings or by contacting us.</li>
            <li><strong className="text-slate-900">Data Deletion:</strong> Request the deletion of your account and associated personal data, subject to legal compliance and record retention obligations.</li>
            <li><strong className="text-slate-900">Communication Preferences:</strong> Opt out of promotional emails at any time using the unsubscribe link provided in our newsletters.</li>
          </ul>
        </>
      ),
    },
    {
      id: 'data-retention',
      title: '7. Data Retention Policy',
      content: (
        <p className="text-slate-600 leading-relaxed">
          We retain your personal information for as long as your account is active or as necessary to fulfill course delivery, verify credentials, resolve disputes, and enforce our legal obligations. When data is no longer required, it is securely deleted or anonymized.
        </p>
      ),
    },
    {
      id: 'policy-updates',
      title: '8. Changes to Privacy Policy',
      content: (
        <p className="text-slate-600 leading-relaxed">
          We may update this Privacy Policy from time to time to reflect modifications in our services, technological advancements, or legal requirements. Updated policies will be posted here with an updated &quot;Last updated&quot; date.
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
              Privacy <span className="text-[#e28413]">Policy</span>
            </h1>

            <p className="text-slate-600 text-base md:text-lg leading-relaxed">
              We value your trust and are committed to protecting your personal information and respecting your privacy across all Asia Softlab Virtual Academy services.
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
                    Jump directly to any section of our privacy policy
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
                      Privacy Inquiries?
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      If you have questions about your personal data or privacy rights, please reach out.
                    </p>
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors group"
                    >
                      Contact Privacy Team
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </aside>

            {/* Privacy Content Body */}
            <div className="lg:col-span-8 order-1 lg:order-2 space-y-10">
              {/* Privacy Sections */}
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
                      Contact Data Protection & Privacy Team
                    </h3>
                    <p className="text-xs text-slate-500">
                      For any privacy-related requests, data updates, or queries
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
