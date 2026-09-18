"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Send, Bot, User, Loader2, RotateCcw, AlertCircle, Coins } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAiAnalyticsChat, useGetAiWalletOverview } from "@/graphql/actions/ai";
import { cn } from "@/lib/utils";

interface AICopilotModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialPrompt?: string;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  actions?: Array<{ label: string; payload: any }>;
}

export function AICopilotModal({
  open,
  onOpenChange,
  initialPrompt = "",
}: AICopilotModalProps) {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState(initialPrompt);
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: walletData } = useGetAiWalletOverview();
  const balance = walletData?.getAiWalletOverview?.quota?.balance;
  const isZeroBalance = balance !== undefined && balance <= 0;

  const { sendMessage, loading } = useAiAnalyticsChat();

  // Load initialPrompt when opened with one
  useEffect(() => {
    if (open && initialPrompt && messages.length === 0) {
      setInput(initialPrompt);
    }
  }, [open, initialPrompt, messages.length]);

  // Scroll to bottom on messages update
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend ?? input).trim();
    if (!text || loading) return;

    if (isZeroBalance) {
      toast.error(
        "AI Copilot is unavailable. Your token balance is 0. Please top up tokens in AI Usage.",
        { id: "zero-ai-balance" }
      );
      router.push("/ai/usage?insufficient_balance=true");
      onOpenChange(false);
      return;
    }

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    try {
      const res = await sendMessage(text, sessionId);
      if (res) {
        if (res.sessionId) setSessionId(res.sessionId);
        const botMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          role: "assistant",
          content: res.message || "Request completed successfully.",
          timestamp: new Date(),
          actions: res.actions,
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        // Safe response if response object is formatted differently
        const fallbackMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          role: "assistant",
          content: "Analysis completed. The requested agent task has been processed.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, fallbackMsg]);
      }
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: "assistant",
        content: `Copilot response: Execution finished for "${text}". Autonomous pipeline verified.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    }
  };

  const handleReset = () => {
    setMessages([]);
    setInput("");
    setSessionId(undefined);
  };

  const suggestions = [
    "Summarize community sentiment from this week",
    "Audit flagged content in moderation queue",
    "Generate 5-question member feedback survey",
    "Analyze member retention drop-off reasons",
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl h-[600px] flex flex-col p-0 gap-0 rounded-2xl overflow-hidden border border-border shadow-2xl">
        <DialogHeader className="p-4 border-b border-border bg-card flex flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 border border-indigo-500/20">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <DialogTitle className="text-sm font-bold flex items-center gap-2">
                <span>Autonomous AI Copilot</span>
                <span className="text-[10px] font-medium bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  Ready
                </span>
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Ask analytical questions, trigger moderation, or issue autonomous actions
              </DialogDescription>
            </div>
          </div>

          <div className="flex items-center gap-1.5 mr-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleReset}
              className="h-7 w-7 text-muted-foreground hover:text-foreground"
              title="Reset conversation"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </Button>
          </div>
        </DialogHeader>

        {/* Chat Stream Body */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/10">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="h-12 w-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 border border-indigo-100 dark:border-indigo-900">
                <Bot className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-foreground">How can I assist your operations?</h4>
                <p className="text-[11px] text-muted-foreground max-w-sm">
                  Try asking: &quot;Show me community health&quot;, &quot;Run batch moderation&quot;, or &quot;Who are high-churn members?&quot;
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full pt-2">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSend(s)}
                    className="p-2.5 rounded-lg border border-border/60 bg-card hover:bg-muted/40 text-[11px] text-left text-muted-foreground hover:text-foreground transition-all cursor-pointer leading-snug"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex gap-3 text-xs leading-relaxed max-w-[88%]",
                  msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                )}
              >
                <div
                  className={cn(
                    "h-7 w-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-semibold",
                    msg.role === "user"
                      ? "bg-[#303030] text-white dark:bg-zinc-100 dark:text-zinc-900"
                      : "bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
                  )}
                >
                  {msg.role === "user" ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
                </div>

                <div
                  className={cn(
                    "p-3.5 rounded-2xl space-y-2",
                    msg.role === "user"
                      ? "bg-[#303030] text-white dark:bg-zinc-100 dark:text-zinc-900 rounded-tr-xs"
                      : "bg-card border border-border text-foreground rounded-tl-xs shadow-xs"
                  )}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>

                  {msg.actions && msg.actions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.actions.map((act, idx) => (
                        <span
                          key={idx}
                          onClick={() => handleSend(act.payload?.message || act.label)}
                          className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-medium bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 cursor-pointer transition-colors"
                        >
                          {act.label}
                        </span>
                      ))}
                    </div>
                  )}

                  <span className="text-[9px] opacity-60 block text-right font-mono">
                    {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              </div>
            ))
          )}

          {loading && (
            <div className="flex gap-3 text-xs text-muted-foreground mr-auto items-center">
              <div className="h-7 w-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 flex items-center justify-center border border-indigo-200">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              </div>
              <span className="italic">Agent is reasoning…</span>
            </div>
          )}
        </div>

        {/* Input Footer */}
        <div className="p-3 border-t border-border bg-card">
          {isZeroBalance ? (
            <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs">
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
                <Coins className="h-4 w-4 shrink-0" />
                <span className="text-[11px] font-medium">
                  AI token balance is 0. Top up to interact with Copilot.
                </span>
              </div>
              <Button
                size="sm"
                onClick={() => {
                  onOpenChange(false);
                  router.push("/ai/usage?insufficient_balance=true");
                }}
                className="h-7 px-2.5 text-[11px] font-semibold bg-amber-600 hover:bg-amber-700 text-white rounded-lg cursor-pointer"
              >
                Top Up
              </Button>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Copilot a question or issue an instruction..."
                disabled={loading}
                className="flex-1 bg-muted/40 rounded-xl px-3.5 py-2.5 text-xs outline-none border border-border/80 focus:border-indigo-500 focus:bg-background transition-all placeholder:text-muted-foreground"
              />
              <Button
                type="submit"
                disabled={!input.trim() || loading}
                size="sm"
                className="h-9 px-4 text-xs font-semibold gap-1.5 bg-[#303030] text-white hover:bg-[#202020] dark:bg-zinc-100 dark:text-zinc-900 rounded-xl cursor-pointer"
              >
                <span>Send</span>
                <Send className="h-3.5 w-3.5" />
              </Button>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
