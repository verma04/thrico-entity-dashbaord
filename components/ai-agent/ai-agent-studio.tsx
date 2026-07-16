"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  Square,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Loader2,
  Zap,
  Brain,
  Terminal,
  ChevronRight,
  Sparkles,
  Clock,
  AlertCircle,
  Play,
  FileText,
  Search,
  Shield,
  Cpu,
  Network,
  Lightbulb,
  ExternalLink,
  Star,
  ToggleLeft,
  AlignLeft,
  SlidersHorizontal,
  Hash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const AGENT_RUNTIME_URL = "http://localhost:4010/agent/stream";

type LogStatus = "RUNNING" | "SUCCESS" | "ERROR" | "INFO" | "THINKING" | "DONE";

interface AgentLog {
  id: string;
  timestamp: Date;
  status: LogStatus;
  agent?: string;
  step?: string;
  message: string;
  data?: Record<string, any>;
}

interface StreamEvent {
  status: LogStatus;
  agent?: string;
  step?: string;
  message: string;
  data?: Record<string, any>;
}

const agentIconMap: Record<string, React.ReactNode> = {
  "orchestrator": <Network size={12} />,
  "survey-agent": <FileText size={12} />,
  "research-agent": <Search size={12} />,
  "moderation-agent": <Shield size={12} />,
  "task-coordinator": <Cpu size={12} />,
  "insights-agent": <Lightbulb size={12} />,
  "default": <Brain size={12} />,
};

const statusConfig: Record<LogStatus, { color: string; bg: string; icon: React.ReactNode; label: string }> = {
  RUNNING: {
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
    icon: <Loader2 size={11} className="animate-spin" />,
    label: "Running",
  },
  THINKING: {
    color: "text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/20",
    icon: <Brain size={11} className="animate-pulse" />,
    label: "Thinking",
  },
  SUCCESS: {
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
    icon: <CheckCircle2 size={11} />,
    label: "Done",
  },
  ERROR: {
    color: "text-red-400",
    bg: "bg-red-500/10 border-red-500/20",
    icon: <XCircle size={11} />,
    label: "Error",
  },
  INFO: {
    color: "text-slate-400",
    bg: "bg-slate-500/10 border-slate-500/20",
    icon: <ChevronRight size={11} />,
    label: "Info",
  },
  DONE: {
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
    icon: <CheckCircle2 size={11} />,
    label: "Complete",
  },
};

// ─── Survey question type display helpers ───────────────────────────────────
const qTypeIcon: Record<string, React.ReactNode> = {
  RATING:        <Star size={10} />,
  YES_NO:        <ToggleLeft size={10} />,
  LONG_TEXT:     <AlignLeft size={10} />,
  SHORT_TEXT:    <AlignLeft size={10} />,
  OPINION_SCALE: <SlidersHorizontal size={10} />,
  MULTIPLE:      <Hash size={10} />,
};
const qTypeLabel: Record<string, string> = {
  RATING:        "Rating",
  YES_NO:        "Yes / No",
  LONG_TEXT:     "Long text",
  SHORT_TEXT:    "Short text",
  OPINION_SCALE: "Opinion scale",
  MULTIPLE:      "Multiple choice",
};

interface SurveyQuestion {
  question: string;
  type: string;
  required?: boolean;
  scale?: number;
  ratingType?: string;
  labels?: { start?: string; end?: string };
  options?: string[];
}

interface SurveyOutput {
  id?: string;
  title: string;
  description?: string;
  questions: SurveyQuestion[];
  generatedAt?: string;
}

