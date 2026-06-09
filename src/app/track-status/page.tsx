"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Search, CheckCircle2, Terminal as TerminalIcon } from "lucide-react";
import { PageWrapper } from "@/components/PageWrapper";
import { motion } from "framer-motion";

interface SubmissionData {
  _id: string;
  token: string;
  answers: Record<string, any>;
  status: "pending" | "in-progress" | "completed" | "rejected";
  createdAt: string;
}

interface FormConfig {
  title: string;
  description: string;
  questions: Array<{ id: string; label: string; type: string }>;
}

export default function TrackStatusPage() {
  const [tokenInput, setTokenInput] = useState("");
  const [submission, setSubmission] = useState<SubmissionData | null>(null);
  const [form, setForm] = useState<FormConfig | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmission(null);
    setForm(null);

    const token = tokenInput.trim();
    if (!token) {
      setError("Enter your token.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`/api/submissions/${token}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to locate ticket reference.");
      }

      setSubmission(data.submission);
      setForm(data.form);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "pending":
        return {
          borderColor: "border-amber-500/25",
          glowClass: "shadow-[0_0_40px_rgba(245,158,11,0.12)]",
          gradient: "from-amber-500/[0.07] via-transparent to-transparent",
          accentBar: "bg-amber-500",
          stepActive: "border-amber-400 text-amber-400 shadow-[0_0_16px_rgba(245,158,11,0.35)]",
          stepDone: "bg-amber-500 text-zinc-950 shadow-[0_0_12px_rgba(245,158,11,0.4)]",
          stepLine: "bg-gradient-to-r from-amber-500 to-amber-400",
          stepLabelActive: "text-amber-400",
        };
      case "in-progress":
        return {
          borderColor: "border-cyan-500/25",
          glowClass: "shadow-[0_0_40px_rgba(6,182,212,0.12)]",
          gradient: "from-cyan-500/[0.07] via-transparent to-transparent",
          accentBar: "bg-cyan-500",
          stepActive: "border-cyan-400 text-cyan-400 shadow-[0_0_16px_rgba(6,182,212,0.35)] animate-pulse",
          stepDone: "bg-cyan-500 text-zinc-950 shadow-[0_0_12px_rgba(6,182,212,0.4)]",
          stepLine: "bg-gradient-to-r from-cyan-500 to-cyan-400",
          stepLabelActive: "text-cyan-400",
        };
      case "completed":
        return {
          borderColor: "border-emerald-500/25",
          glowClass: "shadow-[0_0_40px_rgba(16,185,129,0.12)]",
          gradient: "from-emerald-500/[0.07] via-transparent to-transparent",
          accentBar: "bg-emerald-500",
          stepActive: "border-emerald-400 text-emerald-400 shadow-[0_0_16px_rgba(16,185,129,0.35)]",
          stepDone: "bg-emerald-500 text-zinc-950 shadow-[0_0_12px_rgba(16,185,129,0.4)]",
          stepLine: "bg-gradient-to-r from-emerald-500 to-emerald-400",
          stepLabelActive: "text-emerald-400",
        };
      case "rejected":
        return {
          borderColor: "border-rose-500/25",
          glowClass: "shadow-[0_0_40px_rgba(244,63,94,0.12)]",
          gradient: "from-rose-500/[0.07] via-transparent to-transparent",
          accentBar: "bg-rose-500",
          stepActive: "border-rose-400 text-rose-400 shadow-[0_0_16px_rgba(244,63,94,0.35)]",
          stepDone: "bg-rose-500 text-zinc-950 shadow-[0_0_12px_rgba(244,63,94,0.4)]",
          stepLine: "bg-gradient-to-r from-rose-500 to-rose-400",
          stepLabelActive: "text-rose-400",
        };
      default:
        return {
          borderColor: "border-zinc-800",
          glowClass: "",
          gradient: "from-zinc-800/20 via-transparent to-transparent",
          accentBar: "bg-zinc-600",
          stepActive: "border-zinc-500 text-zinc-400",
          stepDone: "bg-zinc-600 text-zinc-200",
          stepLine: "bg-zinc-700",
          stepLabelActive: "text-zinc-400",
        };
    }
  };

  const statusSteps = [
    { key: "pending", label: "Queued" },
    { key: "in-progress", label: "In Review" },
    { key: "completed", label: "Result" },
  ];

  const formatSubmittedAt = (dateStr: string) =>
    new Date(dateStr).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden bg-zinc-950 flex flex-col justify-between py-6 sm:py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-cyan-500/30 selection:text-white">
      {/* Dynamic graphic grids and flows */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0c0c0e_1px,transparent_1px),linear-gradient(to_bottom,#0c0c0e_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_80%,transparent_100%)] opacity-50" />
      <div className="absolute top-[-15%] left-[-10%] w-[700px] h-[700px] rounded-full bg-cyan-900/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[700px] h-[700px] rounded-full bg-cyan-900/10 blur-[130px] pointer-events-none" />

      {/* Brand Header */}
      <div className="mx-auto w-full max-w-3xl flex items-center justify-between mb-6 border-b border-zinc-900/80 pb-4 relative z-10 flex-shrink-0">
        <a href="/" className="flex items-center gap-3 cursor-pointer group">
          <img src="/wondercraft.png" alt="Wondercraft Logo" className="w-8 h-8 object-contain rounded-lg drop-shadow-[0_0_8px_rgba(6,182,212,0.4)] group-hover:scale-105 transition-transform duration-200" />
          <div>
            <h1 className="text-sm font-black text-white tracking-widest uppercase group-hover:text-cyan-400 transition-colors">Wondercraft</h1>
          </div>
        </a>
        <a
          href="/"
          className="text-xs font-bold text-zinc-400 hover:text-cyan-400 hover:border-cyan-500/40 transition-all duration-200 border border-zinc-900 px-4 py-2 rounded-lg bg-zinc-950/60 cursor-pointer"
        >
          Back
        </a>
      </div>

      <div className="flex-grow max-w-3xl mx-auto w-full relative z-10 space-y-4 flex flex-col justify-center min-h-0">
        
        {/* Token Search Card with scanning laser effect */}
        <Card className="border-zinc-800 bg-zinc-900/30 backdrop-blur-md overflow-hidden relative border-glow flex-shrink-0">
          {/* Laser scanning beam */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-scan opacity-60 z-20 pointer-events-none" />
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
          
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold text-white flex items-center gap-2">
              <TerminalIcon className="w-4 h-4 text-cyan-400" />
              Track Submission
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Input
                  placeholder="TKN-XXXXXX-XXXX"
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  className="font-mono text-center sm:text-left tracking-wide py-3 pl-4 border-zinc-800 bg-zinc-950/80 focus:border-cyan-500/80 text-cyan-400 placeholder-zinc-700"
                />
              </div>
              <Button type="submit" variant="primary" disabled={isLoading} className="flex items-center justify-center gap-2 cursor-pointer py-3 h-auto sm:px-6 font-bold text-sm bg-cyan-500 hover:bg-cyan-400 text-zinc-950">
                <Search className="w-4 h-4 text-zinc-950" />
                {isLoading ? "Searching..." : "Search"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-rose-500/10 border border-rose-500/30 text-rose-455 p-4 rounded-xl text-sm font-medium text-center shadow-[0_0_15px_rgba(244,63,94,0.05)] flex-shrink-0"
          >
            {error}
          </motion.div>
        )}

        {/* Status Report Card */}
        {submission && form && (
          <PageWrapper>
            <div className="space-y-4">
              
              {/* Status overview card */}
              {(() => {
                const s = getStatusConfig(submission.status);
                const isRejected = submission.status === "rejected";
                const currentIdx = statusSteps.findIndex((step) => step.key === submission.status);

                return (
                  <Card className={`bg-zinc-900/50 backdrop-blur-md relative overflow-hidden border ${s.borderColor} ${s.glowClass}`}>
                    <div className={`absolute inset-0 bg-gradient-to-b ${s.gradient} pointer-events-none`} />
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${s.accentBar}`} />

                    <div className="relative px-6 sm:px-7 pt-6 pb-5">
                      <div className="flex items-start justify-between gap-3">
                        <h4 className="text-xl font-bold text-white leading-tight">
                          {form.title}
                        </h4>
                        {isRejected && (
                          <Badge variant="red" className="flex-shrink-0 text-[10px] font-bold uppercase">
                            Denied
                          </Badge>
                        )}
                      </div>

                      <p className="mt-2 text-xs text-zinc-500 font-mono">
                        {submission.token}
                        <span className="text-zinc-700 mx-2">·</span>
                        <span className="font-sans">{formatSubmittedAt(submission.createdAt)}</span>
                      </p>
                    </div>
                    {/* Progress timeline */}
                    <div className="px-5 pb-8 pt-6 border-t border-zinc-900/60 relative">
                      
                      {/* Horizontal timeline (Desktop/Tablet) */}
                      <div className="hidden sm:flex justify-between items-center max-w-xs mx-auto relative pb-6">
                        {statusSteps.map((step, idx) => {
                          const isCompletedStep = idx < currentIdx || submission.status === "completed";
                          const isActiveStep = idx === currentIdx && !isRejected;

                          return (
                            <React.Fragment key={step.key}>
                              {idx > 0 && (
                                <div className={`flex-1 h-[3px] mx-2 rounded-full transition-all duration-500 ${
                                  isCompletedStep ? "bg-gradient-to-r from-cyan-500 to-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.5)]" : "bg-zinc-800"
                                }`} />
                              )}
                              
                              <div className="flex flex-col items-center relative">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                                  isCompletedStep
                                    ? "bg-cyan-500 text-zinc-950 shadow-[0_0_15px_rgba(6,182,212,0.6)] scale-105"
                                    : isActiveStep
                                    ? "bg-zinc-950 text-cyan-400 border-2 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.4)] animate-pulse"
                                    : "bg-zinc-950 text-zinc-650 border border-zinc-800"
                                }`}>
                                  {idx + 1}
                                </div>
                                <span className={`text-[9px] uppercase font-bold tracking-widest mt-2 whitespace-nowrap absolute top-8.5 ${
                                  isActiveStep ? "text-cyan-400 font-black" : "text-zinc-500"
                                }`}>
                                  {step.key === "in-progress" ? "Working" : step.label}
                                </span>
                              </div>
                            </React.Fragment>
                          );
                        })}

                        {submission.status === "rejected" && (
                          <>
                            <div className="flex-1 h-[3px] mx-2 rounded-full bg-rose-500/30" />
                            <div className="flex flex-col items-center relative">
                              <div className="w-8 h-8 rounded-full bg-rose-500/15 text-rose-455 border border-rose-500/30 flex items-center justify-center text-xs font-bold shadow-[0_0_15px_rgba(244,63,94,0.3)] scale-105">
                                !
                              </div>
                              <span className="text-[9px] uppercase font-bold tracking-widest mt-2 text-rose-455 absolute top-8.5">
                                Rejected
                              </span>
                            </div>
                          </>
                        )}
                      </div>

                      {/* Vertical timeline (Mobile) */}
                      <div className="flex sm:hidden flex-col gap-6 pl-2 relative">
                        {/* Connecting line */}
                        <div className="absolute left-[15px] top-3 bottom-3 w-[2px] bg-zinc-800" />
                        
                        {statusSteps.map((step, idx) => {
                          const isCompletedStep = idx < currentIdx || submission.status === "completed";
                          const isActiveStep = idx === currentIdx && !isRejected;

                          return (
                            <div key={step.key} className="flex items-center gap-4 relative z-10">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all duration-300 ${
                                isCompletedStep
                                  ? "bg-cyan-500 text-zinc-950 shadow-[0_0_15px_rgba(6,182,212,0.6)] scale-105"
                                  : isActiveStep
                                  ? "bg-zinc-950 text-cyan-400 border-2 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.4)] animate-pulse"
                                  : "bg-zinc-950 text-zinc-650 border border-zinc-800"
                              }`}>
                                {idx + 1}
                              </div>
                              <div className="flex flex-col">
                                <span className={`text-[10px] uppercase font-bold tracking-widest ${
                                  isActiveStep ? "text-cyan-400 font-black" : "text-zinc-500"
                                }`}>
                                  {step.key === "in-progress" ? "Working" : step.label}
                                </span>
                                <span className="text-[9px] text-zinc-500">
                                  {step.key === "pending"
                                    ? "Awaiting admin audit"
                                    : step.key === "in-progress"
                                    ? "Actively deploying server config"
                                    : "Server parameters live on host console"}
                                </span>
                              </div>
                            </div>
                          );
                        })}

                        {submission.status === "rejected" && (
                          <div className="flex items-center gap-4 relative z-10">
                            <div className="w-8 h-8 rounded-full bg-rose-500/15 text-rose-455 border border-rose-500/30 flex items-center justify-center text-xs font-bold shadow-[0_0_15px_rgba(244,63,94,0.3)] scale-105 flex-shrink-0">
                              !
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[10px] uppercase font-bold tracking-widest text-rose-455">
                                Rejected
                              </span>
                              <span className="text-[9px] text-zinc-500">
                                Declined due to compliance issues.
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })()}
            </div>
          </PageWrapper>
        )}
      </div>

      {/* Footer */}
      <footer className="w-full text-center py-4 border-t border-zinc-900/60 text-zinc-600 text-xs relative z-10 flex-shrink-0 mt-4">
        &copy; {new Date().getFullYear()} Wondercraft
      </footer>
    </div>
  );
}
