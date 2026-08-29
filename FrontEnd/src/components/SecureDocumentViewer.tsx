"use client";

import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { X, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Set up worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface SecureDocumentViewerProps {
  url: string;
  title: string;
  onClose: () => void;
}

export function SecureDocumentViewer({ url, title, onClose }: SecureDocumentViewerProps) {
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [loading, setLoading] = useState(true);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-900/95 backdrop-blur-sm animate-fade-in" onContextMenu={(e) => e.preventDefault()}>
      {/* Header */}
      <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 shrink-0 bg-slate-900">
        <h3 className="text-white font-medium truncate max-w-md">{title}</h3>
        <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-2 rounded-full cursor-pointer">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Viewer Area */}
      <div className="flex-1 overflow-auto flex justify-center p-8 select-none">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
          </div>
        )}
        <div className="bg-white rounded shadow-2xl relative">
          {/* Transparent overlay to prevent right click save-as on image/canvas if any slips through */}
          <div className="absolute inset-0 z-10" />
          <Document file={url} onLoadSuccess={onDocumentLoadSuccess} loading={null}>
            <Page pageNumber={pageNumber} renderTextLayer={false} renderAnnotationLayer={false} className="z-0 relative" />
          </Document>
        </div>
      </div>

      {/* Footer Controls */}
      <div className="h-16 border-t border-white/10 flex items-center justify-center gap-6 shrink-0 bg-slate-900">
        <button
          disabled={pageNumber <= 1}
          onClick={() => setPageNumber(prev => prev - 1)}
          className="text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors p-2"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <span className="text-slate-300 font-medium text-sm">
          Page {pageNumber} of {numPages || '-'}
        </span>
        <button
          disabled={pageNumber >= (numPages || 1)}
          onClick={() => setPageNumber(prev => prev + 1)}
          className="text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors p-2"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
