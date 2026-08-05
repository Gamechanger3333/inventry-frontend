"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // /verify-email logs the user in itself and shows a brief "success"
    // state before redirecting on its own — don't race it here.
    if (pathname === "/verify-email") return;

    if (!isLoading && user) {
      router.replace("/dashboard");
    }
  }, [user, isLoading, pathname, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  // Already logged in (and not on verify-email) — render nothing while the redirect above fires.
  if (user && pathname !== "/verify-email") return null;

  return <>{children}</>;
}
