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

export async function GET() {
  try {
    const superAdmin = await getAuthenticatedSuperAdmin();
    if (!superAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admins = await User.find({ role: "admin" }).sort({ createdAt: -1 });
    return NextResponse.json(admins);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const superAdmin = await getAuthenticatedSuperAdmin();
    if (!superAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return NextResponse.json({ error: "Email already exists" }, { status: 409 });
    }

    const hashedPassword = await hashPassword(password);
    const newAdmin = await User.create({
      name,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: "admin",
      status: "active",
    });

    return NextResponse.json({
      message: "Admin created successfully",
      admin: {
        id: newAdmin._id,
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role,
        status: newAdmin.status,
      },
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Server Error" }, { status: 500 });
  }
}
