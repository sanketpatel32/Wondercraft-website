import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Submission from "@/models/submission";
import Form from "@/models/form";
import { verifyJWT } from "@/lib/auth";
import { cookies } from "next/headers";
import User from "@/models/user";

async function getAuthenticatedUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;

  const payload = await verifyJWT(token);
  if (!payload) return null;

  await connectToDatabase();
  const user = await User.findById(payload.id);
  if (!user || user.status === "paused") return null;

  return user;
}

export async function GET(request: Request, { params }: { params: Promise<{ token: string }> }) {
  try {
    await connectToDatabase();
    const { token } = await params;

    const submission = await Submission.findOne({ token });
    if (!submission) {
      return NextResponse.json({ error: "Submission reference not found" }, { status: 404 });
    }

    const form = await Form.findById(submission.formId).select("title description questions");
    if (!form) {
      return NextResponse.json({ error: "Associated form not found" }, { status: 404 });
    }

    return NextResponse.json({
      submission,
      form,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Server Error" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ token: string }> }) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { token } = await params;
    const { status } = await request.json();

    if (!status || !["pending", "in-progress", "completed", "rejected"].includes(status)) {
      return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
    }

    const submission = await Submission.findOne({ token });
    if (!submission) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    }

    submission.status = status;
    await submission.save();

    return NextResponse.json({
      message: "Submission status updated successfully",
      submission,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Server Error" }, { status: 500 });
  }
}