function SurveyArtifactCard({ survey }: { survey: SurveyOutput }) {
  return (
    <div className="mt-2 rounded-xl border border-violet-500/20 bg-gradient-to-br from-violet-500/5 to-blue-600/5 overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 px-4 py-3 border-b border-violet-500/10 bg-violet-500/5">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="shrink-0 flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500/20 text-violet-400">
            <FileText size={13} />
          </div>
          <div className="min-w-0">
            <p className="text-[12px] font-semibold text-slate-200 leading-tight truncate">{survey.title}</p>
            {survey.description && (
              <p className="text-[10.5px] text-slate-500 leading-snug mt-0.5 line-clamp-1">{survey.description}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] font-mono text-violet-400 bg-violet-500/10 border border-violet-500/20 px-1.5 py-0.5 rounded">
            {survey.questions.length} questions
          </span>
          <Link
            href="/surveys/templates"
            className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-blue-400 hover:text-blue-300 transition-colors"
          >
            View Templates
            <ExternalLink size={9} />
          </Link>
        </div>
      </div>

      {/* Questions list */}
      <div className="px-4 py-3 space-y-2 max-h-[280px] overflow-y-auto">
        {survey.questions.map((q, i) => (
          <div key={i} className="flex items-start gap-2.5 group">
            <span className="shrink-0 mt-0.5 text-[10px] font-mono text-slate-600 w-4 text-right">{i + 1}.</span>
            <div className="flex-1 min-w-0">
              <p className="text-[11.5px] text-slate-300 leading-snug">{q.question}</p>
              <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                <span className="inline-flex items-center gap-1 text-[9.5px] font-mono text-violet-400/80 bg-violet-500/10 border border-violet-500/15 px-1.5 py-0.5 rounded">
                  {qTypeIcon[q.type] ?? <Hash size={10} />}
                  {qTypeLabel[q.type] ?? q.type}
                </span>
                {q.required && (
                  <span className="text-[9px] text-red-400/70 font-mono">required</span>
                )}
                {q.scale && (
                  <span className="text-[9px] text-slate-600 font-mono">1–{q.scale}</span>
                )}
                {q.labels?.start && (
                  <span className="text-[9px] text-slate-600 font-mono italic">
                    {q.labels.start} → {q.labels.end}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer CTA */}
      <div className="px-4 py-2.5 border-t border-violet-500/10 flex items-center justify-between bg-black/20">
        <span className="text-[10px] text-slate-600 font-mono">
          Generated by survey_agent
        </span>
        <Link href="/surveys/templates">
          <Button
            size="sm"
            className="h-6 text-[10.5px] px-3 gap-1 bg-violet-600 hover:bg-violet-500 text-white border-0 rounded-md"
          >
            <Sparkles size={9} />
            Open Survey Templates
          </Button>
        </Link>
      </div>
    </div>
  );
}

const EXAMPLE_PROMPTS = [
  "Create an employee engagement survey for remote teams",
  "Generate a performance review questionnaire for engineering managers",
  "Design a pulse survey to measure team morale after a reorg",
  "Build an onboarding satisfaction survey for new hires",
];

function LogEntry({ log, isLatest }: { log: AgentLog; isLatest: boolean }) {
  const cfg = statusConfig[log.status] ?? statusConfig.INFO;
  const agentIcon = log.agent
    ? (agentIconMap[log.agent.toLowerCase()] ?? agentIconMap["default"])
    : agentIconMap["default"];

  return (
    <div
      className={cn(
        "group flex gap-3 py-2.5 px-3 rounded-lg transition-all duration-200",
        isLatest && log.status === "RUNNING"
          ? "bg-blue-500/5 border border-blue-500/10"
          : "hover:bg-white/[0.02]",
      )}
    >
      {/* Timeline dot */}
      <div className="flex flex-col items-center gap-1 pt-0.5 shrink-0">
        <div
          className={cn(
            "flex items-center justify-center w-5 h-5 rounded-full border",
            cfg.bg,
            cfg.color,
          )}
        >
          {cfg.icon}
        </div>
        {isLatest && log.status === "RUNNING" && (
          <div className="w-px flex-1 bg-gradient-to-b from-blue-500/30 to-transparent min-h-[8px]" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center gap-2 flex-wrap">
          {log.agent && (
            <span
              className={cn(
                "inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold border",
                cfg.bg,
                cfg.color,
              )}
            >
              {agentIcon}
              {log.agent}
            </span>
          )}
          {log.step && (
            <span className="text-[10px] text-slate-500 font-mono">
              {log.step}
            </span>
          )}
          <span className="text-[10px] text-slate-600 ml-auto font-mono">
            {new Date(log.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </span>
        </div>
        <p className="text-[12.5px] text-slate-300 leading-relaxed font-mono break-words">
          {log.message}
        </p>
        {log.data && Object.keys(log.data).length > 0 && (
          <>
            {/* Survey agent artifact: render rich card instead of raw JSON */}
            {(log.data.selectedAgent === "survey_agent" || log.data.agentOutput?.type === "survey") &&
            log.data.agentOutput?.survey ? (
              <SurveyArtifactCard survey={log.data.agentOutput.survey} />
            ) : (
              <div className="mt-1.5 p-2 rounded bg-black/30 border border-white/5 overflow-x-auto">
                <pre className="text-[10.5px] text-slate-400 font-mono whitespace-pre-wrap break-all">
                  {JSON.stringify(log.data, null, 2)}
                </pre>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-3 py-2.5 px-3">
      <div className="flex flex-col items-center gap-1 pt-0.5 shrink-0">
        <div className="flex items-center justify-center w-5 h-5 rounded-full border bg-blue-500/10 border-blue-500/20 text-blue-400">
          <Loader2 size={11} className="animate-spin" />
        </div>
      </div>
      <div className="flex items-center gap-1.5 mt-1">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-400/60 animate-bounce [animation-delay:0ms]" />
        <span className="w-1.5 h-1.5 rounded-full bg-blue-400/60 animate-bounce [animation-delay:150ms]" />
        <span className="w-1.5 h-1.5 rounded-full bg-blue-400/60 animate-bounce [animation-delay:300ms]" />
        <span className="text-[11px] text-slate-500 font-mono ml-1">Agent is processing…</span>
      </div>
    </div>
  );
}

export default function AIAgentStudio() {
  const [prompt, setPrompt] = useState("");
  const [logs, setLogs] = useState<AgentLog[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [elapsedMs, setElapsedMs] = useState<number | null>(null);
  const [sessionId] = useState(() => Math.random().toString(36).slice(2, 10));

  const readerRef = useRef<ReadableStreamDefaultReader<Uint8Array> | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const logIdCounter = useRef(0);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [logs, scrollToBottom]);

  const stopStream = useCallback(() => {
    abortRef.current?.abort();
    readerRef.current?.cancel().catch(() => {});
    if (timerRef.current) clearInterval(timerRef.current);
    setIsStreaming(false);
  }, []);

  const addLog = useCallback((event: StreamEvent) => {
    setLogs((prev) => [
      ...prev,
      {
        id: `log-${++logIdCounter.current}`,
        timestamp: new Date(),
        ...event,
      },
    ]);
  }, []);

  const runAgent = useCallback(async () => {
    if (!prompt.trim() || isStreaming) return;

    // Reset state
    setLogs([]);
    setIsComplete(false);
    setHasError(false);
    setElapsedMs(null);
    setIsStreaming(true);
    startTimeRef.current = Date.now();

    // Start elapsed timer
    timerRef.current = setInterval(() => {
      setElapsedMs(Date.now() - startTimeRef.current);
    }, 100);

    abortRef.current = new AbortController();

    // Optimistic info log
    addLog({
      status: "INFO",
      agent: "orchestrator",
      message: `Starting workflow: "${prompt.trim()}"`,
    });

    try {
      const response = await fetch(AGENT_RUNTIME_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userPrompt: prompt.trim(),
          tenantId: "ws_1",
          userId: "user_1",
          metadata: {},
        }),
        signal: abortRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      if (!response.body) {
        throw new Error("Streaming not supported by this browser.");
      }

      const reader = response.body.getReader();
      readerRef.current = reader;
      const decoder = new TextDecoder("utf-8");
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data:")) continue;

          const dataStr = trimmed.slice(5).trim();
          if (dataStr === "[DONE]") {
            if (timerRef.current) clearInterval(timerRef.current);
            setElapsedMs(Date.now() - startTimeRef.current);
            addLog({
              status: "DONE",
              message: "Workflow completed successfully.",
            });
            setIsComplete(true);
            setIsStreaming(false);
            return;
          }

          try {
            const event: StreamEvent = JSON.parse(dataStr);
            addLog(event);
          } catch {
            // Non-JSON SSE line — ignore
          }
        }
      }

      // Natural end of stream
      if (timerRef.current) clearInterval(timerRef.current);
      setElapsedMs(Date.now() - startTimeRef.current);
      addLog({ status: "DONE", message: "Stream ended." });
      setIsComplete(true);
    } catch (err: any) {
      if (err?.name === "AbortError") return;
      if (timerRef.current) clearInterval(timerRef.current);
      setElapsedMs(Date.now() - startTimeRef.current);
      setHasError(true);
      addLog({
        status: "ERROR",
        message: err?.message ?? "Unknown error occurred while connecting to agent runtime.",
      });
    } finally {
      setIsStreaming(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [prompt, isStreaming, addLog]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      runAgent();
    }
  };

  const handleReset = () => {
    stopStream();
    setLogs([]);
    setPrompt("");
    setIsComplete(false);
    setHasError(false);
    setElapsedMs(null);
  };

  const formatElapsed = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const hasLogs = logs.length > 0;

  return (
    <div className="flex flex-col h-full min-h-0 bg-background">
      {/* ── Header ── */}
      <div className="shrink-0 px-6 py-5 border-b border-border/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-600 shadow-lg shadow-violet-500/20">
              <Sparkles size={16} className="text-white" />
              <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 border-2 border-background" />
            </div>
            <div>
              <h1 className="text-[15px] font-semibold tracking-tight text-foreground">
                AI Agent Studio
              </h1>
              <p className="text-[11.5px] text-muted-foreground mt-0.5">
                LangGraph · Real-time SSE · Multi-agent orchestration
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {elapsedMs !== null && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted/50 border border-border/50">
                <Clock size={11} className="text-muted-foreground/60" />
                <span className="text-[11px] font-mono text-muted-foreground">
                  {formatElapsed(elapsedMs)}
                </span>
              </div>
            )}
            {isStreaming && (
              <Badge
                variant="outline"
                className="gap-1.5 text-blue-400 border-blue-500/30 bg-blue-500/10 text-[10.5px] px-2"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
                Streaming
              </Badge>
            )}
            {isComplete && !hasError && (
              <Badge
                variant="outline"
                className="gap-1.5 text-emerald-400 border-emerald-500/30 bg-emerald-500/10 text-[10.5px] px-2"
              >
                <CheckCircle2 size={10} />
                Complete
              </Badge>
            )}
            {hasError && (
              <Badge
                variant="outline"
                className="gap-1.5 text-red-400 border-red-500/30 bg-red-500/10 text-[10.5px] px-2"
              >
                <AlertCircle size={10} />
                Error
              </Badge>
            )}
            {hasLogs && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="h-7 gap-1.5 text-muted-foreground hover:text-foreground text-[12px]"
              >
                <RotateCcw size={12} />
                Reset
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* ── Body: Split view ── */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Left: Prompt panel */}
        <div className="w-[360px] shrink-0 flex flex-col border-r border-border/60 bg-sidebar/30">
          <div className="px-4 py-4 flex-1 flex flex-col gap-4">
            <div className="space-y-2">
              <label className="text-[11px] font-semibold uppercase tracking-[0.07em] text-muted-foreground/60">
                Your Prompt
              </label>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Describe what you want the AI to create…"
                disabled={isStreaming}
                rows={6}
                className={cn(
                  "resize-none text-[13px] font-mono leading-relaxed placeholder:text-muted-foreground/30",
                  "bg-background/60 border-border/60 focus-visible:ring-1 focus-visible:ring-primary/40",
                  "transition-all duration-200",
                  isStreaming && "opacity-60 cursor-not-allowed",
                )}
              />
              <p className="text-[10.5px] text-muted-foreground/40 text-right">
                ⌘↵ to run
              </p>
            </div>

            {/* Config */}
            <div className="space-y-2">
              <label className="text-[11px] font-semibold uppercase tracking-[0.07em] text-muted-foreground/60">
                Configuration
              </label>
              <div className="space-y-2">
                {[
                  { label: "Tenant ID", value: "ws_1" },
                  { label: "User ID", value: "user_1" },
                  { label: "Session", value: sessionId },
                  { label: "Runtime", value: "localhost:4010" },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="flex items-center justify-between px-3 py-2 rounded-lg bg-muted/30 border border-border/40"
                  >
                    <span className="text-[11px] text-muted-foreground/60">{label}</span>
                    <span className="text-[11px] font-mono text-foreground/70 bg-background/60 px-1.5 py-0.5 rounded border border-border/30">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Example prompts */}
            <div className="space-y-2">
              <label className="text-[11px] font-semibold uppercase tracking-[0.07em] text-muted-foreground/60">
                Examples
              </label>
              <div className="space-y-1.5">
                {EXAMPLE_PROMPTS.map((p) => (
                  <button
                    key={p}
                    disabled={isStreaming}
                    onClick={() => setPrompt(p)}
                    className={cn(
                      "w-full text-left text-[11.5px] text-muted-foreground/70 px-3 py-2 rounded-lg",
                      "border border-border/30 bg-background/30 hover:bg-accent/60 hover:text-foreground",
                      "transition-all duration-150 leading-snug",
                      isStreaming && "opacity-40 cursor-not-allowed",
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="shrink-0 px-4 py-4 border-t border-border/60 space-y-2">
            {isStreaming ? (
              <Button
                variant="destructive"
                className="w-full gap-2 text-[13px] h-9"
                onClick={stopStream}
              >
                <Square size={12} />
                Stop Execution
              </Button>
            ) : (
              <Button
                className="w-full gap-2 text-[13px] h-9 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 border-0 shadow-lg shadow-violet-500/20"
                onClick={runAgent}
                disabled={!prompt.trim()}
              >
                <Play size={12} />
                Run Agent
              </Button>
            )}
          </div>
        </div>

        {/* Right: Execution log */}
        <div className="flex-1 min-w-0 flex flex-col bg-[#0d0f14]">
          {/* Log header bar */}
          <div className="shrink-0 flex items-center gap-2 px-4 py-2.5 border-b border-white/5 bg-black/20">
            <Terminal size={12} className="text-slate-500" />
            <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">
              Execution Log
            </span>
            {logs.length > 0 && (
              <span className="ml-auto text-[10px] font-mono text-slate-600">
                {logs.length} events
              </span>
            )}
          </div>

          {/* Logs */}
          <div
            ref={scrollRef}
            className="flex-1 min-h-0 overflow-y-auto py-2 px-1 space-y-0.5"
          >
            {!hasLogs && !isStreaming && (
              <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-8 py-16">
                <div className="relative">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-blue-600/10 border border-violet-500/20 flex items-center justify-center">
                    <Zap size={28} className="text-violet-400/60" />
                  </div>
                  <div className="absolute inset-0 rounded-2xl bg-violet-400/5 blur-xl" />
                </div>
                <div className="space-y-1.5">
                  <p className="text-[13px] font-medium text-slate-400">
                    Ready to execute
                  </p>
                  <p className="text-[11.5px] text-slate-600 leading-relaxed max-w-[280px]">
                    Enter a prompt and run the agent to see real-time execution logs appear here.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2 text-left w-full max-w-[320px]">
                  {[
                    { icon: <Brain size={11} />, label: "Multi-agent orchestration" },
                    { icon: <Zap size={11} />, label: "Real-time SSE streaming" },
                    { icon: <Shield size={11} />, label: "AI moderation built-in" },
                    { icon: <Cpu size={11} />, label: "LangGraph-powered runtime" },
                  ].map(({ icon, label }) => (
                    <div
                      key={label}
                      className="flex items-center gap-2 px-2.5 py-2 rounded-lg bg-white/[0.03] border border-white/5"
                    >
                      <span className="text-slate-500">{icon}</span>
                      <span className="text-[10.5px] text-slate-500">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {logs.map((log, idx) => (
              <LogEntry
                key={log.id}
                log={log}
                isLatest={idx === logs.length - 1}
              />
            ))}

            {isStreaming && logs.length > 0 && <TypingIndicator />}
          </div>
        </div>
      </div>
    </div>
  );
}
