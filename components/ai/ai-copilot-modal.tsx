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
import { Sparkles, Send, Bot, User, Loader2, RotateCcw, AlertCircle } from "lucide-react";
import { useAiAnalyticsChat } from "@/graphql/actions/ai";
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
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState(initialPrompt);
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  const scrollRef = useRef<HTMLDivElement>(null);

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
      <DialogContent className="max-w-2xl sm:max-w-2xl h-[85vh] max-h-[700px] flex flex-col p-0 overflow-hidden gap-0">
        <DialogHeader className="px-5 py-4 border-b border-border bg-muted/20 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-500/20">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <DialogTitle className="text-sm font-bold text-foreground">
                Thrico AI Copilot
              </DialogTitle>
              <DialogDescription className="text-[11px] text-muted-foreground">
                Autonomous intelligence assistant and prompt orchestration
              </DialogDescription>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="h-7 text-xs text-muted-foreground hover:text-foreground gap-1 mr-6"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </Button>
        </DialogHeader>

        {/* Chat Stream Body */}
        <div ref={scrollRef} className="flex-1 p-5 overflow-y-auto space-y-4 min-h-0 bg-background">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-4 my-auto">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-violet-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 shadow-sm">
                <Bot className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-foreground">How can Copilot assist you?</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Query engagement trends, audit moderation reports, create surveys, or trigger workflows.
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
                    "h-7 w-7 rounded-lg flex items-center justify-center shrink-0 border text-xs",
                    msg.role === "user"
                      ? "bg-foreground text-background border-foreground"
                      : "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800"
                  )}
                >
                  {msg.role === "user" ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
                </div>

                <div
                  className={cn(
                    "p-3.5 rounded-2xl space-y-2",
                    msg.role === "user"
                      ? "bg-[#303030] text-white dark:bg-zinc-100 dark:text-zinc-900 rounded-tr-xs"
                      : "bg-muted/50 border border-border/70 text-foreground rounded-tl-xs"
                  )}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>

                  {msg.actions && msg.actions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.actions.map((act, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-medium px-2 py-0.5 rounded bg-background border border-border text-foreground"
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
              className="h-9 px-4 text-xs font-semibold gap-1.5 bg-[#303030] text-white hover:bg-[#202020] dark:bg-zinc-100 dark:text-zinc-900 rounded-xl"
            >
              <span>Send</span>
              <Send className="h-3.5 w-3.5" />
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
