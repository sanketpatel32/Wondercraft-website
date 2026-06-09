"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  Users,
  Search,
  LogOut,
  Menu,
  X,
  ShieldAlert,
} from "lucide-react";

interface SidebarProps {
  user: {
    name: string;
    email: string;
    role: "superadmin" | "admin";
  };
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        router.push("/login");
        router.refresh();
      }
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const navItems = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard, roles: ["superadmin", "admin"] },
    { name: "My Forms", href: "/dashboard/forms", icon: FileText, roles: ["superadmin", "admin"] },
    { name: "Create Form", href: "/dashboard/forms/create", icon: PlusCircle, roles: ["superadmin", "admin"] },
    { name: "Manage Admins", href: "/dashboard/admins", icon: Users, roles: ["superadmin"] },
    { name: "Track Status", href: "/track-status", icon: Search, roles: ["superadmin", "admin"] },
  ];

  const filteredItems = navItems.filter((item) => item.roles.includes(user.role));

  const sidebarContent = (
    <div className="flex flex-col h-full bg-zinc-950 border-r border-zinc-900 text-zinc-300 p-4">
      <div className="flex items-center gap-3 px-2 py-4 mb-6 border-b border-zinc-900">
        <img src="/wondercraft.png" alt="Wondercraft Logo" className="w-8 h-8 object-contain rounded-lg drop-shadow-[0_0_8px_rgba(6,182,212,0.3)]" />
        <div>
          <h1 className="text-md font-bold text-white tracking-wide uppercase">Wondercraft</h1>
          <p className="text-[10px] text-cyan-400 tracking-widest font-semibold uppercase">Server Console</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_10px_rgba(6,182,212,0.1)] font-semibold"
                  : "hover:bg-zinc-900/60 hover:text-zinc-150 border border-transparent"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-cyan-400" : "text-zinc-500"}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-zinc-900 pt-4 mt-6">
        <div className="flex flex-col mb-4 px-2">
          <p className="text-xs font-semibold text-white truncate">{user.name}</p>
          <p className="text-[11px] text-zinc-500 truncate">{user.email}</p>
          <span className="inline-block w-fit mt-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest bg-cyan-950 text-cyan-400 border border-cyan-900">
            {user.role}
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-rose-400 hover:bg-rose-500/5 hover:text-rose-350 border border-transparent hover:border-rose-500/10 transition-all duration-200 cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      <div className="lg:hidden flex items-center justify-between p-4 bg-zinc-950 border-b border-zinc-900 text-white w-full">
        <div className="flex items-center gap-2">
          <img src="/wondercraft.png" alt="Wondercraft Logo" className="w-6 h-6 object-contain rounded" />
          <span className="font-bold tracking-wide">Wondercraft</span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1.5 rounded-lg bg-zinc-900 text-zinc-300 border border-zinc-800 hover:text-cyan-400 cursor-pointer"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-40 lg:hidden flex">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          <div className="relative z-50 w-64 h-full">
            {sidebarContent}
          </div>
        </div>
      )}

      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:h-screen lg:sticky lg:top-0 flex-shrink-0">
        {sidebarContent}
      </div>
    </>
  );
}
