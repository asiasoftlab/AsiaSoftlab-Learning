"use client";
import React, { useRef } from "react";
import { Award, X, Printer, Globe } from "lucide-react";

export interface CertificateData {
  id: string;
  courseTitle: string;
  recipientName: string;
  score?: number;
  issuedDate: string | Date;
  certificateNumber: string;
  issuer?: string;
  ceoName?: string;
  ceoTitle?: string;
}

interface CertificateModalProps {
  certificate: CertificateData;
  onClose: () => void;
}

export function CertificateModal({ certificate, onClose }: CertificateModalProps) {
  const printRef = useRef<HTMLDivElement>(null);
  const formattedDate = () => {
    try {
      if (!certificate.issuedDate) {
        return new Date().toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
      }
      let d: Date;
      const dateVal = certificate.issuedDate as any;
      if (typeof dateVal === "object") {
        if (dateVal instanceof Date) {
          d = dateVal;
        } else if (typeof dateVal.toDate === "function") {
          d = dateVal.toDate();
        } else if ("_seconds" in dateVal && typeof dateVal._seconds === "number") {
          d = new Date(dateVal._seconds * 1000);
        } else if ("seconds" in dateVal && typeof dateVal.seconds === "number") {
          d = new Date(dateVal.seconds * 1000);
        } else {
          d = new Date(dateVal);
        }
      } else if (typeof dateVal === "number") {
        d = new Date(dateVal > 1e11 ? dateVal : dateVal * 1000);
      } else {
        d = new Date(dateVal);
      }

      if (isNaN(d.getTime())) {
        return new Date().toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
      }

      return d.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-6xl w-full flex flex-col shadow-2xl overflow-hidden border border-slate-200 my-auto">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white border-b border-slate-800 print:hidden">
          <div className="flex items-center gap-2.5">
            <h2 className="text-base font-bold tracking-tight">ASVA Official Certificate of Completion</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-[#002b5b] hover:bg-[#001f42] text-amber-300 border border-amber-400/40 px-5 py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm cursor-pointer"
            >
              Print / Save as PDF
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Preview Wrapper */}
        <div className="p-4 sm:p-8 bg-slate-200/70 overflow-x-auto flex justify-center items-center">
          {/* Main Certificate Container (A4 Aspect Ratio: 1040px x 735px) */}
          <div
            ref={printRef}
            id="printable-certificate"
            className="w-[1040px] h-[735px] bg-white text-slate-900 relative shadow-2xl flex flex-col justify-between select-none overflow-hidden flex-shrink-0"
            style={{
              fontFamily: "'Montserrat', sans-serif",
            }}
          >
            {/* Double Golden Border Frame */}
            <div className="absolute inset-3.5 pointer-events-none border-[1.5px] border-[#c59b27] rounded-[4px] z-20">
              <div className="absolute inset-[4px] border border-[#c59b27]/50 rounded-[2px]" />
            </div>

            {/* Left Vertical Side Text */}
            <div className="absolute left-[-220px] top-70 -translate-y-1/2 -rotate-90 z-20 pointer-events-none">
              <span className="text-[10px] font-bold tracking-[0.42em] text-[#002b5b]/70 uppercase whitespace-nowrap">
                KNOWLEDGE &nbsp;•&nbsp; OPPORTUNITY &nbsp;•&nbsp; A BRIGHTER TOMORROW
              </span>
            </div>

            {/* Top-Right Decorative Navy Wave with Gold Accents */}
            <div className="absolute -top-1 -right-1 w-72 h-64 pointer-events-none z-10">
              <svg viewBox="0 0 250 220" className="w-full h-full" fill="none">
                {/* Main Navy Shape */}
                <path
                  d="M40,0 C120,40 180,110 250,220 L250,0 Z"
                  fill="#002b5b"
                />
                {/* Outer Gold Ribbon Stripe */}
                <path
                  d="M15,0 C100,45 165,115 235,220 L250,220 C180,110 120,40 40,0 Z"
                  fill="#c59b27"
                />
                <path
                  d="M0,0 C85,45 150,115 220,220 L235,220 C165,115 100,45 15,0 Z"
                  fill="#e5c058"
                  opacity="0.6"
                />
              </svg>
            </div>

            {/* Bottom-Left Decorative Navy Wave with Gold Accents & Website */}
            <div className="absolute -bottom-1 -left-1 w-76 h-64 pointer-events-none z-10">
              <svg viewBox="0 0 260 220" className="w-full h-full" fill="none">
                {/* Main Navy Shape */}
                <path
                  d="M0,0 C60,110 125,180 260,220 L0,220 Z"
                  fill="#002b5b"
                />
                {/* Gold Accent Stripe */}
                <path
                  d="M0,0 C70,110 135,180 260,220 L260,205 C135,165 70,95 0,0 Z"
                  fill="#c59b27"
                />
                <path
                  d="M0,15 C70,125 135,195 260,220 L260,212 C135,187 70,117 0,7 Z"
                  fill="#e5c058"
                  opacity="0.6"
                />
              </svg>
              {/* Website link over bottom-left wave */}
              <div className="absolute bottom-5 left-7 flex items-center gap-2 text-white text-xs font-base tracking-wider z-20 pointer-events-auto">
                <span>www.asiasoftlabvirtualacademy.com</span>
              </div>
            </div>

            {/* Faint Tree / Logo Watermark in Right Background */}
            <div className="absolute top-16 w-full h-[500px] pointer-events-none opacity-[0.08] z-0 flex items-center justify-center">
              <img
                src="/Home/logo ASVA.png"
                alt=""
                className="w-full h-auto object-contain"
              />
            </div>

            {/* ================= TOP SECTION ================= */}
            <div className="pt-8 px-12 flex justify-between items-start z-10">
              {/* Brand Logo & Name from /Home/logo ASVA.png */}
              <div className="flex items-center">
                <img
                  src="/Home/logo ASVA.png"
                  alt="Asia Softlab Virtual Academy"
                  className="h-16 sm:h-18 w-auto object-contain"
                />
              </div>

              {/* Header Right Slogan */}
              <div className="flex items-center gap-4 text-right pr-18 pt-2">
                <div className="flex flex-col text-[9.5px] font-black tracking-[0.28em] text-[#002b5b] uppercase leading-relaxed text-right">
                  <span>LEARN</span>
                  <span>GROW</span>
                  <span className="relative inline-block">
                    BELONG
                    <span className="block h-[2px] bg-[#c59b27] w-8 ml-auto mt-0.5" />
                  </span>
                </div>
                <div className="w-[1.5px] h-11 bg-slate-300" />
                <div className="text-[11px] font-semibold text-slate-700 leading-snug text-left max-w-[105px]">
                  Skills for a Brighter Tomorrow
                </div>
              </div>
            </div>

            {/* ================= CENTER CONTENT ================= */}
            <div className="flex flex-col items-center text-center px-16 z-10 -mt-2 space-y-2.5">
              {/* Big Title */}
              <div>
                <h1
                  className="text-5xl sm:text-[54px] font-extrabold tracking-[0.16em] text-[#002b5b] uppercase"
                  style={{ fontFamily: "'Cinzel', 'Playfair Display', Georgia, serif" }}
                >
                  CERTIFICATE
                </h1>
                {/* Subtitle with Flanking Gold Lines */}
                <div className="flex items-center justify-center gap-4 mt-1.5">
                  <div className="w-24 h-[2px] bg-[#c59b27]" />
                  <span className="text-sm sm:text-[15px] font-extrabold tracking-[0.38em] text-[#c59b27] uppercase">
                    OF COMPLETION
                  </span>
                  <div className="w-24 h-[2px] bg-[#c59b27]" />
                </div>
              </div>

              {/* Certification Subtext */}
              <p className="text-base sm:text-[17px] text-slate-700 font-medium pt-1">
                This is to certify that
              </p>

              {/* Recipient's Name in Elegant Calligraphy Script */}
              <div className="w-full max-w-lg pt-1 pb-1">
                <div
                  className="text-6xl sm:text-7xl font-normal text-[#002b5b] tracking-wide select-text py-1 leading-tight"
                  style={{
                    fontFamily: "'Alex Brush', 'Playfair Display', cursive, serif",
                  }}
                >
                  {certificate.recipientName}
                </div>
                <div className="w-full h-[1.5px] bg-[#c59b27] mt-1" />
              </div>

              {/* Completion Statement */}
              <p className="text-sm sm:text-[15px] text-slate-600 font-medium pt-0.5">
                has successfully completed the online course
              </p>

              {/* Course Title */}
              <h2 className="text-2xl sm:text-3xl font-black text-[#002b5b] tracking-tight max-w-2xl leading-tight">
                {certificate.courseTitle}
              </h2>

              {/* Detailed Appreciation Text */}
              <div className="max-w-xl text-xs sm:text-[13px] text-slate-600 font-normal leading-relaxed">
                offered by <strong className="font-bold text-slate-800">ASVA (Asia Softlab Virtual Academy)</strong>.
                We appreciate your commitment to learning and congratulate you on achieving this milestone.
              </div>
            </div>

            {/* ================= BOTTOM SECTION ================= */}
            <div className="px-14 pb-7 z-10">
              <div className="flex items-end justify-between relative">
                {/* Bottom Left: Date of Completion */}
                <div className="text-center w-48 ml-32">
                  <div className="text-sm sm:text-[15px] font-semibold text-slate-800 pb-1">
                    {formattedDate()}
                  </div>
                  <div className="w-full h-[1.5px] bg-[#c59b27]" />
                  <div className="text-[10px] font-extrabold tracking-[0.20em] text-[#002b5b] uppercase mt-1.5">
                    DATE OF COMPLETION
                  </div>
                </div>

                {/* Bottom Center-Right: Signature & Academic Director */}
                <div className="text-center w-56">
                  {/* Handwritten Signature */}
                  <div
                    className="text-3xl sm:text-4xl text-[#002b5b] pb-0.5"
                    style={{
                      fontFamily: "'Alex Brush', 'Playfair Display', cursive",
                    }}
                  >
                    {certificate.ceoName || "Mr. Nishadh S"}
                  </div>
                  <div className="w-full h-[1.5px] bg-[#c59b27]" />
                  <div className="text-[10.5px] font-extrabold tracking-[0.16em] text-[#002b5b] uppercase mt-1.5">
                    ACADEMIC DIRECTOR
                  </div>
                  <div className="text-[9.5px] font-bold text-slate-800 uppercase mt-0.5">
                    ASVA
                  </div>
                  <div className="text-[8px] font-semibold text-slate-600 uppercase tracking-tight">
                    ASIA SOFTLAB VIRTUAL ACADEMY
                  </div>
                </div>

                {/* Bottom Far-Right: QR Code & ID */}
                <div className="flex flex-col items-center text-center">
                  {/* High Contrast QR Code SVG */}
                  <div className="w-16 h-16 bg-white p-1 border border-slate-300 rounded shadow-xs flex items-center justify-center">
                    <svg viewBox="0 0 100 100" className="w-full h-full fill-slate-900">
                      
                    </svg>
                  </div>
                  <div className="text-[9.5px] font-bold text-slate-900 mt-1">
                    Scan to Verify
                  </div>
                  <div className="text-[8.5px] text-slate-500 font-medium">
                    Certificate ID:
                  </div>
                  <div className="text-[9px] font-bold text-slate-900 font-mono">
                    {certificate.certificateNumber || "ASVA2025-001234"}
                  </div>
                </div>
              </div>

              {/* Bottom Right Footer Slogan */}
              <div className="flex justify-end items-center gap-2.5 pt-2 pr-1">
                <span className="text-[10px] font-semibold text-slate-700">
                  Learn Today. Build Tomorrow.
                </span>
                <div className="w-8 h-[1.5px] bg-[#c59b27]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Global font import and print CSS */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Alex+Brush&family=Cinzel:wght@600;700;800;900&family=Montserrat:wght@400;500;600;700;800;900&display=swap');

        @media print {
          body * {
            visibility: hidden;
          }
          #printable-certificate,
          #printable-certificate * {
            visibility: visible;
          }
          #printable-certificate {
            position: fixed;
            left: 0;
            top: 0;
            width: 100vw;
            height: 100vh;
            margin: 0;
            padding: 0;
            box-shadow: none !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>
    </div>
  );
}
