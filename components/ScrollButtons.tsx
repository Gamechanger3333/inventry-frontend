"use client";

import { useEffect, useState } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function ScrollButtons() {
  const [showUp, setShowUp] = useState(false);
  const [showDown, setShowDown] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;

      setShowUp(scrollY > 300);
      setShowDown(scrollY + viewportHeight < fullHeight - 300);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const scrollToBottom = () =>
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });

  if (!showUp && !showDown) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      {showUp && (
        <button
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full",
            "bg-[hsl(230,70%,30%)] hover:bg-[hsl(230,70%,25%)] text-white border border-[hsl(230,70%,30%)] shadow-md",
            "transition-opacity hover-elevate active-elevate-2"
          )}
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
      {showDown && (
        <button
          onClick={scrollToBottom}
          aria-label="Scroll to bottom"
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full",
            "bg-[hsl(230,70%,30%)] hover:bg-[hsl(230,70%,25%)] text-white border border-[hsl(230,70%,30%)] shadow-md",
            "transition-opacity hover-elevate active-elevate-2"
          )}
        >
          <ArrowDown className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
