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
import { ThemeToggle } from "@/components/theme-toggle";
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
    <div className="min-h-screen w-full relative flex items-center justify-center bg-foreground text-background overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle className="text-background hover:bg-background/10 hover:text-background" />
      </div>

      <div className="relative z-10 w-full max-w-md px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl shadow-2xl mb-4">
            <Boxes className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-background tracking-tight">Nexus</h1>
        </div>

        <Card className="shadow-2xl border-0 bg-card/95 backdrop-blur border-card-border">
          {done ? (
            <CardHeader className="pb-2 text-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <CardTitle className="text-xl">Password reset</CardTitle>
              <CardDescription>Redirecting you to sign in…</CardDescription>
            </CardHeader>
          ) : (
            <>
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">Set a new password</CardTitle>
                <CardDescription>Choose a strong password for your account.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="password">New password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPw ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Min. 6 characters"
                        required
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 text-muted-foreground"
                        onClick={() => setShowPw(!showPw)}
                      >
                        {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="confirm">Confirm new password</Label>
                    <Input
                      id="confirm"
                      type={showPw ? "text" : "password"}
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      placeholder="Re-enter password"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={resetMutation.isPending}>
                    {resetMutation.isPending ? "Resetting…" : "Reset password"}
                  </Button>
                </form>
                <p className="text-sm text-center text-muted-foreground mt-4">
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
