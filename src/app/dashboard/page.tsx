import React from "react";
import { cookies } from "next/headers";
import { verifyJWT } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Form from "@/models/form";
import Submission from "@/models/submission";
import User from "@/models/user";
import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { FileText, ClipboardList, Users, ArrowRight, Clock } from "lucide-react";

async function getAuthenticatedUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;

  const payload = await verifyJWT(token);
  if (!payload) return null;

  await connectToDatabase();
  const user = await User.findById(payload.id);
  return user;
}

export default async function DashboardPage() {
  const user = await getAuthenticatedUser();
  if (!user || user.status === "paused") {
    redirect("/login");
  }

  await connectToDatabase();

  let formQuery = {};
  let submissionQuery = {};

  if (user.role !== "superadmin") {
    formQuery = { createdBy: user._id };
    const myForms = await Form.find({ createdBy: user._id }).select("_id");
    const myFormIds = myForms.map((f) => f._id);
    submissionQuery = { formId: { $in: myFormIds } };
  }

  const formsCount = await Form.countDocuments(formQuery);
  const submissionsCount = await Submission.countDocuments(submissionQuery);
  const adminsCount = await User.countDocuments({ role: "admin" });

  const recentSubmissions = await Submission.find(submissionQuery)
    .sort({ createdAt: -1 })
    .limit(5);

  const formattedSubmissions = await Promise.all(
    recentSubmissions.map(async (sub) => {
      const formDoc = await Form.findById(sub.formId).select("title");
      return {
        id: sub._id.toString(),
        token: sub.token,
        formId: sub.formId.toString(),
        formTitle: formDoc ? formDoc.title : "Deleted Form",
        status: sub.status,
        createdAt: sub.createdAt,
      };
    })
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="yellow">pending</Badge>;
      case "in-progress":
        return <Badge variant="cyan">in-progress</Badge>;
      case "completed":
        return <Badge variant="green">completed</Badge>;
      case "rejected":
        return <Badge variant="red">rejected</Badge>;
      default:
        return <Badge variant="zinc">{status}</Badge>;
    }
  };

  return (
    <div className="flex flex-col space-y-6">
      <DashboardHeader
        title="Console Overview"
        subtitle={`Welcome back, ${user.name}. System health and provisioning queue status.`}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="border-cyan-500/10 bg-cyan-950/5 hover:border-cyan-500/25 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardDescription className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Total Active Templates</CardDescription>
              <h3 className="text-3xl font-bold text-white mt-1">{formsCount}</h3>
            </div>
            <div className="p-3 bg-cyan-950/80 border border-cyan-900 text-cyan-400 rounded-lg">
              <FileText className="w-6 h-6" />
            </div>
          </CardHeader>
          <CardContent className="mt-2">
            <Link href="/dashboard/forms" className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
              Manage form configurations <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </CardContent>
        </Card>

        <Card className="border-cyan-500/10 bg-cyan-950/5 hover:border-cyan-500/25 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardDescription className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Submission Tickets</CardDescription>
              <h3 className="text-3xl font-bold text-white mt-1">{submissionsCount}</h3>
            </div>
            <div className="p-3 bg-cyan-950/80 border border-cyan-900 text-cyan-400 rounded-lg">
              <ClipboardList className="w-6 h-6" />
            </div>
          </CardHeader>
          <CardContent className="mt-2">
            <span className="text-xs text-zinc-500 font-medium">Accumulated client request logs</span>
          </CardContent>
        </Card>

        {user.role === "superadmin" && (
          <Card className="border-cyan-500/10 bg-cyan-950/5 hover:border-cyan-500/25 transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardDescription className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Authorized Admins</CardDescription>
                <h3 className="text-3xl font-bold text-white mt-1">{adminsCount}</h3>
              </div>
              <div className="p-3 bg-cyan-950/80 border border-cyan-900 text-cyan-400 rounded-lg">
                <Users className="w-6 h-6" />
              </div>
            </CardHeader>
            <CardContent className="mt-2">
              <Link href="/dashboard/admins" className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
                Edit system access roster <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </CardContent>
          </Card>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Configuration Pipeline</CardTitle>
          <CardDescription>
            The latest incoming server configuration requests pending workflow routing.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {formattedSubmissions.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="w-12 h-12 text-zinc-800 mx-auto mb-3 animate-pulse" />
              <p className="text-zinc-500 text-sm font-medium">No recent tickets logged</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference Token</TableHead>
                  <TableHead>Form Name</TableHead>
                  <TableHead>Date Filed</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Link</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {formattedSubmissions.map((sub) => (
                  <TableRow key={sub.id}>
                    <TableCell className="font-mono text-xs font-bold text-cyan-400">{sub.token}</TableCell>
                    <TableCell className="font-semibold text-white">{sub.formTitle}</TableCell>
                    <TableCell className="text-xs text-zinc-500">
                      {new Date(sub.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell>{getStatusBadge(sub.status)}</TableCell>
                    <TableCell className="text-right">
                      <Link href={`/dashboard/forms/${sub.formId}/submissions`}>
                        <Button variant="cyan-ghost" size="sm" className="font-bold py-1 px-3 cursor-pointer">
                          Review Request
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
