import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyJWT } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/user";
import { Sidebar } from "@/components/Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  const payload = await verifyJWT(token);
  if (!payload) {
    redirect("/login");
  }

  await connectToDatabase();
  const userDoc = await User.findById(payload.id);

  if (!userDoc || userDoc.status === "paused") {
    redirect("/login");
  }

  const user = {
    id: userDoc._id.toString(),
    name: userDoc.name,
    email: userDoc.email,
    role: userDoc.role,
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-zinc-950 text-zinc-100">
      <Sidebar user={user} />
      <main className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 overflow-y-auto max-h-screen">
        {children}
      </main>
    </div>
  );
}
