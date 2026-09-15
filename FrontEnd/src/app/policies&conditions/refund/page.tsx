import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';

export const metadata = {
  title: 'Refund & Cancellation Policy | Asia Softlab Virtual Academy (ASVA)',
  description: 'Refund and cancellation guidelines for course enrollments, certifications, workshops, and digital learning subscriptions at Asia Softlab Virtual Academy.',
};

export default function RefundPage() {
  const sections = [
    {
      id: 'overview',
      title: '1. Overview & Commitment',
      content: (
        <>
          <p className="text-slate-600 leading-relaxed mb-3">
            At <strong className="text-slate-900 font-semibold">Asia Softlab Virtual Academy (ASVA)</strong>, an educational platform powered by <strong className="text-slate-900 font-semibold">Asia Softlab Pvt. Ltd.</strong>, we strive to deliver premium, practical industry-aligned education in drone technology, GIS, surveying, remote sensing, and emerging technology domains.
          </p>
          <p className="text-slate-600 leading-relaxed">
            We understand that circumstances may arise where you need to cancel an enrollment or request a refund. This Refund Policy outlines the eligibility criteria, timelines, and procedures for such requests.
          </p>
        </>
      ),
    },
    {
      id: 'self-paced-courses',
      title: '2. Self-Paced Online Courses',
      content: (
        <>
          <p className="text-slate-600 leading-relaxed mb-3">
            For self-paced pre-recorded courses and digital learning bundles, refund requests are evaluated based on course progress:
          </p>
          <ul className="space-y-2 text-slate-600 list-disc list-inside mb-3">
            <li><strong className="text-slate-900">7-Day Refund Window:</strong> You may request a full refund within 7 calendar days from the date of purchase, provided you have accessed or completed less than 20% of the course modules.</li>
            <li><strong className="text-slate-900">Non-Refundable Condition:</strong> If you have completed 20% or more of the course, downloaded proprietary software datasets, or claimed a course completion certificate, the purchase becomes non-refundable.</li>
          </ul>
        </>
      ),
    },
    {
      id: 'instructor-led-bootcamps',
      title: '3. Live Instructor-Led Bootcamps & Workshops',
      content: (
        <>
          <p className="text-slate-600 leading-relaxed mb-3">
            For live training cohorts, virtual interactive workshops, and industrial bootcamp programs:
          </p>
          <ul className="space-y-2 text-slate-600 list-disc list-inside mb-3">
            <li><strong className="text-slate-900">Before Cohort Start:</strong> Cancellations made at least 48 hours prior to the official batch start date are eligible for a 100% refund (minus standard payment gateway transaction charges).</li>
            <li><strong className="text-slate-900">After First Session:</strong> A prorated refund or cohort batch transfer may be requested within 24 hours following the completion of the first live class session.</li>
            <li><strong className="text-slate-900">After Second Session:</strong> No refunds are issued after the second live session has commenced due to seat reservation and instructor resource allocations.</li>
          </ul>
        </>
      ),
    },
    {
      id: 'certifications-and-exams',
      title: '4. Certification Assessment & Exam Fees',
      content: (
        <>
          <p className="text-slate-600 leading-relaxed mb-3">
            Fees paid specifically for stand-alone certification assessments, exam retakes, or industrial evaluation vouchers are non-refundable once the examination portal or voucher credentials have been activated or attempted.
          </p>
          <p className="text-slate-600 leading-relaxed">
            Unused certification exam vouchers may be rescheduled to another available date slot within 60 days of purchase upon written notice to our support team.
          </p>
        </>
      ),
    },
    {
      id: 'cancellation-by-asva',
      title: '5. Program Cancellation by ASVA',
      content: (
        <>
          <p className="text-slate-600 leading-relaxed mb-3">
            In rare situations where ASVA must reschedule or cancel a live workshop or course cohort due to unforeseen operational or technical circumstances:
          </p>
          <ul className="space-y-2 text-slate-600 list-disc list-inside mb-3">
            <li>You will be offered a full 100% refund of the fee paid, OR</li>
            <li>You can choose free transfer into the next upcoming cohort or an equivalent course of your preference.</li>
          </ul>
        </>
      ),
    },
    {
      id: 'how-to-request-refund',
      title: '6. How to Request a Refund',
      content: (
        <>
          <p className="text-slate-600 leading-relaxed mb-3">
            To submit a refund or cancellation request, please contact our billing team with the following details:
          </p>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 mb-3 space-y-1.5 text-sm text-slate-700">
            <p>1. Registered Student Full Name and Account Email Address</p>
            <p>2. Course / Program Name and Order / Invoice ID</p>
            <p>3. Date of Purchase & Payment Receipt</p>
            <p>4. Reason for the cancellation or refund request</p>
          </div>
          <p className="text-slate-600 leading-relaxed">
            Send your request via email to{' '}
            <a
              href="mailto:billing@asiasoftlab.in"
              className="text-emerald-600 hover:text-emerald-700 font-medium underline underline-offset-2"
            >
              billing@asiasoftlab.in
            </a>
            {' '}with copy to{' '}
            <a
              href="mailto:support@asiasoftlab.in"
              className="text-emerald-600 hover:text-emerald-700 font-medium underline underline-offset-2"
            >
              support@asiasoftlab.in
            </a>
            .
          </p>
        </>
      ),
    },
    {
      id: 'refund-processing-time',
      title: '7. Processing Timeline & Mode of Refund',
      content: (
        <>
          <p className="text-slate-600 leading-relaxed mb-3">
            Once approved, refunds are processed back to the original payment method (Credit/Debit Card, Net Banking, UPI, or Wallet) used during transaction:
          </p>
          <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-xl text-emerald-950 text-sm leading-relaxed mb-3">
            <strong className="font-semibold block mb-1">Estimated Timeline:</strong>
            Refund approvals are verified within 2 to 3 business days. The credited amount will reflect in your bank or card account within 5 to 7 business days, depending on your financial institution.
          </div>
        </>
      ),
    },
    {
      id: 'policy-modifications',
      title: '8. Policy Revisions',
      content: (
        <p className="text-slate-600 leading-relaxed">
          Asia Softlab reserves the right to modify or amend this Refund Policy at any time. Any changes will be published on this page with an updated timestamp.
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
              Refund <span className="text-[#e28413]">Policy</span>
            </h1>

            <p className="text-slate-600 text-base md:text-lg leading-relaxed">
              Transparent terms and clear guidelines on cancellations, batch transfers, and refunds across Asia Softlab Virtual Academy programs.
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
                    Jump directly to any section of our refund policy
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
                      Billing Support
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Need help regarding a payment, invoice, or refund request?
                    </p>
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors group"
                    >
                      Contact Billing Team
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </aside>

            {/* Refund Content Body */}
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
                      Contact Billing & Accounts
                    </h3>
                    <p className="text-xs text-slate-500">
                      For payment inquiries, refunds, and batch adjustments
                    </p>
                  </div>
                </div>

                <p className="text-slate-600 text-sm leading-relaxed">
                  Asia Softlab Pvt. Ltd.<br />
                  Email:{' '}
                  <a
                    href="mailto:billing@asiasoftlab.in"
                    className="text-emerald-600 hover:text-emerald-700 font-medium underline underline-offset-2"
                  >
                    billing@asiasoftlab.in
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
                    href="/cookie"
                    className="text-xs font-semibold text-slate-700 hover:text-emerald-600 transition-colors inline-flex items-center gap-1"
                  >
                    Cookie Policy
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
