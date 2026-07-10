"use client";

import { useState } from "react";
import Link from "next/link";
import { useForgotPassword } from "@/lib/api-hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Boxes, MailCheck } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
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
          {sent ? (
            <>
              <CardHeader className="pb-2 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mx-auto mb-2">
                  <MailCheck className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Check your email</CardTitle>
                <CardDescription>
                  If an account exists for <span className="font-medium text-foreground">{email}</span>, we've sent
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
                <CardTitle className="text-xl">Forgot your password?</CardTitle>
                <CardDescription>Enter your email and we'll send you a reset link.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={forgotMutation.isPending}>
                    {forgotMutation.isPending ? "Sending…" : "Send reset link"}
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
