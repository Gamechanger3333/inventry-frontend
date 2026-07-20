import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { ScrollButtons } from "@/components/ScrollButtons";

export const metadata: Metadata = {
  title: "Nexus — Inventory & Sales Management",
  description: "All-in-one inventory and sales platform for modern businesses.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          {children}
          <ScrollButtons />
        </Providers>
      </body>
    </html>
  );
}
