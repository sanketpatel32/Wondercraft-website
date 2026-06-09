import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/user";
import { verifyJWT, hashPassword } from "@/lib/auth";
import { cookies } from "next/headers";

async function getAuthenticatedSuperAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;

  const payload = await verifyJWT(token);
  if (!payload || payload.role !== "superadmin") return null;

  await connectToDatabase();
  const user = await User.findById(payload.id);
  if (!user || user.status === "paused" || user.role !== "superadmin") return null;

  return user;
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const superAdmin = await getAuthenticatedSuperAdmin();
    if (!superAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { name, email, password, status } = body;

    const admin = await User.findById(id);
    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    if (name) admin.name = name;
    if (email) {
      const emailLower = email.toLowerCase().trim();
      if (emailLower !== admin.email) {
        const existing = await User.findOne({ email: emailLower });
        if (existing) {
          return NextResponse.json({ error: "Email already exists" }, { status: 409 });
        }
        admin.email = emailLower;
      }
    }
    if (status) {
      if (status !== "active" && status !== "paused") {
        return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
      }
      admin.status = status;
    }
    if (password && password.trim() !== "") {
      admin.password = await hashPassword(password);
    }

    await admin.save();

    return NextResponse.json({
      message: "Admin updated successfully",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        status: admin.status,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const superAdmin = await getAuthenticatedSuperAdmin();
    if (!superAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const admin = await User.findByIdAndDelete(id);

    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Admin deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Server Error" }, { status: 500 });
  }
}
