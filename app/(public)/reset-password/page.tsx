"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useResetPassword } from "@/lib/api-hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Boxes, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

function ResetPasswordForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { toast } = useToast();
  const token = params.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [done, setDone] = useState(false);

  const resetMutation = useResetPassword({
    mutation: {
      onSuccess: () => {
        setDone(true);
        setTimeout(() => router.push("/login"), 2000);
      },
      onError: (err: unknown) => {
        const msg = err instanceof Error ? err.message : "This link may have expired.";
        toast({ title: "Couldn't reset password", description: msg, variant: "destructive" });
      },
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast({ title: "Password too short", description: "Password must be at least 6 characters.", variant: "destructive" });
      return;
    }
    if (password !== confirm) {
      toast({ title: "Passwords don't match", description: "Please re-enter your password.", variant: "destructive" });
      return;
    }
    if (!token) {
      toast({ title: "Invalid link", description: "This reset link is missing its token.", variant: "destructive" });
      return;
    }
    resetMutation.mutate({ token, password });
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1920&q=80')" }}
      />
      <div className="absolute inset-0 bg-slate-900/70" />

      <div className="relative z-10 w-full max-w-md px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-violet-600 to-blue-600 rounded-2xl shadow-2xl mb-4">
            <Boxes className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Nexus</h1>
        </div>

        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur">
          {done ? (
            <CardHeader className="pb-2 text-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <CardTitle className="text-xl text-slate-900">Password reset</CardTitle>
              <CardDescription className="text-slate-500">Redirecting you to sign in…</CardDescription>
            </CardHeader>
          ) : (
            <>
              <CardHeader className="pb-4">
                <CardTitle className="text-xl text-slate-900">Set a new password</CardTitle>
                <CardDescription className="text-slate-500">Choose a strong password for your account.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="password" className="text-slate-700">New password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPw ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Min. 6 characters"
                        required
                        className="pr-10 bg-white text-slate-900 border-slate-200 placeholder:text-slate-400"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 text-slate-400 hover:text-slate-600"
                        onClick={() => setShowPw(!showPw)}
                      >
                        {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="confirm" className="text-slate-700">Confirm new password</Label>
                    <Input
                      id="confirm"
                      type={showPw ? "text" : "password"}
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      placeholder="Re-enter password"
                      required
                      className="bg-white text-slate-900 border-slate-200 placeholder:text-slate-400"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-[hsl(230,70%,30%)] hover:bg-[hsl(230,70%,25%)] text-white border-[hsl(230,70%,30%)]" disabled={resetMutation.isPending}>
                    {resetMutation.isPending ? "Resetting…" : "Reset password"}
                  </Button>
                </form>
                <p className="text-sm text-center text-slate-500 mt-4">
                  <Link href="/login" className="text-primary font-medium hover:underline">
                    Back to sign in
                  </Link>
                </p>
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
