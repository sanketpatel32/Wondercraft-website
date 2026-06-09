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

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const form = await Form.findById(id);

    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    if (user.role !== "superadmin" && form.createdBy.toString() !== user._id.toString()) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const submissions = await Submission.find({ formId: id }).sort({ createdAt: -1 });

    return NextResponse.json({
      form,
      submissions,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Server Error" }, { status: 500 });
  }
}
