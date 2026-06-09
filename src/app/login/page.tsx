"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ShieldAlert, LogIn } from "lucide-react";
import { PageWrapper } from "@/components/PageWrapper";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-cyan-500/30 selection:text-white">
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-900/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-900/10 blur-[120px] pointer-events-none" />

      <div className="mx-auto w-full max-w-md relative z-10 space-y-6">
        <div className="flex flex-col items-center text-center space-y-2">
          <img src="/wondercraft.png" alt="Wondercraft Logo" className="w-12 h-12 object-contain rounded-lg drop-shadow-[0_0_12px_rgba(6,182,212,0.3)]" />
          <h1 className="text-2xl font-black text-white tracking-widest uppercase">Wondercraft</h1>
          <p className="text-xs text-cyan-400 tracking-widest font-semibold uppercase">Security Console Login</p>
        </div>

        <PageWrapper>
          <Card className="border-zinc-800 bg-zinc-900/40 glow-cyan-sm">
            <CardHeader className="text-center pb-2 border-b border-zinc-900/80 mb-4">
              <CardTitle>Console Authentication</CardTitle>
              <CardDescription>Provide credentials to access administrative systems.</CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3.5 rounded-lg text-sm font-medium mb-4">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Security Email"
                  type="email"
                  placeholder="e.g. admin@wondercraft.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Input
                  label="Access Password"
                  type="password"
                  placeholder="Password passphrase"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <Button
                  type="submit"
                  variant="primary"
                  disabled={isLoading}
                  className="w-full py-3 h-auto flex items-center justify-center gap-2 cursor-pointer font-bold mt-2"
                >
                  <LogIn className="w-4 h-4 text-zinc-950" />
                  {isLoading ? "Validating Session..." : "Authorize Login"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </PageWrapper>

        <div className="text-center relative z-10">
          <a
            href="/"
            className="text-xs text-zinc-500 hover:text-cyan-400 transition-colors font-semibold uppercase tracking-wider cursor-pointer"
          >
            &larr; Back to Control Portal
          </a>
        </div>
      </div>
    </div>
  );
}
