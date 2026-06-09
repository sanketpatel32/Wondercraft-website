"use client";

import React, { useState, useEffect } from "react";
import { PageWrapper } from "@/components/PageWrapper";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Dialog } from "@/components/ui/Dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { UserPlus, Power, Edit3, Trash2, Shield } from "lucide-react";

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "paused";
  createdAt: string;
}

export default function AdminsPage() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const fetchAdmins = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admins");
      if (!res.ok) throw new Error("Failed to fetch admins");
      const data = await res.json();
      setAdmins(data);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!name || !email || !password) {
      setError("Please fill out all fields");
      return;
    }
    try {
      const res = await fetch("/api/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create admin");

      setSuccess("Admin created successfully!");
      setIsAddOpen(false);
      setName("");
      setEmail("");
      setPassword("");
      fetchAdmins();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!currentAdmin) return;

    try {
      const res = await fetch(`/api/admins/${currentAdmin._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password: password || undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update admin");

      setSuccess("Admin details updated successfully!");
      setIsEditOpen(false);
      setName("");
      setEmail("");
      setPassword("");
      setCurrentAdmin(null);
      fetchAdmins();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const toggleStatus = async (admin: AdminUser) => {
    setError("");
    setSuccess("");
    const newStatus = admin.status === "active" ? "paused" : "active";
    try {
      const res = await fetch(`/api/admins/${admin._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update status");

      setSuccess(`Admin successfully ${newStatus === "active" ? "activated" : "paused"}!`);
      fetchAdmins();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this admin? This action cannot be undone.")) return;
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`/api/admins/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete admin");

      setSuccess("Admin deleted successfully!");
      fetchAdmins();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const openEditModal = (admin: AdminUser) => {
    setCurrentAdmin(admin);
    setName(admin.name);
    setEmail(admin.email);
    setPassword("");
    setIsEditOpen(true);
  };

  return (
    <PageWrapper>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <DashboardHeader title="Admin Management" subtitle="Create, edit, pause, and delete administrator accounts" />
          <Button
            variant="primary"
            onClick={() => {
              setError("");
              setSuccess("");
              setName("");
              setEmail("");
              setPassword("");
              setIsAddOpen(true);
            }}
            className="w-full sm:w-auto h-fit py-2.5 flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4 text-zinc-950" />
            Add New Admin
          </Button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-lg text-sm font-medium">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-lg text-sm font-medium">
            {success}
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Console Administrators</CardTitle>
            <CardDescription>
              Managing accounts authorized to build forms and submit server configurations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <div className="w-10 h-10 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin"></div>
                <p className="text-zinc-500 text-sm font-medium">Loading security roster...</p>
              </div>
            ) : admins.length === 0 ? (
              <div className="text-center py-12">
                <Shield className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
                <p className="text-zinc-400 font-semibold text-lg">No administrators found</p>
                <p className="text-zinc-500 text-sm mt-1">Add a new admin account to get started.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Administrator</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {admins.map((admin) => (
                    <TableRow key={admin._id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-semibold text-white">{admin.name}</span>
                          <span className="text-xs text-zinc-500">{admin.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="purple">{admin.role}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={admin.status === "active" ? "green" : "red"}>
                          {admin.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-zinc-500">
                        {new Date(admin.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => toggleStatus(admin)}
                            title={admin.status === "active" ? "Pause Account" : "Activate Account"}
                            className={`p-2 rounded-lg border transition-all duration-150 cursor-pointer ${
                              admin.status === "active"
                                ? "bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20"
                                : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
                            }`}
                          >
                            <Power className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openEditModal(admin)}
                            title="Edit Credentials"
                            className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20 transition-all duration-150 cursor-pointer"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(admin._id)}
                            title="Delete Admin"
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

        <Dialog isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Register Administrator">
          <form onSubmit={handleAddSubmit} className="space-y-4">
            <Input
              label="Name"
              placeholder="e.g. John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              label="Email Address"
              type="email"
              placeholder="e.g. john@wondercraft.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Default Password"
              type="password"
              placeholder="Min 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="flex justify-end gap-2 pt-2 border-t border-zinc-800 mt-4">
              <Button type="button" variant="secondary" onClick={() => setIsAddOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Create Account
              </Button>
            </div>
          </form>
        </Dialog>

        <Dialog isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Modify Administrator Credentials">
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <Input
              label="Name"
              placeholder="e.g. John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              label="Email Address"
              type="email"
              placeholder="john@wondercraft.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Change Password (leave blank to keep current)"
              type="password"
              placeholder="New password (optional)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="flex justify-end gap-2 pt-2 border-t border-zinc-800 mt-4">
              <Button type="button" variant="secondary" onClick={() => setIsEditOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Apply Updates
              </Button>
            </div>
          </form>
        </Dialog>
      </div>
    </PageWrapper>
  );
}
