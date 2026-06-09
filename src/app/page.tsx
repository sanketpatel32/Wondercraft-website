import React from "react";
import Link from "next/link";
import { ShieldAlert, Terminal, Search, Key, ChevronRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col justify-between relative overflow-hidden selection:bg-cyan-500/30 selection:text-white">
      {/* Cyan Ambient Glowing Nodes */}
      <div className="absolute top-[-20%] left-[-15%] w-[600px] h-[600px] rounded-full bg-cyan-900/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-15%] w-[600px] h-[600px] rounded-full bg-cyan-900/10 blur-[130px] pointer-events-none" />

      {/* Top Navbar */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between border-b border-zinc-900/60 relative z-10">
        <div className="flex items-center gap-2.5">
          <img src="/wondercraft.png" alt="Wondercraft Logo" className="w-8 h-8 object-contain rounded-lg drop-shadow-[0_0_8px_rgba(6,182,212,0.2)]" />
          <div>
            <h1 className="text-md font-bold text-white tracking-wide uppercase">Wondercraft</h1>
            <p className="text-[10px] text-cyan-400 tracking-widest font-semibold uppercase">Server Console</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/track-status"
            className="text-xs font-semibold text-zinc-400 hover:text-cyan-400 transition-colors uppercase tracking-wider"
          >
            Track Status
          </Link>
          <Link href="/login">
            <button className="text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-zinc-950 px-4 py-2 rounded-lg transition-all duration-200 shadow-[0_0_15px_rgba(6,182,212,0.25)] hover:shadow-[0_0_20px_rgba(6,182,212,0.45)] cursor-pointer">
              Log In
            </button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-12 relative z-10 max-w-4xl mx-auto">
        <div className="space-y-4 mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-cyan-500/25 bg-cyan-950/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2 animate-pulse">
            <Terminal className="w-3.5 h-3.5" />
            Security Version 1.0.4 Live
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight">
            Server Management <br />
            <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-500 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(6,182,212,0.1)]">
              Form Collection Console
            </span>
          </h2>
          <p className="text-zinc-400 text-base md:text-lg max-w-xl mx-auto font-medium">
            Deploy dynamic parameter checklists, compile configurations, and trace deployment ticket status in real-time.
          </p>
        </div>

        {/* Access Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl mt-4">
          {/* Admin Login Card */}
          <Link href="/login" className="group">
            <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800/80 hover:border-cyan-500/40 p-6 rounded-2xl text-left transition-all duration-300 hover:shadow-[0_0_20px_rgba(6,182,212,0.08)] h-full flex flex-col justify-between">
              <div>
                <div className="p-3 bg-cyan-950/40 border border-cyan-900 w-fit rounded-xl text-cyan-400 mb-4 group-hover:bg-cyan-500 group-hover:text-zinc-950 transition-all">
                  <Key className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white tracking-wide">Administrative Systems</h3>
                <p className="text-xs text-zinc-500 mt-1.5 font-medium leading-relaxed">
                  Log in to manage administrator credentials, build dynamic forms, inspect submissions, and update provisioning statuses.
                </p>
              </div>
              <div className="flex items-center gap-1 text-cyan-400 text-xs font-semibold uppercase tracking-wider mt-6 group-hover:text-cyan-300">
                Log in to Console <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </Link>

          {/* User Tracking Card */}
          <Link href="/track-status" className="group">
            <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800/80 hover:border-cyan-500/40 p-6 rounded-2xl text-left transition-all duration-300 hover:shadow-[0_0_20px_rgba(6,182,212,0.08)] h-full flex flex-col justify-between">
              <div>
                <div className="p-3 bg-cyan-950/40 border border-cyan-900 w-fit rounded-xl text-cyan-400 mb-4 group-hover:bg-cyan-500 group-hover:text-zinc-950 transition-all">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white tracking-wide">Track Ticket Status</h3>
                <p className="text-xs text-zinc-500 mt-1.5 font-medium leading-relaxed">
                  Have a reference token? Enter it here to inspect the current evaluation and deployment status of your server configuration request.
                </p>
              </div>
              <div className="flex items-center gap-1 text-cyan-400 text-xs font-semibold uppercase tracking-wider mt-6 group-hover:text-cyan-300">
                Enter Ticket Reference <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full text-center py-6 border-t border-zinc-900/60 text-zinc-600 text-[11px] font-semibold uppercase tracking-widest relative z-10">
        &copy; {new Date().getFullYear()} Wondercraft Server Operations. All Rights Reserved.
      </footer>
    </div>
  );
}
