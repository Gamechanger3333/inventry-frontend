"use client";

import { useState } from "react";
import Link from "next/link";
import { useForgotPassword } from "@/lib/api-hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Boxes, MailCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const forgotMutation = useForgotPassword({
    mutation: {
      onSuccess: () => setSent(true),
      onError: () => {
        toast({ title: "Something went wrong", description: "Please try again.", variant: "destructive" });
      },
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    forgotMutation.mutate({ email });
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
          {sent ? (
            <>
              <CardHeader className="pb-2 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mx-auto mb-2">
                  <MailCheck className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl text-slate-900">Check your email</CardTitle>
                <CardDescription className="text-slate-500">
                  If an account exists for <span className="font-medium text-slate-900">{email}</span>, we've sent
                  a password reset link. It expires in 30 minutes.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/login">Back to sign in</Link>
                </Button>
              </CardContent>
            </>
          ) : (
            <>
              <CardHeader className="pb-4">
                <CardTitle className="text-xl text-slate-900">Forgot your password?</CardTitle>
                <CardDescription className="text-slate-500">Enter your email and we'll send you a reset link.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-slate-700">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      required
                      className="bg-white text-slate-900 border-slate-200 placeholder:text-slate-400"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-[hsl(230,70%,30%)] hover:bg-[hsl(230,70%,25%)] text-white border-[hsl(230,70%,30%)]" disabled={forgotMutation.isPending}>
                    {forgotMutation.isPending ? "Sending…" : "Send reset link"}
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
