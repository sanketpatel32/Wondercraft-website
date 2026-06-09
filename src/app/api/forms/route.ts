import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
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

export async function GET() {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let query = {};
    if (user.role !== "superadmin") {
      query = { createdBy: user._id };
    }

    const forms = await Form.find(query)
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    return NextResponse.json(forms);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, description, questions } = await request.json();

    if (!title || !questions || !Array.isArray(questions)) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const form = await Form.create({
      title,
      description: description || "",
      questions,
      createdBy: user._id,
      isActive: true,
    });

    return NextResponse.json({
      message: "Form created successfully",
      form,
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Server Error" }, { status: 500 });
  }
}
