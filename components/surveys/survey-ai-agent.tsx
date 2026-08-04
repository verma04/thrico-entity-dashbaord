"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { CtaButton } from "@/components/ui/cta-button";
import { Badge } from "@/components/ui/badge";
import {
  Bot,
  Sparkles,
  ChevronRight,
  ClipboardList,
  BarChart3,
  Users,
  Star,
  Zap,
  X,
} from "lucide-react";
import ChatInterface from "@/components/chat/chat-interface";
import { useGetUser } from "@/graphql/actions";

// Suggestion chips shown before the user types anything
const SURVEY_SUGGESTIONS = [
  {
    icon: ClipboardList,
    label: "Employee satisfaction survey",
    prompt: "Create an employee satisfaction survey with questions about work-life balance, management, and growth opportunities.",
  },
  {
    icon: BarChart3,
    label: "Product feedback survey",
    prompt: "Create a product feedback survey to collect user ratings, feature requests, and overall satisfaction.",
  },
  {
    icon: Users,
    label: "Community engagement survey",
    prompt: "Create a community engagement survey to understand member activity, interests, and what content they want to see more of.",
  },
  {
    icon: Star,
    label: "Event feedback survey",
    prompt: "Create a post-event survey to collect attendee feedback on the venue, content quality, speakers, and overall experience.",
  },
  {
    icon: Zap,
    label: "Quick pulse check",
    prompt: "Create a short 5-question pulse check survey to quickly gauge team morale and identify blockers.",
  },
];

interface SurveyAIAgentProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function SurveyAIAgentSheet({ open, onOpenChange }: SurveyAIAgentProps) {
  const { data } = useGetUser();
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const [chatStarted, setChatStarted] = useState(false);

  const userId = data?.getUser?.id || "user_1";
  const workspaceId = "131c5015-7456-4c83-a9df-a2b3288489cc";

  const handleSuggestionClick = (prompt: string) => {
    setSelectedPrompt(prompt);
    setChatStarted(true);
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset state after sheet animation
    setTimeout(() => {
      setSelectedPrompt(null);
      setChatStarted(false);
    }, 300);
  };

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[600px] p-0 flex flex-col overflow-hidden border-l border-zinc-200 shadow-2xl"
      >
        {/* Gradient Header */}
        <div
          className="relative flex flex-col gap-3 px-6 pt-6 pb-5 shrink-0 overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #a855f7 100%)",
          }}
        >
          {/* Decorative blobs */}
          <div
            className="absolute -top-6 -right-6 h-32 w-32 rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, #fff 0%, transparent 70%)" }}
          />
          <div
            className="absolute bottom-0 left-10 h-20 w-20 rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, #fff 0%, transparent 70%)" }}
          />

          <SheetHeader className="p-0 text-left">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm ring-1 ring-white/30 shadow-inner">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div>
                  <SheetTitle className="text-white font-bold text-base tracking-tight leading-tight">
                    Survey AI Agent
                  </SheetTitle>
                  <p className="text-white/70 text-[11px] font-medium tracking-wide">
                    Powered by Thrico Intelligence
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-white/20 text-white border-white/30 text-[10px] font-bold uppercase tracking-widest hover:bg-white/25 px-2.5 py-1">
                  <Sparkles className="h-2.5 w-2.5 mr-1" />
                  AI
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClose}
                  className="h-8 w-8 rounded-lg text-white/70 hover:text-white hover:bg-white/20"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </SheetHeader>

          {!chatStarted && (
            <p className="text-white/80 text-xs leading-relaxed relative z-10">
              Describe the survey you need and I'll draft questions, set up
              logic flows, and configure it — ready to publish in seconds.
            </p>
          )}
        </div>

        {/* Suggestion Chips — shown before chat starts */}
        {!chatStarted && (
          <div className="px-5 py-4 border-b border-zinc-100 bg-zinc-50/60 shrink-0">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-3">
              Quick Start Templates
            </p>
            <div className="flex flex-col gap-2">
              {SURVEY_SUGGESTIONS.map((s) => {
                const Icon = s.icon;
                return (
                  <button
                    key={s.label}
                    onClick={() => handleSuggestionClick(s.prompt)}
                    className="group flex items-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-left shadow-sm transition-all hover:border-indigo-300 hover:shadow-md hover:bg-indigo-50/40 active:scale-[0.99]"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-500 group-hover:bg-indigo-100 transition-colors">
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="flex-1 text-xs font-semibold text-zinc-700 group-hover:text-indigo-700 transition-colors leading-snug">
                      {s.label}
                    </span>
                    <ChevronRight className="h-3.5 w-3.5 text-zinc-300 group-hover:text-indigo-400 transition-colors shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Chat Interface */}
        <div className="flex-1 overflow-hidden">
          <ChatInterface
            userId={userId}
            workspaceId={workspaceId}
            initialMessage={selectedPrompt ?? undefined}
            compact
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Trigger button — drop this anywhere in the header actions
export function SurveyAIAgentButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <CtaButton
        onClick={() => setOpen(true)}
        id="survey-ai-agent-btn"
        className="relative overflow-hidden border-0 text-white gap-1.5 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
        style={{
          background:
            "linear-gradient(135deg, #4f46e5 0%, #7c3aed 60%, #a855f7 100%)",
        }}
      >
        {/* Shimmer overlay */}
        <span
          className="pointer-events-none absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
          style={{
            background:
              "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.18) 50%, transparent 60%)",
          }}
        />
        <Sparkles className="h-3.5 w-3.5 shrink-0" />
        Create with AI
      </CtaButton>

      <SurveyAIAgentSheet open={open} onOpenChange={setOpen} />
    </>
  );
}
