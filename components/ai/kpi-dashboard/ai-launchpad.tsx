"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Zap,
  MessageSquare,
  Bot,
  ShieldAlert,
  BarChart3,
  ArrowRight,
  Sparkles,
  Send,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface AILaunchpadProps {
  onOpenCopilot?: (prompt?: string) => void;
  onOpenTopup?: () => void;
}

export function AILaunchpad({ onOpenCopilot, onOpenTopup }: AILaunchpadProps) {
  const router = useRouter();
  const [quickPrompt, setQuickPrompt] = useState("");

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickPrompt.trim()) return;
    onOpenCopilot?.(quickPrompt.trim());
    setQuickPrompt("");
  };

  const launchItems = [
    {
      title: "Interactive Copilot",
      description: "Ask questions, query insights, or execute actions",
      icon: MessageSquare,
      color: "text-blue-600 bg-blue-50 dark:bg-blue-950/40 border-blue-100 dark:border-blue-900/40",
      action: () => onOpenCopilot?.(),
    },
    {
      title: "Super Agents Hub",
      description: "Manage, configure, and inspect autonomous workers",
      icon: Bot,
      color: "text-purple-600 bg-purple-50 dark:bg-purple-950/40 border-purple-100 dark:border-purple-900/40",
      action: () => router.push("/ai/agents"),
    },
    {
      title: "Content Moderation",
      description: "Inspect safety thresholds and toxic language queues",
      icon: ShieldAlert,
      color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-100 dark:border-emerald-900/40",
      action: () => router.push("/ai/moderation"),
    },
    {
      title: "Token Quota & Top-up",
      description: "Add inference credits or adjust enterprise tier",
      icon: BarChart3,
      color: "text-amber-600 bg-amber-50 dark:bg-amber-950/40 border-amber-100 dark:border-amber-900/40",
      action: () => onOpenTopup?.(),
    },
  ];

  return (
    <div id="kpi-section-launchpad" className="space-y-4 pt-2">
      <div className="flex items-center gap-2">
        <div className="h-6 w-6 rounded-md bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
          <Zap className="h-3.5 w-3.5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-foreground">
            6. Quick Launchpad & Copilot Console
          </h3>
          <p className="text-[11px] text-muted-foreground">
            Direct access to conversational Copilot, agent builders, and quota controls
          </p>
        </div>
      </div>

      {/* Quick Prompt Input Bar */}
      <form
        onSubmit={handleQuickSubmit}
        className="relative flex items-center rounded-xl border border-border/80 bg-card p-2 shadow-sm transition-all focus-within:border-indigo-500/80 focus-within:ring-2 focus-within:ring-indigo-500/10"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 shrink-0 ml-1">
          <Sparkles className="h-4 w-4" />
        </div>
        <input
          type="text"
          value={quickPrompt}
          onChange={(e) => setQuickPrompt(e.target.value)}
          placeholder="Ask Copilot anything... (e.g. 'Summarize community sentiment from this week' or 'Audit feed moderation')"
          className="flex-1 bg-transparent px-3 text-xs outline-none placeholder:text-muted-foreground/70 text-foreground"
        />
        <Button
          type="submit"
          size="sm"
          disabled={!quickPrompt.trim()}
          className="h-8 text-xs font-semibold gap-1.5 px-3 bg-[#303030] text-white hover:bg-[#202020] dark:bg-zinc-100 dark:text-zinc-900"
        >
          <span>Ask</span>
          <Send className="h-3 w-3" />
        </Button>
      </form>

      {/* 4 Launchpad Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {launchItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={idx}
              type="button"
              onClick={item.action}
              className="group flex items-start gap-3 p-4 rounded-xl border border-border/60 bg-card hover:border-border hover:shadow-2xs transition-all text-left cursor-pointer"
            >
              <div className={cn("h-9 w-9 rounded-lg flex items-center justify-center shrink-0 border", item.color)}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[12px] font-bold text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {item.title}
                </p>
                <p className="text-[10.5px] text-muted-foreground mt-0.5 leading-snug line-clamp-2">
                  {item.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
