"use client";

import React from "react";
import { Terminal } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function DashboardHeader({ title, subtitle }: HeaderProps) {
  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between border-b border-zinc-900 pb-5 mb-6 gap-4">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-cyan-950/60 rounded-lg border border-cyan-900 text-cyan-400 hidden sm:block">
          <Terminal className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">{title}</h2>
          {subtitle && <p className="text-sm text-zinc-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>
    </header>
  );
}
