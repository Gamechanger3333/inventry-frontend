"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useVerifyEmailToken } from "@/lib/api-hooks";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Boxes, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

function VerifyEmailInner() {
  const router = useRouter();
  const params = useSearchParams();
  const { login } = useAuth();
  const token = params.get("token") || "";
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const ran = useRef(false);

  const verifyMutation = useVerifyEmailToken({
    mutation: {
      onSuccess: (data) => {
        login(data.token, data.user);
        setStatus("success");
        setTimeout(() => router.push("/dashboard"), 1500);
      },
      onError: () => setStatus("error"),
    },
  });

  useEffect(() => {
    if (!token || ran.current) {
      if (!token) setStatus("error");
      return;
    }
    ran.current = true;
    verifyMutation.mutate({ token });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

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

        <Card className="shadow-2xl border-0 bg-card/95 backdrop-blur border-card-border text-center">
          <CardHeader className="pb-2">
            {status === "loading" && <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-2" />}
            {status === "success" && <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />}
            {status === "error" && <XCircle className="w-10 h-10 text-destructive mx-auto mb-2" />}
            <CardTitle className="text-xl">
              {status === "loading" && "Verifying your email…"}
              {status === "success" && "Email verified!"}
              {status === "error" && "Verification failed"}
            </CardTitle>
            <CardDescription>
              {status === "loading" && "Just a moment."}
              {status === "success" && "Redirecting you to your dashboard…"}
              {status === "error" && "This link is invalid or has expired."}
            </CardDescription>
          </CardHeader>
          {status === "error" && (
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/login">Back to sign in</Link>
              </Button>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailInner />
    </Suspense>
  );
}
