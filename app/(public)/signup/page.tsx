"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useRegister, useInviteDetails } from "@/lib/api-hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Boxes, Eye, EyeOff, Loader2, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

function SignupForm() {
  const router = useRouter();
  const { toast } = useToast();
  const params = useSearchParams();
  const inviteToken = params.get("invite") || "";

  // Joining via an invite link: fetch who/what it's for so the form can
  // show "Join {company} as {role}" instead of asking for a company name.
  const inviteQuery = useInviteDetails(inviteToken, { query: { enabled: !!inviteToken } });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const registerMutation = useRegister({
    mutation: {
      onSuccess: (data) => {
        toast({ title: "Account created!", description: "We've sent a verification code to your email." });
        router.push(`/verify-otp?email=${encodeURIComponent(data.email)}`);
      },
      onError: (err: unknown) => {
        const msg = err instanceof Error ? err.message : "Could not create account. Please try again.";
        toast({ title: "Sign up failed", description: msg, variant: "destructive" });
      },
    },
  });

  const isInviteFlow = !!inviteToken;
  const inviteInvalid = isInviteFlow && inviteQuery.isError;
  const inviteEmail = inviteQuery.data?.email;

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
    if (isInviteFlow) {
      registerMutation.mutate({ registerInput: { name, email: inviteEmail || email, password, inviteToken } });
    } else {
      if (!organizationName.trim()) {
        toast({ title: "Company name required", description: "Tell us what to call your workspace.", variant: "destructive" });
        return;
      }
      registerMutation.mutate({ registerInput: { name, email, password, organizationName } });
    }
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1920&q=80')" }}
      />
      <div className="absolute inset-0 bg-slate-900/70" />

      <div className="relative z-10 w-full max-w-md px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-violet-600 to-blue-600 rounded-2xl shadow-2xl mb-4">
            <Boxes className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Nexus</h1>
          <p className="text-slate-300 mt-1">Inventory & Sales Management</p>
        </div>

        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl text-slate-900">
              {isInviteFlow ? "Join your team" : "Create an account"}
            </CardTitle>
            <CardDescription className="text-slate-500">
              {isInviteFlow
                ? inviteQuery.data
                  ? `You've been invited to join ${inviteQuery.data.organizationName} as a ${inviteQuery.data.role}.`
                  : "Checking your invite…"
                : "This creates your own private company workspace on Nexus."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isInviteFlow && inviteQuery.isLoading && (
              <div className="flex items-center justify-center py-8 text-slate-400">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            )}

            {inviteInvalid && (
              <div className="text-center py-6">
                <p className="text-sm text-destructive mb-4">
                  This invite link is invalid or has expired. Ask whoever invited you to send a new one.
                </p>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/signup">Sign up without an invite</Link>
                </Button>
              </div>
            )}

            {(!isInviteFlow || inviteQuery.data) && (
              <form onSubmit={handleSubmit} className="space-y-4">
                {isInviteFlow && inviteQuery.data && (
                  <div className="flex items-center gap-2 rounded-lg bg-primary/5 border border-primary/10 px-3 py-2 text-sm text-slate-700">
                    <Users className="w-4 h-4 text-primary shrink-0" />
                    <span>
                      Joining <strong>{inviteQuery.data.organizationName}</strong> as{" "}
                      <strong>{inviteQuery.data.role}</strong>
                    </span>
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-slate-700">Full name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Smith"
                    required
                    className="bg-white text-slate-900 border-slate-200 placeholder:text-slate-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-slate-700">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={isInviteFlow ? (inviteEmail || "") : email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    required
                    disabled={isInviteFlow}
                    className="bg-white text-slate-900 border-slate-200 placeholder:text-slate-400 disabled:opacity-70"
                  />
                  {isInviteFlow && (
                    <p className="text-xs text-slate-400">This invite was issued to this exact email address.</p>
                  )}
                </div>

                {!isInviteFlow && (
                  <div className="space-y-1.5">
                    <Label htmlFor="organizationName" className="text-slate-700">Company name</Label>
                    <Input
                      id="organizationName"
                      type="text"
                      value={organizationName}
                      onChange={(e) => setOrganizationName(e.target.value)}
                      placeholder="Acme Corp"
                      required
                      className="bg-white text-slate-900 border-slate-200 placeholder:text-slate-400"
                    />
                    <p className="text-xs text-slate-400">
                      You'll be the Administrator of this workspace. Invite teammates afterwards.
                    </p>
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-slate-700">Password</Label>
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
                  <Label htmlFor="confirm" className="text-slate-700">Confirm password</Label>
                  <div className="relative">
                    <Input
                      id="confirm"
                      type={showConfirm ? "text" : "password"}
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      placeholder="Re-enter password"
                      required
                      className="pr-10 bg-white text-slate-900 border-slate-200 placeholder:text-slate-400"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 text-slate-400 hover:text-slate-600"
                      onClick={() => setShowConfirm(!showConfirm)}
                    >
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <Button type="submit" className="w-full bg-[hsl(230,70%,30%)] hover:bg-[hsl(230,70%,25%)] text-white border-[hsl(230,70%,30%)]" disabled={registerMutation.isPending}>
                  {registerMutation.isPending ? "Creating account…" : isInviteFlow ? "Join team" : "Create account"}
                </Button>
              </form>
            )}

            <p className="text-sm text-center text-slate-500 mt-4">
              Already have an account?{" "}
              <Link href="/login" className="text-primary font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={null}>
      <SignupForm />
    </Suspense>
  );
}
