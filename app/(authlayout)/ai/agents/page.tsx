"use client";

import React, { useState } from "react";
import {
  Bot,
  RotateCcw,
  Plus,
  Sparkles,
  Users,
  FileText,
  ShieldAlert,
  UserCheck,
  Search,
  Play,
  Settings2,
  CheckCircle2,
  Clock,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AICopilotModal } from "@/components/ai/ai-copilot-modal";
import { cn } from "@/lib/utils";

export default function AIAgentsPage() {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showCopilot, setShowCopilot] = useState(false);
  const [activePrompt, setActivePrompt] = useState("");

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const handleRunAgent = (prompt: string) => {
    setActivePrompt(prompt);
    setShowCopilot(true);
  };

  const agents = [
    {
      id: "agent-community",
      name: "Community Copilot",
      role: "Conversational & Discussion Assistant",
      description: "Assists members in channels, answers common onboarding questions, and provides daily community recaps.",
      icon: Users,
      iconColor: "text-blue-600 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900",
      model: "GPT-4o",
      status: "ACTIVE",
      statusColor: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200",
      invocations: 5631,
      successRate: "99.4%",
      latency: "280ms",
      promptTemplate: "Summarize community discussion highlights from the last 7 days",
    },
    {
      id: "agent-moderation",
      name: "Content Moderation Sentinel",
      role: "Safety, Toxicity & Spam Guard",
      description: "Proactively audits member posts, comments, and media against community guidelines in real-time.",
      icon: ShieldAlert,
      iconColor: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900",
      model: "Claude 3.5 Sonnet",
      status: "ACTIVE",
      statusColor: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200",
      invocations: 4001,
      successRate: "99.8%",
      latency: "190ms",
      promptTemplate: "Audit flagged content and generate risk assessment summary",
    },
    {
      id: "agent-survey",
      name: "Survey Intelligence Agent",
      role: "Questionnaire Design & Sentiment Synthesis",
      description: "Creates targeted questionnaires, analyzes feedback sentiment, and flags at-risk member segments.",
      icon: FileText,
      iconColor: "text-purple-600 bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-900",
      model: "GPT-4o",
      status: "ACTIVE",
      statusColor: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200",
      invocations: 2371,
      successRate: "98.9%",
      latency: "340ms",
      promptTemplate: "Generate a 5-question member onboarding survey template",
    },
    {
      id: "agent-retention",
      name: "Membership Retention Agent",
      role: "Engagement Predictor & Churn Guard",
      description: "Monitors activity drops and triggers personalized engagement nudges and event recommendations.",
      icon: UserCheck,
      iconColor: "text-amber-600 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900",
      model: "Gemini 1.5 Pro",
      status: "STANDBY",
      statusColor: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border-zinc-200",
      invocations: 1778,
      successRate: "99.1%",
      latency: "220ms",
      promptTemplate: "List member engagement trends and identify churn risks",
    },
    {
      id: "agent-research",
      name: "Deep Research & Digest Agent",
      role: "Executive Summaries & Ecosystem Radar",
      description: "Synthesizes cross-network metrics, produces weekly executive digests, and tracks ecosystem benchmarks.",
      icon: Search,
      iconColor: "text-rose-600 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900",
      model: "Claude 3.5 Sonnet",
      status: "STANDBY",
      statusColor: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border-zinc-200",
      invocations: 1039,
      successRate: "98.5%",
      latency: "410ms",
      promptTemplate: "Compile weekly performance digest across all active modules",
    },
  ];

  const agentSkills = [
    { title: "Survey Builder Skill", desc: "Constructs validated questionnaires with scale and rating questions", tools: "SurveyService, TemplateCatalog" },
    { title: "Moderation Classifier Skill", desc: "Performs toxicity, PII, and spam probability scoring", tools: "ModerationWorker, S3Vision" },
    { title: "Community Analytics Skill", desc: "Extracts conversation topics, sentiment, and active participant clusters", tools: "FeedService, GraphDB" },
    { title: "Email Campaign Drafter Skill", desc: "Generates high-converting subject lines and MJML templates", tools: "EmailWorker, MJMLRenderer" },
  ];

  return (
    <EcosystemWrapper className="m-2">
      <EcosystemHeader
        title="Autonomous Super Agents Directory"
        description="Deploy, configure, and monitor domain-specialized autonomous agents across your community"
        icon={Bot}
        badgeText="Super Agents"
        breadcrumbs={[{ label: "AI", href: "/ai" }, { label: "Agents" }]}
        actions={
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 text-zinc-400 hover:text-indigo-600 rounded-lg transition-all"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RotateCcw
                size={14}
                className={cn(isRefreshing && "animate-spin")}
              />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleRunAgent("Help me explore available super agents")}
              className="h-9 rounded-lg text-xs gap-1.5 font-medium border-border"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Test Runner
            </Button>
            <Button
              size="sm"
              onClick={() => handleRunAgent("Create a new custom agent with specific tool permissions")}
              className="h-9 rounded-lg gap-2 text-xs font-semibold bg-[#303030] text-white hover:bg-[#202020] dark:bg-zinc-100 dark:text-zinc-900"
            >
              <Plus className="h-3.5 w-3.5" />
              Create Agent
            </Button>
          </div>
        }
      />

      <EcosystemContainer className="p-6 lg:p-8 space-y-8">
        {/* Active Agents Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-foreground">
                Configured Entity Super Agents
              </h3>
              <p className="text-[11px] text-muted-foreground">
                Active autonomous agents with dedicated execution loops and tool access
              </p>
            </div>
            <Badge variant="outline" className="text-[10px] text-indigo-600 dark:text-indigo-400 border-indigo-200">
              5 Agents Installed
            </Badge>
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

                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      {agent.description}
                    </p>

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
                        <span className="text-muted-foreground block text-[9px]">Latency</span>
                        <strong className="font-bold text-foreground">{agent.latency}</strong>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-border/40">
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        {agent.successRate} Success
                      </span>

                      <Button
                        size="sm"
                        onClick={() => handleRunAgent(agent.promptTemplate)}
                        className="h-7 text-[11px] font-semibold px-2.5 gap-1 bg-[#303030] text-white hover:bg-[#202020] dark:bg-zinc-100 dark:text-zinc-900"
                      >
                        <Play className="h-2.5 w-2.5 fill-current" />
                        Run Agent
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Built-in Skills & Tools */}
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-bold text-foreground">
              Agent Skills & Tool Integrations
            </h3>
            <p className="text-[11px] text-muted-foreground">
              Modular tool capabilities granted to supervisor and worker agents
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {agentSkills.map((skill, idx) => (
              <Card key={idx} className="border-border/60 bg-card p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-md bg-indigo-500/10 text-indigo-600 flex items-center justify-center shrink-0">
                    <Zap className="h-3 w-3" />
                  </div>
                  <h4 className="text-xs font-bold text-foreground">{skill.title}</h4>
                </div>
                <p className="text-[11px] text-muted-foreground leading-snug">
                  {skill.desc}
                </p>
                <div className="pt-1 text-[10px] font-mono text-muted-foreground/80">
                  {skill.tools}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Copilot Test Modal */}
        <AICopilotModal
          open={showCopilot}
          onOpenChange={setShowCopilot}
          initialPrompt={activePrompt}
        />
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
