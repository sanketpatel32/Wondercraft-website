"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { CheckCircle2, ShieldAlert, Copy, Check, UploadCloud } from "lucide-react";

interface Question {
  id: string;
  label: string;
  type: string;
  required: boolean;
  options: string[];
}

interface FormFillerProps {
  formId: string;
  isDashboard?: boolean;
}

export function FormFiller({ formId, isDashboard = false }: FormFillerProps) {
  const [form, setForm] = useState<{ title: string; description: string; questions: Question[]; isActive?: boolean } | null>(null);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [submitError, setSubmitError] = useState("");
  const [token, setToken] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const res = await fetch(`/api/forms/${formId}`);
        if (!res.ok) throw new Error("Failed to load form details");
        const data = await res.json();
        setForm(data);
        
        const initialAnswers: Record<string, any> = {};
        data.questions.forEach((q: Question) => {
          if (q.type === "checkbox") {
            initialAnswers[q.id] = [];
          } else {
            initialAnswers[q.id] = "";
          }
        });
        setAnswers(initialAnswers);
      } catch (err: any) {
        setSubmitError(err.message || "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };
    fetchForm();
  }, [formId]);

  const handleInputChange = (qId: string, value: any) => {
    setAnswers({ ...answers, [qId]: value });
    if (errors[qId]) {
      const updatedErrors = { ...errors };
      delete updatedErrors[qId];
      setErrors(updatedErrors);
    }
  };

  const handleCheckboxChange = (qId: string, option: string, checked: boolean) => {
    const current = (answers[qId] as string[]) || [];
    let updated: string[];
    if (checked) {
      updated = [...current, option];
    } else {
      updated = current.filter((o) => o !== option);
    }
    handleInputChange(qId, updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    setErrors({});

    try {
      const res = await fetch(`/api/forms/${formId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setSubmitError(data.error || "Submission failed");
        }
        return;
      }

      setToken(data.token);
    } catch (err: any) {
      setSubmitError(err.message || "Server Error");
    }
  };

  const copyToken = () => {
    navigator.clipboard.writeText(token).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4 max-w-xl mx-auto">
        <div className="w-10 h-10 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin"></div>
        <p className="text-zinc-500 text-sm font-medium">Downloading console form parameters...</p>
      </div>
    );
  }

  if (!form) {
    return (
      <Card className="max-w-xl mx-auto border-red-500/30 bg-red-500/5">
        <CardHeader>
          <div className="flex items-center gap-2 text-red-400">
            <ShieldAlert className="w-6 h-6" />
            <CardTitle>Roster Error</CardTitle>
          </div>
          <CardDescription className="text-red-450">The requested form template could not be located or verified.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!isDashboard && form && form.isActive === false) {
    return (
      <Card className="max-w-xl mx-auto border-amber-500/30 bg-amber-500/5 p-8 text-center space-y-4">
        <div className="flex flex-col items-center space-y-3">
          <ShieldAlert className="w-12 h-12 text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.2)]" />
          <h3 className="text-xl font-bold text-white tracking-wide">Portal Paused</h3>
          <p className="text-zinc-400 text-sm max-w-sm mx-auto">
            Submissions for this form have been stopped.
          </p>
        </div>
        <div className="pt-4 border-t border-zinc-900/60 justify-center">
          <a href="/track-status">
            <Button variant="secondary" className="w-full cursor-pointer bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white">
              Track Existing Ticket
            </Button>
          </a>
        </div>
      </Card>
    );
  }

  if (token) {
    return (
      <Card className="max-w-xl mx-auto border-cyan-500/30 bg-cyan-950/10 glow-cyan p-8 text-center space-y-6">
        <div className="flex flex-col items-center space-y-2">
          <CheckCircle2 className="w-14 h-14 text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.3)]" />
          <h3 className="text-2xl font-bold text-white tracking-wide mt-2">Configuration Received</h3>
          <p className="text-zinc-400 text-sm">Your form has been successfully compiled and registered on the server.</p>
        </div>

        <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-900 flex flex-col items-center justify-center space-y-3">
          <span className="text-xs uppercase text-zinc-500 font-semibold tracking-wider">Tracking Reference Token</span>
          <span className="text-lg font-mono font-bold text-cyan-400 tracking-widest">{token}</span>
          <button
            onClick={copyToken}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-850 text-xs font-medium text-zinc-300 hover:text-white border border-zinc-800 transition-all cursor-pointer"
          >
            {isCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                Copied Reference
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copy Reference
              </>
            )}
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-zinc-900 justify-center">
          <a href="/track-status" className="flex-grow">
            <Button variant="primary" className="w-full cursor-pointer">Check Reference Status</Button>
          </a>
          <Button
            variant="secondary"
            onClick={() => {
              setToken("");
              const initialAnswers: Record<string, any> = {};
              form.questions.forEach((q: Question) => {
                if (q.type === "checkbox") {
                  initialAnswers[q.id] = [];
                } else {
                  initialAnswers[q.id] = "";
                }
              });
              setAnswers(initialAnswers);
            }}
            className="flex-grow cursor-pointer"
          >
            Submit Another Response
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="max-w-xl mx-auto border-zinc-800 glow-cyan-sm bg-zinc-900/50">
      <CardHeader className="border-b border-zinc-900 pb-4 mb-5">
        <CardTitle className="text-xl md:text-2xl text-white">{form.title}</CardTitle>
        {form.description && <CardDescription className="text-zinc-400 text-sm mt-1">{form.description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {isDashboard && form && form.isActive === false && (
          <div className="bg-amber-500/10 border border-amber-500/30 text-amber-400 px-4 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider mb-6 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 flex-shrink-0" />
            <span>Active Preview: This form is currently paused on the public portal.</span>
          </div>
        )}

        {submitError && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-lg text-sm font-medium mb-6">
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {form.questions.map((q) => {
            const hasError = errors[q.id];
            return (
              <div key={q.id} className="space-y-2">
                <label className="text-sm font-bold text-zinc-300 flex items-center gap-1">
                  {q.label}
                  {q.required && <span className="text-cyan-400 text-xs font-bold font-mono">*</span>}
                </label>

                {q.type === "shortText" && (
                  <Input
                    placeholder="Enter short text answer"
                    value={answers[q.id] || ""}
                    onChange={(e) => handleInputChange(q.id, e.target.value)}
                    error={hasError}
                  />
                )}

                {q.type === "longText" && (
                  <Textarea
                    placeholder="Enter long paragraph answer"
                    value={answers[q.id] || ""}
                    onChange={(e) => handleInputChange(q.id, e.target.value)}
                    error={hasError}
                  />
                )}

                {q.type === "number" && (
                  <Input
                    type="number"
                    placeholder="Enter numeric response"
                    value={answers[q.id] || ""}
                    onChange={(e) => handleInputChange(q.id, e.target.value)}
                    error={hasError}
                  />
                )}

                {q.type === "email" && (
                  <Input
                    type="email"
                    placeholder="e.g. user@wondercraft.com"
                    value={answers[q.id] || ""}
                    onChange={(e) => handleInputChange(q.id, e.target.value)}
                    error={hasError}
                  />
                )}

                {q.type === "phone" && (
                  <Input
                    type="tel"
                    placeholder="e.g. +1 (555) 019-2834"
                    value={answers[q.id] || ""}
                    onChange={(e) => handleInputChange(q.id, e.target.value)}
                    error={hasError}
                  />
                )}

                {q.type === "date" && (
                  <Input
                    type="date"
                    value={answers[q.id] || ""}
                    onChange={(e) => handleInputChange(q.id, e.target.value)}
                    error={hasError}
                    className="cursor-pointer"
                  />
                )}

                {q.type === "dropdown" && (
                  <div className="flex flex-col gap-1.5">
                    <select
                      value={answers[q.id] || ""}
                      onChange={(e) => handleInputChange(q.id, e.target.value)}
                      className={`w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/40 rounded-lg text-sm text-zinc-350 outline-none cursor-pointer ${
                        hasError ? "border-red-500/50 focus:border-red-500/50" : ""
                      }`}
                    >
                      <option value="" className="bg-zinc-950 text-zinc-500">Select an option...</option>
                      {q.options.map((opt) => (
                        <option key={opt} value={opt} className="bg-zinc-950 text-zinc-350">{opt}</option>
                      ))}
                    </select>
                    {hasError && <p className="text-xs text-red-450 font-medium">{hasError}</p>}
                  </div>
                )}

                {q.type === "radio" && (
                  <div className="space-y-2 pt-1">
                    {q.options.map((opt) => (
                      <div key={opt} className="flex items-center gap-2 select-none">
                        <input
                          type="radio"
                          id={`${q.id}-${opt}`}
                          name={q.id}
                          value={opt}
                          checked={answers[q.id] === opt}
                          onChange={() => handleInputChange(q.id, opt)}
                          className="w-4 h-4 text-cyan-500 bg-zinc-950 border-zinc-800 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                        />
                        <label htmlFor={`${q.id}-${opt}`} className="text-xs text-zinc-350 font-medium cursor-pointer">
                          {opt}
                        </label>
                      </div>
                    ))}
                    {hasError && <p className="text-xs text-red-450 font-medium">{hasError}</p>}
                  </div>
                )}

                {q.type === "checkbox" && (
                  <div className="space-y-2 pt-1">
                    {q.options.map((opt) => {
                      const selected = (answers[q.id] as string[]) || [];
                      return (
                        <div key={opt} className="flex items-center gap-2 select-none">
                          <input
                            type="checkbox"
                            id={`${q.id}-${opt}`}
                            value={opt}
                            checked={selected.includes(opt)}
                            onChange={(e) => handleCheckboxChange(q.id, opt, e.target.checked)}
                            className="w-4 h-4 text-cyan-500 bg-zinc-950 border-zinc-800 focus:ring-0 focus:ring-offset-0 cursor-pointer rounded"
                          />
                          <label htmlFor={`${q.id}-${opt}`} className="text-xs text-zinc-350 font-medium cursor-pointer">
                            {opt}
                          </label>
                        </div>
                      );
                    })}
                    {hasError && <p className="text-xs text-red-450 font-medium">{hasError}</p>}
                  </div>
                )}

                {q.type === "file" && (
                  <div className="flex flex-col gap-1.5">
                    <div className={`border border-dashed rounded-lg bg-zinc-950 p-6 flex flex-col items-center justify-center text-center transition-all ${
                      hasError ? "border-red-500/50" : "border-zinc-800 hover:border-cyan-500/40"
                    }`}>
                      <UploadCloud className="w-8 h-8 text-zinc-600 mb-2" />
                      <span className="text-xs text-zinc-400 font-medium">Attachment Placeholder</span>
                      <span className="text-[10px] text-zinc-500 mt-1">Files uploaded in this field are simulated. Enter a filename below to proceed.</span>
                      <input
                        type="text"
                        placeholder="Filename simulation (e.g. config-backup.yaml)"
                        value={answers[q.id] || ""}
                        onChange={(e) => handleInputChange(q.id, e.target.value)}
                        className="mt-3 px-3 py-1.5 w-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 outline-none rounded-lg text-center focus:border-cyan-500/50"
                      />
                    </div>
                    {hasError && <p className="text-xs text-red-450 font-medium">{hasError}</p>}
                  </div>
                )}
              </div>
            );
          })}

          <div className="pt-4 border-t border-zinc-900 flex justify-end">
            <Button type="submit" variant="primary" className="px-8 cursor-pointer">
              Submit Configuration Request
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
