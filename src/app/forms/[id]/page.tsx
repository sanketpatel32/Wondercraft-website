import React from "react";
import { FormFiller } from "@/components/FormFiller";
import { ShieldAlert } from "lucide-react";

export default async function PublicFormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-cyan-500/30 selection:text-white">
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-900/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-900/10 blur-[120px] pointer-events-none" />

      <div className="mx-auto w-full max-w-xl flex items-center justify-between mb-8 border-b border-zinc-900 pb-4 relative z-10">
        <div className="flex items-center gap-2">
          <img src="/wondercraft.png" alt="Wondercraft Logo" className="w-7 h-7 object-contain rounded drop-shadow-[0_0_8px_rgba(6,182,212,0.2)]" />
          <div>
            <h1 className="text-sm font-bold text-white tracking-wide uppercase">Wondercraft</h1>
            <p className="text-[9px] text-cyan-400 tracking-widest font-semibold uppercase">Data Collection Portal</p>
          </div>
        </div>
        <a
          href="/track-status"
          className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors border border-cyan-500/20 hover:border-cyan-500/40 px-3 py-1.5 rounded-lg bg-cyan-500/5 hover:bg-cyan-500/10 cursor-pointer"
        >
          Track Ticket Status
        </a>
      </div>

      <div className="flex-grow max-w-xl mx-auto w-full relative z-10">
        <FormFiller formId={id} />
      </div>
    </div>
  );
}
