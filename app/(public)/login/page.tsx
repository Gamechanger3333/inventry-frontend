"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLogin } from "@/lib/api-hooks";
import { ApiError } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Boxes, Eye, EyeOff } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("sarah@acmecorp.com");
  const [password, setPassword] = useState("password123");
  const [showPw, setShowPw] = useState(false);

  const loginMutation = useLogin({
    mutation: {
      onSuccess: (data) => {
        login(data.token, data.user);
        router.push("/dashboard");
      },
      onError: (err: unknown) => {
        if (err instanceof ApiError && err.code === "EMAIL_NOT_VERIFIED") {
          const verifyEmail = (err.data?.email as string) || email;
          toast({ title: "Email not verified", description: "Please verify your email to continue." });
          router.push(`/verify-otp?email=${encodeURIComponent(verifyEmail)}`);
          return;
        }
        toast({ title: "Login failed", description: "Invalid email or password.", variant: "destructive" });
      },
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ loginInput: { email, password } });
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
          <p className="text-background/70 mt-1">Inventory & Sales Management</p>
        </div>

        <Card className="shadow-2xl border-0 bg-card/95 backdrop-blur border-card-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Welcome back</CardTitle>
            <CardDescription>Sign in to your account to continue</CardDescription>
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
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
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
              <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
                {loginMutation.isPending ? "Signing in…" : "Sign in"}
              </Button>
            </form>
            <p className="text-sm text-center text-muted-foreground mt-4">
              Don't have an account?{" "}
              <Link href="/signup" className="text-primary font-medium hover:underline">
                Create one
              </Link>
            </p>
            <p className="text-xs text-muted-foreground text-center mt-2">
              Demo: sarah@acmecorp.com / password123
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
