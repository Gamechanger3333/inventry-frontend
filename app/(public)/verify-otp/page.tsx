"use client";

import { useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useVerifyOtp, useResendOtp } from "@/lib/api-hooks";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Boxes, MailCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

function VerifyOtpForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { login } = useAuth();
  const { toast } = useToast();
  const email = params.get("email") || "";

  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const [cooldown, setCooldown] = useState(0);

  const verifyMutation = useVerifyOtp({
    mutation: {
      onSuccess: (data) => {
        login(data.token, data.user);
        toast({ title: "Email verified!", description: `Welcome to Nexus, ${data.user.name}.` });
        router.push("/dashboard");
      },
      onError: (err: unknown) => {
        const msg = err instanceof Error ? err.message : "Invalid or expired code.";
        toast({ title: "Verification failed", description: msg, variant: "destructive" });
      },
    },
  });

  const resendMutation = useResendOtp({
    mutation: {
      onSuccess: () => {
        toast({ title: "Code sent", description: "Check your inbox for a new code." });
        startCooldown();
      },
      onError: () => {
        toast({ title: "Couldn't resend", description: "Please try again in a moment.", variant: "destructive" });
      },
    },
  });

  const startCooldown = () => {
    setCooldown(30);
    const interval = setInterval(() => {
      setCooldown((c) => {
        if (c <= 1) {
          clearInterval(interval);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  };

  const handleChange = (idx: number, value: string) => {
    const v = value.replace(/\D/g, "");
    if (!v) {
      const next = [...digits];
      next[idx] = "";
      setDigits(next);
      return;
    }
    const next = [...digits];
    next[idx] = v[v.length - 1];
    setDigits(next);
    if (idx < 5) inputsRef.current[idx + 1]?.focus();
  };

  const handleKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[idx] && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!text) return;
    e.preventDefault();
    const next = Array(6).fill("");
    for (let i = 0; i < text.length; i++) next[i] = text[i];
    setDigits(next);
    inputsRef.current[Math.min(text.length, 5)]?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otp = digits.join("");
    if (otp.length !== 6) {
      toast({ title: "Incomplete code", description: "Enter all 6 digits.", variant: "destructive" });
      return;
    }
    verifyMutation.mutate({ email, otp });
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
          <CardHeader className="pb-4 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mx-auto mb-2">
              <MailCheck className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-xl text-slate-900">Verify your email</CardTitle>
            <CardDescription className="text-slate-500">
              We sent a 6-digit code to <span className="font-medium text-slate-900">{email || "your email"}</span>.
              Enter it below, or click the link in the email instead.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex justify-center gap-2" onPaste={handlePaste}>
                {digits.map((d, i) => (
                  <Input
                    key={i}
                    ref={(el) => {
                      inputsRef.current[i] = el;
                    }}
                    value={d}
                    onChange={(e) => handleChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    inputMode="numeric"
                    maxLength={1}
                    className="w-11 h-13 text-center text-xl font-semibold bg-white text-slate-900 border-slate-200"
                  />
                ))}
              </div>

              <Button type="submit" className="w-full bg-[hsl(230,70%,30%)] hover:bg-[hsl(230,70%,25%)] text-white border-[hsl(230,70%,30%)]" disabled={verifyMutation.isPending}>
                {verifyMutation.isPending ? "Verifying…" : "Verify email"}
              </Button>
            </form>

            <div className="text-sm text-center text-slate-500 mt-4">
              Didn't get the code?{" "}
              <button
                type="button"
                className="text-primary font-medium hover:underline disabled:opacity-50 disabled:no-underline"
                disabled={cooldown > 0 || resendMutation.isPending || !email}
                onClick={() => resendMutation.mutate({ email })}
              >
                {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
              </button>
            </div>

            <p className="text-sm text-center text-slate-500 mt-4">
              <Link href="/login" className="text-primary font-medium hover:underline">
                Back to sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={null}>
      <VerifyOtpForm />
    </Suspense>
  );
}
