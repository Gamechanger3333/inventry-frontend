"use client";

import { useState, useRef, useEffect } from "react";
import { useGetAiInsights, useGetAiConversations, usePostAiChat, getGetAiConversationsQueryKey } from "@/lib/api-hooks";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Send, Bot, User, Lightbulb, AlertTriangle, TrendingUp, Package } from "lucide-react";
import { cn } from "@/lib/utils";

const SUGGESTED = [
  "Which products are running low on stock?",
  "What were the top selling products last month?",
  "Are there any slow-moving items I should be aware of?",
  "How is my revenue trending?",
  "Which suppliers should I reorder from soon?",
];

const insightIcons: Record<string, any> = {
  low_stock: Package,
  slow_moving: TrendingUp,
  overstock: AlertTriangle,
  revenue: TrendingUp,
};

const priorityColors: Record<string, "default" | "secondary" | "destructive"> = {
  high: "destructive",
  medium: "secondary",
  low: "default",
};

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AIPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [convId, setConvId] = useState<string | undefined>();
  const bottomRef = useRef<HTMLDivElement>(null);
  const qc = useQueryClient();

  const { data: insights, isLoading: insightsLoading } = useGetAiInsights();

  const chatMut = usePostAiChat({
    mutation: {
      onSuccess: (data) => {
        setMessages((prev) => [...prev, { role: "assistant", content: data.message }]);
        setConvId(data.conversationId);
        qc.invalidateQueries({ queryKey: getGetAiConversationsQueryKey() });
      },
    },
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function sendMessage(text?: string) {
    const msg = text ?? input.trim();
    if (!msg) return;
    setMessages((prev) => [...prev, { role: "user", content: msg }]);
    setInput("");
    chatMut.mutate({ message: msg, conversationId: convId });
  }

  return (
    <div className="flex gap-6 h-[calc(100vh-8rem)]">
      {/* Chat panel */}
      <div className="flex-1 flex flex-col border rounded-lg overflow-hidden bg-card">
        {/* Header */}
        <div className="p-4 border-b flex items-center gap-3 bg-muted/30">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Bot className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold">Nexus AI</p>
            <p className="text-xs text-muted-foreground">Business Intelligence Assistant</p>
          </div>
          <Badge variant="secondary" className="ml-auto text-xs">
            Powered by Groq
          </Badge>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full gap-6 text-center">
              <Bot className="h-12 w-12 text-muted-foreground/40" />
              <div>
                <p className="font-medium">Ask me anything about your business</p>
                <p className="text-sm text-muted-foreground">
                  Inventory, sales trends, supplier performance, and more
                </p>
              </div>
              <div className="flex flex-col gap-2 w-full max-w-md">
                {SUGGESTED.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="text-left text-sm px-4 py-2 rounded-lg border hover:bg-muted transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={cn("flex gap-3", m.role === "user" && "justify-end")}>
              {m.role === "assistant" && (
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
              )}
              <div
                className={cn(
                  "max-w-[80%] rounded-xl px-4 py-3 text-sm",
                  m.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                )}
              >
                <p className="whitespace-pre-wrap">{m.content}</p>
              </div>
              {m.role === "user" && (
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0 mt-1">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          ))}

          {chatMut.isPending && (
            <div className="flex gap-3">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Bot className="h-4 w-4 text-primary" />
              </div>
              <div className="bg-muted rounded-xl px-4 py-3 flex gap-1 items-center">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce"
                    style={{ animationDelay: `${i * 150}ms` }}
                  />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t flex gap-2">
          <Input
            placeholder="Ask about inventory, sales, suppliers..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
            disabled={chatMut.isPending}
          />
          <Button
            onClick={() => sendMessage()}
            disabled={!input.trim() || chatMut.isPending}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Insights panel */}
      <div className="w-72 flex flex-col gap-4 overflow-y-auto">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold">AI Insights</h2>
        </div>

        {insightsLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="border rounded-lg p-3 flex flex-col gap-2">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-4/5" />
              </div>
            ))
          : insights?.map((insight) => {
              const Icon = insightIcons[insight.type] ?? Lightbulb;
              return (
                <div
                  key={insight.id}
                  className="border rounded-lg p-3 flex flex-col gap-2 hover:border-primary/40 transition-colors cursor-pointer"
                  onClick={() => sendMessage(`Tell me more about: ${insight.title}`)}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-primary shrink-0" />
                      <span className="text-sm font-medium">{insight.title}</span>
                    </div>
                    <Badge
                      variant={priorityColors[insight.priority] ?? "secondary"}
                      className="text-xs shrink-0"
                    >
                      {insight.priority}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-3">
                    {insight.description}
                  </p>
                </div>
              );
            })}
      </div>
    </div>
  );
}
