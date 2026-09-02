"use client";
export default function MessagesPage() {

  return (
    <div className="flex flex-col animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
             Messages
          </h1>
          <p className="text-slate-500 mt-1">View, download, and share your verified accomplishments.</p>
        </div>
      </div>
      <div className="h-[calc(100vh-6rem)] -m-6 flex flex-col items-center justify-center p-4 relative overflow-hidden bg-slate-50/50">
      <div className="relative z-5 flex flex-col items-center max-w-xl text-center bg-white/80 backdrop-blur-xl p-15 rounded-lg shadow-sm border border-slate-100">
        <h2 className="text-3xl font-bold text-slate-800 mb-4 tracking-tight">
          Messages Page Under Maintenance
        </h2>

        <p className="text-slate-500 mb-8 leading-relaxed">
          We are currently upgrading the Messages page to bring you a premium real-time experience.
          Please check back later!
        </p>
      </div>
    </div>
    </div>
  );
}
