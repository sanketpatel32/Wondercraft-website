import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = NextResponse.json({ message: "Logout successful" });
    
    response.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: new Date(0),
      path: "/",
    });
    
    return response;
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "An error occurred during logout" },
      { status: 500 }
    );
  }
}
