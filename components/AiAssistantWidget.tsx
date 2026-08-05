"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bot, Sparkles, X, ArrowRight, Send, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { usePostPublicAiChat } from "@/lib/api-hooks";

// One contextual suggestion per landing-page section — tied to the id
// attributes on each <section> in app/page.tsx.
const SECTION_TIPS: Record<string, { title: string; text: string }> = {
  hero: {
    title: "New here?",
    text: "I can walk you through what Nexus does in 30 seconds — want a quick overview?",
  },
  stats: {
    title: "Curious about the numbers?",
    text: "Every stat you see here comes straight from the live demo account. Try it yourself.",
  },
  features: {
    title: "8 modules, one platform",
    text: "Not sure which feature fits your business? Ask me and I'll point you to the right one.",
  },
  highlights: {
    title: "Built for scale",
    text: "Multi-warehouse, secure by default, and fast — want details on any of these?",
  },
  "how-it-works": {
    title: "Setup takes minutes",
    text: "I can guide you through creating your first product and warehouse right after signup.",
  },
  testimonials: {
    title: "Real teams, real results",
    text: "Want to see how a team like yours uses Nexus day-to-day?",
  },
  checklist: {
    title: "Everything included",
    text: "No hidden tiers — ask me what's included before you commit to a plan.",
  },
  cta: {
    title: "Ready when you are",
    text: "I can help you get your account set up right now — takes under a minute.",
  },
};

export function AiAssistantWidget() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<string>("hero");
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [bump, setBump] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const lastSection = useRef("hero");
  const scrollRef = useRef<HTMLDivElement>(null);

  const chatMut = usePostPublicAiChat({
    mutation: {
      onSuccess: (data) => {
        setMessages((m) => [...m, { role: "assistant", content: data.message || data.reply }]);
      },
      onError: () => {
        setMessages((m) => [
          ...m,
          { role: "assistant", content: "Sorry, I couldn't reach the assistant just now. Please try again in a moment." },
        ]);
      },
    },
  });

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, chatMut.isPending]);

  const sendMessage = () => {
    const text = input.trim();
    if (!text || chatMut.isPending) return;
    setMessages((m) => [...m, { role: "user", content: text }]);
    setInput("");
    chatMut.mutate({ message: text });
  };

  useEffect(() => {
    // Only the public landing page has these section ids — skip entirely
    // for logged-in dashboard pages where this observer has nothing to find.
    if (user) return;

    const sectionIds = Object.keys(SECTION_TIPS);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) {
          setActiveSection(visible.target.id);
          if (visible.target.id !== lastSection.current) {
            lastSection.current = visible.target.id;
            setBump(true);
            setTimeout(() => setBump(false), 700);
          }
        }
      },
      { threshold: [0.3, 0.5, 0.7] }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [user]);

  // Don't render anything until we know whether the person is signed in —
  // avoids a flash of the "Create account" CTA for an already-logged-in user.
  if (isLoading) return null;

  const tip = SECTION_TIPS[activeSection] ?? SECTION_TIPS.hero;

  // ── Logged-in: go straight to the real, working AI Assistant page ──
  if (user) {
    return (
      <button
        onClick={() => router.push("/ai")}
        aria-label="Open AI Assistant"
        className="fixed bottom-24 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[hsl(230,70%,30%)] hover:bg-[hsl(230,70%,25%)] shadow-xl shadow-[hsl(230,70%,30%)]/30 text-white transition-transform hover:scale-105"
      >
        <Bot className="w-6 h-6" />
      </button>
    );
  }

  // ── Logged-out visitor: contextual marketing tips + sign-up prompts ──
  return (
    <div className="fixed bottom-24 right-6 z-50 flex flex-col items-end gap-3">
      {/* Contextual suggestion bubble */}
      {!dismissed && !open && (
        <div
          key={activeSection}
          className="relative max-w-[260px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl rounded-br-sm shadow-xl shadow-slate-900/10 dark:shadow-black/40 p-4 animate-in fade-in slide-in-from-bottom-2 duration-500"
        >
          <button
            onClick={() => setDismissed(true)}
            aria-label="Dismiss suggestion"
            className="absolute -top-2 -left-2 w-5 h-5 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600"
          >
            <X className="w-3 h-3" />
          </button>
          <div className="flex items-center gap-1.5 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-violet-500" />
            <p className="text-xs font-semibold text-violet-600 dark:text-violet-400">{tip.title}</p>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-snug">{tip.text}</p>
          <button
            onClick={() => setOpen(true)}
            className="mt-2.5 text-xs font-semibold text-violet-600 dark:text-violet-400 hover:underline inline-flex items-center gap-1"
          >
            Ask the AI Assistant <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Expanded panel — real chat, no login required */}
      {open && (
        <div className="w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl shadow-slate-900/15 dark:shadow-black/50 overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-300 flex flex-col">
          <div className="bg-[hsl(230,70%,30%)] px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2 text-white">
              <Bot className="w-4 h-4" />
              <span className="text-sm font-semibold">Nexus AI Assistant</span>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close" className="text-white/80 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Message history */}
          <div ref={scrollRef} className="flex-1 max-h-80 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {tip.text} Ask me anything about Nexus — features, pricing, or whether it fits your business.
              </p>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  dir="auto"
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-[hsl(230,70%,30%)] text-white rounded-br-sm"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-bl-sm"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {chatMut.isPending && (
              <div className="flex justify-start">
                <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl rounded-bl-sm px-3 py-2 flex items-center gap-1.5">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-400" />
                  <span className="text-xs text-slate-400">Thinking…</span>
                </div>
              </div>
            )}
          </div>

          {/* Input row */}
          <div className="border-t border-slate-200 dark:border-slate-800 p-3 flex items-center gap-2 shrink-0">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask about Nexus…"
              dir="auto"
              className="flex-1 text-sm bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-[hsl(230,70%,30%)]/40"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || chatMut.isPending}
              aria-label="Send message"
              className="w-9 h-9 shrink-0 rounded-full bg-[hsl(230,70%,30%)] hover:bg-[hsl(230,70%,25%)] disabled:opacity-40 disabled:hover:bg-[hsl(230,70%,30%)] text-white flex items-center justify-center transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          {/* Secondary CTA — doesn't block chat use */}
          <div className="px-4 pb-3 pt-0.5 shrink-0">
            <Link href="/signup" className="text-xs font-medium text-violet-600 dark:text-violet-400 hover:underline inline-flex items-center gap-1">
              Create a free account for the full assistant <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      )}

      {/* Floating trigger button */}
      <button
        onClick={() => {
          setOpen((o) => !o);
          setDismissed(false);
        }}
        aria-label="Open AI Assistant"
        className={`relative w-14 h-14 rounded-full bg-[hsl(230,70%,30%)] hover:bg-[hsl(230,70%,25%)] shadow-xl shadow-[hsl(230,70%,30%)]/30 flex items-center justify-center text-white transition-transform ${
          bump ? "scale-110" : "scale-100"
        } hover:scale-105`}
      >
        <span className="absolute inset-0 rounded-full bg-[hsl(230,70%,30%)] animate-ping opacity-20" />
        <Bot className="w-6 h-6 relative" />
      </button>
    </div>
  );
}
