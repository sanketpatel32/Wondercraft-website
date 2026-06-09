"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { PageWrapper } from "@/components/PageWrapper";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Dialog } from "@/components/ui/Dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { List, Eye, FileSpreadsheet, Check, Copy } from "lucide-react";

interface SubmissionItem {
  _id: string;
  token: string;
  answers: Record<string, any>;
  status: "pending" | "in-progress" | "completed" | "rejected";
  createdAt: string;
}

interface FormItem {
  _id: string;
  title: string;
  description: string;
  questions: Array<{ id: string; label: string; type: string; options: string[] }>;
}

export default function SubmissionsPage() {
  const router = useRouter();
  const params = useParams();
  const formId = params.id as string;

  const [form, setForm] = useState<FormItem | null>(null);
  const [submissions, setSubmissions] = useState<SubmissionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [copiedId, setCopiedId] = useState("");

  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionItem | null>(null);

  const fetchSubmissions = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/forms/${formId}/submissions`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch submissions");
      
      setForm(data.form);
      setSubmissions(data.submissions);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (formId) {
      fetchSubmissions();
    }
  }, [formId]);

  const handleStatusChange = async (token: string, newStatus: string) => {
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`/api/submissions/${token}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update status");

      setSuccess(`Ticket status updated to "${newStatus}"!`);
      setSubmissions((prev) =>
        prev.map((sub) => (sub.token === token ? { ...sub, status: newStatus as any } : sub))
      );
    } catch (err: any) {
      setError(err.message || "An error occurred");
    }
  };

  const copyToken = (token: string) => {
    navigator.clipboard.writeText(token).then(() => {
      setCopiedId(token);
      setTimeout(() => setCopiedId(""), 2000);
    });
  };

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case "pending":
        return "yellow";
      case "in-progress":
        return "cyan";
      case "completed":
        return "green";
      case "rejected":
        return "red";
      default:
        return "zinc";
    }
  };

  return (
    <PageWrapper>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-900 pb-5 mb-2">
          <DashboardHeader
            title={form ? `Submissions: ${form.title}` : "Submissions Console"}
            subtitle="Monitor client submissions, evaluate variables, and update deployment tickets."
          />
          <Link href="/dashboard/forms" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full flex items-center justify-center gap-2 cursor-pointer">
              <List className="w-4 h-4" />
              Back to Forms
            </Button>
          </Link>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl text-sm font-medium">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-xl text-sm font-medium">
            {success}
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Configuration Tickets</CardTitle>
            <CardDescription>
              Review answers, verify payloads, and manage ticket workflows.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <div className="w-10 h-10 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin"></div>
                <p className="text-zinc-500 text-sm font-medium">Retrieving configuration tickets...</p>
              </div>
            ) : submissions.length === 0 ? (
              <div className="text-center py-12">
                <FileSpreadsheet className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
                <p className="text-zinc-400 font-semibold text-lg">No submissions yet</p>
                <p className="text-zinc-500 text-sm mt-1">This form template has not received any submission configurations yet.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reference Token</TableHead>
                    <TableHead>Date Submitted</TableHead>
                    <TableHead>Current Status</TableHead>
                    <TableHead>Change Workflow Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.map((sub) => (
                    <TableRow key={sub._id}>
                      <TableCell className="font-mono text-cyan-400 font-semibold">
                        <div className="flex items-center gap-2">
                          <span>{sub.token}</span>
                          <button
                            onClick={() => copyToken(sub.token)}
                            className="p-1 text-zinc-500 hover:text-cyan-400 transition-colors cursor-pointer"
                            title="Copy Token"
                          >
                            {copiedId === sub.token ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-zinc-500">
                        {new Date(sub.createdAt).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getBadgeVariant(sub.status) as any}>
                          {sub.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <select
                          value={sub.status}
                          onChange={(e) => handleStatusChange(sub.token, e.target.value)}
                          className="px-2 py-1 bg-zinc-950 border border-zinc-800 text-xs font-semibold rounded text-zinc-300 outline-none cursor-pointer focus:border-cyan-500/50"
                        >
                          <option value="pending" className="bg-zinc-950 text-zinc-450">pending</option>
                          <option value="in-progress" className="bg-zinc-950 text-zinc-450">in-progress</option>
                          <option value="completed" className="bg-zinc-950 text-zinc-450">completed</option>
                          <option value="rejected" className="bg-zinc-950 text-zinc-450">rejected</option>
                        </select>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="cyan-ghost"
                          size="sm"
                          onClick={() => setSelectedSubmission(sub)}
                          className="flex items-center gap-1 cursor-pointer font-semibold py-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View answers
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Dialog
          isOpen={!!selectedSubmission}
          onClose={() => setSelectedSubmission(null)}
          title={`Ticket Payload: ${selectedSubmission?.token}`}
        >
          {selectedSubmission && form && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-2">
                <span className="text-xs text-zinc-500 font-semibold uppercase">Submission Date</span>
                <span className="text-xs text-zinc-300 font-mono">
                  {new Date(selectedSubmission.createdAt).toLocaleString()}
                </span>
              </div>

              <div className="space-y-3.5 max-h-[60vh] overflow-y-auto pr-1">
                {form.questions.map((q) => {
                  const ans = selectedSubmission.answers.get ? selectedSubmission.answers.get(q.id) : selectedSubmission.answers[q.id];
                  return (
                    <div key={q.id} className="bg-zinc-950/40 p-3 rounded-lg border border-zinc-800/80">
                      <span className="text-xs font-bold text-cyan-400/80 block uppercase tracking-wider">
                        {q.label}
                      </span>
                      <div className="mt-1">
                        {Array.isArray(ans) ? (
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            {ans.map((a, i) => (
                              <Badge key={i} variant="zinc" className="text-[10px] font-normal">
                                {a}
                              </Badge>
                            ))}
                          </div>
                        ) : ans ? (
                          <span className="text-sm text-zinc-200 block font-mono bg-zinc-955 py-1 px-2 rounded border border-zinc-900 mt-1 whitespace-pre-wrap">
                            {String(ans)}
                          </span>
                        ) : (
                          <span className="text-xs text-zinc-500 italic block mt-1">
                            No response provided
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-end pt-4 border-t border-zinc-800 mt-6">
                <Button variant="secondary" onClick={() => setSelectedSubmission(null)}>
                  Close Payload
                </Button>
              </div>
            </div>
          )}
        </Dialog>
      </div>
    </PageWrapper>
  );
}
