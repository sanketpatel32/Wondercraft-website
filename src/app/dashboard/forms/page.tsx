"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { PageWrapper } from "@/components/PageWrapper";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Plus, Power, Trash2, Eye, FileSpreadsheet, Copy, Check, ExternalLink } from "lucide-react";

interface FormItem {
  _id: string;
  title: string;
  description: string;
  questions: any[];
  createdBy: {
    name: string;
    email: string;
  };
  isActive: boolean;
  createdAt: string;
}

export default function FormsPage() {
  const [forms, setForms] = useState<FormItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState("");

  const fetchForms = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/forms");
      if (!res.ok) throw new Error("Failed to fetch forms");
      const data = await res.json();
      setForms(data);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchForms();
  }, []);

  const toggleStatus = async (form: FormItem) => {
    try {
      const res = await fetch(`/api/forms/${form._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !form.isActive }),
      });
      if (!res.ok) throw new Error("Failed to toggle form state");
      fetchForms();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this form and all its submissions? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/forms/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete form");
      fetchForms();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const copyToClipboard = (id: string) => {
    const origin = window.location.origin;
    const publicUrl = `${origin}/forms/${id}`;
    navigator.clipboard.writeText(publicUrl).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(""), 2000);
    });
  };

  return (
    <PageWrapper>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <DashboardHeader title="Forms Console" subtitle="Build and manage server request configurations and custom collection templates." />
          <Link href="/dashboard/forms/create" className="w-full sm:w-auto">
            <Button variant="primary" className="w-full h-fit py-2.5 flex items-center justify-center gap-2 cursor-pointer">
              <Plus className="w-4 h-4 text-zinc-950" />
              Build New Form
            </Button>
          </Link>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl text-sm font-medium">
            {error}
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Configured Collection Templates</CardTitle>
            <CardDescription>
              All active and paused forms available for data submission.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <div className="w-10 h-10 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin"></div>
                <p className="text-zinc-500 text-sm font-medium">Retrieving form definitions...</p>
              </div>
            ) : forms.length === 0 ? (
              <div className="text-center py-12">
                <Eye className="w-12 h-12 text-zinc-750 mx-auto mb-3" />
                <p className="text-zinc-400 font-semibold text-lg">No forms created yet</p>
                <p className="text-zinc-500 text-sm mt-1">Start by building a new form configuration template.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Form Details</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Fields</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {forms.map((form) => (
                    <TableRow key={form._id}>
                      <TableCell className="max-w-xs">
                        <div className="flex flex-col">
                          <span className="font-semibold text-white truncate">{form.title}</span>
                          <span className="text-xs text-zinc-500 truncate mt-0.5">{form.description || "No description"}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-xs font-medium text-zinc-300">{form.createdBy?.name || "Roster"}</span>
                          <span className="text-[10px] text-zinc-500 truncate">{form.createdBy?.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="cyan">{form.questions.length} fields</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={form.isActive ? "green" : "red"}>
                          {form.isActive ? "active" : "paused"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-zinc-500">
                        {new Date(form.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => copyToClipboard(form._id)}
                            title="Copy Public Link"
                            className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-cyan-400 transition-all duration-150 cursor-pointer"
                          >
                            {copiedId === form._id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                          </button>
                          <Link href={`/forms/${form._id}`} target="_blank" title="View Public Form">
                            <button className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-cyan-400 transition-all duration-150 cursor-pointer">
                              <ExternalLink className="w-4 h-4" />
                            </button>
                          </Link>
                          <button
                            onClick={() => toggleStatus(form)}
                            title={form.isActive ? "Pause Submissions" : "Activate Submissions"}
                            className={`p-2 rounded-lg border transition-all duration-150 cursor-pointer ${
                              form.isActive
                                ? "bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20"
                                : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
                            }`}
                          >
                            <Power className="w-4 h-4" />
                          </button>
                          <Link href={`/dashboard/forms/${form._id}/submissions`} title="View Submissions">
                            <button className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/25 transition-all duration-150 cursor-pointer">
                              <FileSpreadsheet className="w-4 h-4" />
                            </button>
                          </Link>
                          <button
                            onClick={() => handleDelete(form._id)}
                            title="Delete Form Template"
                            className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition-all duration-150 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}
