"use client";

import React from "react";
import {
  Bot,
  Users,
  FileText,
  ShieldAlert,
  UserCheck,
  Search,
  Play,
  Settings2,
  ExternalLink,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface AIAgentsDirectoryProps {
  loading: boolean;
  onOpenCopilot?: (agentPrompt?: string) => void;
  onConfigureAgent?: (agentId: string) => void;
}

export function AIAgentsDirectory({
  loading,
  onOpenCopilot,
  onConfigureAgent,
}: AIAgentsDirectoryProps) {
  const agents = [
    {
      id: "agent-community",
      name: "Community Copilot",
      role: "Conversational & Engagement Assistant",
      description: "Assists members in channels, answers common queries, and creates topic summaries.",
      icon: Users,
      iconColor: "text-blue-600 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900",
      model: "GPT-4o",
      status: "ACTIVE",
      statusColor: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200",
      invocations: 5631,
      successRate: "99.4%",
      lastRun: "3 mins ago",
      defaultPrompt: "Summarize top discussions from this week across community channels",
    },
    {
      id: "agent-moderation",
      name: "Content Moderation Sentinel",
      role: "Safety, Toxicity & Spam Guard",
      description: "Analyzes member posts, comments, and media in real-time, auto-flagging policy violations.",
      icon: ShieldAlert,
      iconColor: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900",
      model: "Claude 3.5 Sonnet",
      status: "ACTIVE",
      statusColor: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200",
      invocations: 4001,
      successRate: "99.8%",
      lastRun: "1 min ago",
      defaultPrompt: "Run a moderation audit on recently flagged feed reports",
    },
    {
      id: "agent-survey",
      name: "Survey Intelligence Agent",
      role: "Feedback Synthesis & Sentiment Analysis",
      description: "Generates custom questionnaires, tracks member sentiment, and extracts actionable takeaways.",
      icon: FileText,
      iconColor: "text-purple-600 bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-900",
      model: "GPT-4o",
      status: "ACTIVE",
      statusColor: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200",
      invocations: 2371,
      successRate: "98.9%",
      lastRun: "18 mins ago",
      defaultPrompt: "Create a 5-question member onboarding survey template",
    },
    {
      id: "agent-retention",
      name: "Membership Retention Agent",
      role: "Churn Predictor & Onboarding Guide",
      description: "Detects declining member activity and triggers proactive personalized recommendations.",
      icon: UserCheck,
      iconColor: "text-amber-600 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900",
      model: "Gemini 1.5 Pro",
      status: "STANDBY",
      statusColor: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border-zinc-200",
      invocations: 1778,
      successRate: "99.1%",
      lastRun: "2 hours ago",
      defaultPrompt: "Identify members with declining 30-day activity trends",
    },
    {
      id: "agent-research",
      name: "Deep Research & Digest Agent",
      role: "Ecosystem Intelligence & Digest Compiler",
      description: "Compiles periodic executive digests, monitors industry topics, and cross-references data.",
      icon: Search,
      iconColor: "text-rose-600 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900",
      model: "Claude 3.5 Sonnet",
      status: "STANDBY",
      statusColor: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border-zinc-200",
      invocations: 1039,
      successRate: "98.5%",
      lastRun: "5 hours ago",
      defaultPrompt: "Generate a weekly executive summary of community growth metrics",
    },
  ];

  return (
    <div id="kpi-section-agents" className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-md bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400">
            <Bot className="h-3.5 w-3.5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">
              4. Autonomous Super Agents Directory
            </h3>
            <p className="text-[11px] text-muted-foreground">
              Deployed specialized agents configured for automated orchestration
            </p>
          </div>
        </div>

        <span className="text-[11px] font-semibold text-muted-foreground">
          5 Configured Agents
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {agents.map((agent) => {
          const Icon = agent.icon;
          return (
            <Card
              key={agent.id}
              className="border-border/60 bg-card shadow-2xs hover:border-border hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <CardContent className="p-4 space-y-3">
                {/* Header: Icon + Name + Status */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center shrink-0 border", agent.iconColor)}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-foreground leading-tight">
                        {agent.name}
                      </h4>
                      <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">
                        {agent.role}
                      </p>
                    </div>
                  </div>

                  <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider", agent.statusColor)}>
                    {agent.status}
                  </span>
                </div>

                <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
                  {agent.description}
                </p>

                {/* Specs */}
                <div className="grid grid-cols-3 gap-1.5 p-2 rounded-lg bg-muted/40 text-[10px]">
                  <div>
                    <span className="text-muted-foreground block text-[9px]">Model</span>
                    <strong className="font-bold text-foreground">{agent.model}</strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[9px]">Invocations</span>
                    <strong className="font-bold text-foreground">{agent.invocations.toLocaleString()}</strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[9px]">Success</span>
                    <strong className="font-bold text-emerald-600 dark:text-emerald-400">{agent.successRate}</strong>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-between pt-1 border-t border-border/40">
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {agent.lastRun}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onConfigureAgent?.(agent.id)}
                      className="h-7 text-[11px] px-2 text-muted-foreground hover:text-foreground"
                    >
                      <Settings2 className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => onOpenCopilot?.(agent.defaultPrompt)}
                      className="h-7 text-[11px] font-semibold px-2.5 gap-1 bg-[#303030] text-white hover:bg-[#202020] dark:bg-zinc-100 dark:text-zinc-900"
                    >
                      <Play className="h-2.5 w-2.5 fill-current" />
                      Run
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
