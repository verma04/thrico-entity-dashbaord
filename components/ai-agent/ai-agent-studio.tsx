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
  Mic,
  ChevronDown,
  Plus,
  HardDrive,
  Bot,
  MessageSquare,
  ArrowUp,
  Globe,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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

// ─── Survey types & helpers (preserved) ──────────────────────────────────────

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

const qTypeIcon: Record<string, React.ReactNode> = {
  RATING: <Star size={10} />,
  YES_NO: <ToggleLeft size={10} />,
  LONG_TEXT: <AlignLeft size={10} />,
  SHORT_TEXT: <AlignLeft size={10} />,
  OPINION_SCALE: <SlidersHorizontal size={10} />,
  MULTIPLE: <Hash size={10} />,
};
const qTypeLabel: Record<string, string> = {
  RATING: "Rating",
  YES_NO: "Yes / No",
  LONG_TEXT: "Long text",
  SHORT_TEXT: "Short text",
  OPINION_SCALE: "Opinion scale",
  MULTIPLE: "Multiple choice",
};

const agentIconMap: Record<string, React.ReactNode> = {
  orchestrator: <Network size={12} />,
  "survey-agent": <FileText size={12} />,
  "research-agent": <Search size={12} />,
  "moderation-agent": <Shield size={12} />,
  "task-coordinator": <Cpu size={12} />,
  "insights-agent": <Lightbulb size={12} />,
  default: <Brain size={12} />,
};

const statusConfig: Record<
  LogStatus,
  { color: string; bg: string; icon: React.ReactNode; label: string }
> = {
  RUNNING: {
    color: "text-blue-500",
    bg: "bg-blue-50 border-blue-200",
    icon: <Loader2 size={11} className="animate-spin" />,
    label: "Running",
  },
  THINKING: {
    color: "text-amber-500",
    bg: "bg-amber-50 border-amber-200",
    icon: <Brain size={11} className="animate-pulse" />,
    label: "Thinking",
  },
  SUCCESS: {
    color: "text-emerald-500",
    bg: "bg-emerald-50 border-emerald-200",
    icon: <CheckCircle2 size={11} />,
    label: "Done",
  },
  ERROR: {
    color: "text-red-500",
    bg: "bg-red-50 border-red-200",
    icon: <XCircle size={11} />,
    label: "Error",
  },
  INFO: {
    color: "text-slate-400",
    bg: "bg-slate-50 border-slate-200",
    icon: <ChevronRight size={11} />,
    label: "Info",
  },
  DONE: {
    color: "text-emerald-500",
    bg: "bg-emerald-50 border-emerald-200",
    icon: <CheckCircle2 size={11} />,
    label: "Complete",
  },
};

// ─── Survey Artifact Card ────────────────────────────────────────────────────

function SurveyArtifactCard({ survey }: { survey: SurveyOutput }) {
  return (
    <div className="mt-3 rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50 to-blue-50 overflow-hidden shadow-sm">
      <div className="flex items-start justify-between gap-3 px-4 py-3 border-b border-violet-100 bg-violet-50/60">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="shrink-0 flex h-7 w-7 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
            <FileText size={13} />
          </div>
          <div className="min-w-0">
            <p className="text-[12px] font-semibold text-slate-800 leading-tight truncate">
              {survey.title}
            </p>
            {survey.description && (
              <p className="text-[10.5px] text-slate-500 leading-snug mt-0.5 line-clamp-1">
                {survey.description}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] font-mono text-violet-600 bg-violet-100 border border-violet-200 px-1.5 py-0.5 rounded">
            {survey.questions.length} questions
          </span>
          <Link
            href="/surveys/templates"
            className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-blue-500 hover:text-blue-600 transition-colors"
          >
            View Templates
            <ExternalLink size={9} />
          </Link>
        </div>
      </div>

      <div className="px-4 py-3 space-y-2 max-h-[280px] overflow-y-auto">
        {survey.questions.map((q, i) => (
          <div key={i} className="flex items-start gap-2.5 group">
            <span className="shrink-0 mt-0.5 text-[10px] font-mono text-slate-400 w-4 text-right">
              {i + 1}.
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-[11.5px] text-slate-700 leading-snug">
                {q.question}
              </p>
              <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                <span className="inline-flex items-center gap-1 text-[9.5px] font-mono text-violet-600 bg-violet-50 border border-violet-200 px-1.5 py-0.5 rounded">
                  {qTypeIcon[q.type] ?? <Hash size={10} />}
                  {qTypeLabel[q.type] ?? q.type}
                </span>
                {q.required && (
                  <span className="text-[9px] text-red-400 font-mono">
                    required
                  </span>
                )}
                {q.scale && (
                  <span className="text-[9px] text-slate-500 font-mono">
                    1–{q.scale}
                  </span>
                )}
                {q.labels?.start && (
                  <span className="text-[9px] text-slate-500 font-mono italic">
                    {q.labels.start} → {q.labels.end}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="px-4 py-2.5 border-t border-violet-100 flex items-center justify-between bg-violet-50/40">
        <span className="text-[10px] text-slate-500 font-mono">
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

// ─── Log Entry ───────────────────────────────────────────────────────────────

function LogEntry({ log, isLatest }: { log: AgentLog; isLatest: boolean }) {
  const cfg = statusConfig[log.status] ?? statusConfig.INFO;
  const agentIcon = log.agent
    ? (agentIconMap[log.agent.toLowerCase()] ?? agentIconMap["default"])
    : agentIconMap["default"];

  return (
    <div
      className={cn(
        "group flex gap-3 py-2.5 px-3 rounded-xl transition-all duration-200",
        isLatest && log.status === "RUNNING"
          ? "bg-blue-50/80 border border-blue-100"
          : "hover:bg-slate-50/60"
      )}
    >
      <div className="flex flex-col items-center gap-1 pt-0.5 shrink-0">
        <div
          className={cn(
            "flex items-center justify-center w-5 h-5 rounded-full border",
            cfg.bg,
            cfg.color
          )}
        >
          {cfg.icon}
        </div>
        {isLatest && log.status === "RUNNING" && (
          <div className="w-px flex-1 bg-gradient-to-b from-blue-300 to-transparent min-h-[8px]" />
        )}
      </div>

      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center gap-2 flex-wrap">
          {log.agent && (
            <span
              className={cn(
                "inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold border",
                cfg.bg,
                cfg.color
              )}
            >
              {agentIcon}
              {log.agent}
            </span>
          )}
          {log.step && (
            <span className="text-[10px] text-slate-400 font-mono">
              {log.step}
            </span>
          )}
          <span className="text-[10px] text-slate-400 ml-auto font-mono">
            {new Date(log.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </span>
        </div>
        <p className="text-[12.5px] text-slate-700 leading-relaxed font-mono break-words">
          {log.message}
        </p>
        {log.data && Object.keys(log.data).length > 0 && (
          <>
            {(log.data.selectedAgent === "survey_agent" ||
              log.data.agentOutput?.type === "survey") &&
            log.data.agentOutput?.survey ? (
              <SurveyArtifactCard survey={log.data.agentOutput.survey} />
            ) : (
              <div className="mt-1.5 p-2 rounded-lg bg-slate-50 border border-slate-100 overflow-x-auto">
                <pre className="text-[10.5px] text-slate-500 font-mono whitespace-pre-wrap break-all">
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
        <div className="flex items-center justify-center w-5 h-5 rounded-full border bg-blue-50 border-blue-200 text-blue-500">
          <Loader2 size={11} className="animate-spin" />
        </div>
      </div>
      <div className="flex items-center gap-1.5 mt-1">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce [animation-delay:0ms]" />
        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce [animation-delay:150ms]" />
        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce [animation-delay:300ms]" />
        <span className="text-[11px] text-slate-400 font-mono ml-1">
          Agent is processing…
        </span>
      </div>
    </div>
  );
}

// ─── Thrico AI Logo ─────────────────────────────────────────────────────────

function ThricoAILogo({ className }: { className?: string }) {
  return (
    <img 
      src="/thrico_ai.svg" 
      alt="Thrico AI" 
      className={cn("w-10 h-10 object-contain", className)} 
    />
  );
}

// ─── Skill Chip ──────────────────────────────────────────────────────────────

const SKILL_SUGGESTIONS = [
  { icon: <FileText size={13} />, label: "Survey Builder", color: "text-violet-500" },
  { icon: <Search size={13} />, label: "Research", color: "text-blue-500" },
  { icon: <Shield size={13} />, label: "Moderation", color: "text-emerald-500" },
  { icon: <Lightbulb size={13} />, label: "Insights", color: "text-amber-500" },
];

// ─── Main Component ──────────────────────────────────────────────────────────

export default function AIAgentStudio() {
  const [prompt, setPrompt] = useState("");
  const [logs, setLogs] = useState<AgentLog[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [elapsedMs, setElapsedMs] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"ask" | "agents">("ask");
  const [showSkills, setShowSkills] = useState(false);

  const readerRef = useRef<ReadableStreamDefaultReader<Uint8Array> | null>(
    null
  );
  const abortRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const logIdCounter = useRef(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [logs, scrollToBottom]);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = Math.min(el.scrollHeight, 160) + "px";
    }
  }, [prompt]);

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

    setLogs([]);
    setIsComplete(false);
    setHasError(false);
    setElapsedMs(null);
    setIsStreaming(true);
    startTimeRef.current = Date.now();

    timerRef.current = setInterval(() => {
      setElapsedMs(Date.now() - startTimeRef.current);
    }, 100);

    abortRef.current = new AbortController();

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
        message:
          err?.message ??
          "Unknown error occurred while connecting to agent runtime.",
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
    if (e.key === "Enter" && !e.shiftKey) {
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
    <div className="flex flex-col h-full min-h-0 bg-background relative overflow-hidden">
      {/* ─── Aurora gradient banner ─── */}
      <div className="absolute top-0 left-0 right-0 h-[6px] z-10">
        <div
          className="w-full h-full"
          style={{
            background:
              "linear-gradient(90deg, #f87171 0%, #fb923c 12%, #fbbf24 24%, #a3e635 36%, #34d399 48%, #22d3ee 60%, #818cf8 72%, #c084fc 84%, #f472b6 100%)",
          }}
        />
      </div>

      {/* ─── Soft background gradient wash ─── */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 left-0 w-[600px] h-[300px] opacity-[0.15]"
          style={{
            background:
              "radial-gradient(ellipse at 20% 0%, #c084fc 0%, transparent 60%)",
          }}
        />
        <div
          className="absolute top-0 right-0 w-[500px] h-[250px] opacity-[0.12]"
          style={{
            background:
              "radial-gradient(ellipse at 80% 0%, #fda4af 0%, transparent 60%)",
          }}
        />
        <div
          className="absolute top-[80px] left-[30%] w-[400px] h-[200px] opacity-[0.08]"
          style={{
            background:
              "radial-gradient(ellipse at 50% 30%, #93c5fd 0%, transparent 60%)",
          }}
        />
      </div>

      {/* ─── Memory button (top-right) ─── */}
      <div className="absolute top-4 right-6 z-20">
        <button className="flex items-center gap-1.5 text-[13px] text-slate-500 hover:text-slate-700 transition-colors font-medium">
          <HardDrive size={14} />
          Memory
        </button>
      </div>

      {/* ─── Main content ─── */}
      <div className="flex-1 flex flex-col items-center relative z-10 overflow-y-auto">
        {!hasLogs ? (
          /* ─── Landing / Empty state ─── */
          <div className="flex-1 flex flex-col items-center justify-center w-full max-w-[720px] mx-auto px-6">
            {/* Logo */}
            <div className="flex items-center gap-2 mb-10">
              <ThricoAILogo className="w-11 h-11" />
              <h1 className="text-[28px] font-semibold tracking-tight text-slate-800">
                Thrico
                <sup className="text-[14px] font-semibold text-slate-500 ml-[1px] -top-[10px] relative">
                  2
                </sup>
              </h1>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 mb-5">
              <button
                onClick={() => setActiveTab("ask")}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[13px] font-medium transition-all duration-200",
                  activeTab === "ask"
                    ? "bg-white text-slate-800 shadow-sm border border-slate-200/80"
                    : "text-slate-400 hover:text-slate-600"
                )}
              >
                <Sparkles
                  size={13}
                  className={
                    activeTab === "ask" ? "text-violet-500" : "text-slate-400"
                  }
                />
                Ask
              </button>
              <button
                onClick={() => setActiveTab("agents")}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[13px] font-medium transition-all duration-200",
                  activeTab === "agents"
                    ? "bg-white text-slate-800 shadow-sm border border-slate-200/80"
                    : "text-slate-400 hover:text-slate-600"
                )}
              >
                <Bot
                  size={13}
                  className={
                    activeTab === "agents"
                      ? "text-violet-500"
                      : "text-slate-400"
                  }
                />
                Agents
              </button>
            </div>

            {activeTab === "ask" ? (
              /* ─── Ask Tab: Input box ─── */
              <div className="w-full">
                <div className="relative rounded-2xl border border-slate-200/80 bg-white/80 backdrop-blur-sm shadow-[0_2px_20px_rgba(0,0,0,0.04)] transition-all duration-200 focus-within:shadow-[0_2px_30px_rgba(139,92,246,0.08)] focus-within:border-violet-200/60">
                  {/* Text input area */}
                  <div className="px-4 pt-4 pb-2">
                    <textarea
                      ref={textareaRef}
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Curious about something? Ask away."
                      disabled={isStreaming}
                      rows={1}
                      className={cn(
                        "w-full bg-transparent border-0 outline-none resize-none",
                        "text-[14px] text-slate-700 placeholder:text-slate-400",
                        "leading-relaxed min-h-[28px] max-h-[160px]",
                        isStreaming && "opacity-60 cursor-not-allowed"
                      )}
                    />
                  </div>

                  {/* Source icons (right side of textarea) */}
                  <div className="absolute top-4 right-4 flex items-center gap-1">
                    <button className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 hover:bg-emerald-200 transition-colors">
                      <Globe size={12} />
                    </button>
                    <button className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 hover:bg-teal-200 transition-colors">
                      <RefreshCw size={12} />
                    </button>
                  </div>

                  {/* Bottom toolbar */}
                  <div className="flex items-center justify-between px-4 py-2.5 border-t border-slate-100/80">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowSkills(!showSkills)}
                        className="flex items-center gap-1.5 text-[13px] text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        <Plus size={14} className="text-slate-400" />
                      </button>
                      <button
                        onClick={() => setShowSkills(!showSkills)}
                        className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-[13px] text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-all"
                      >
                        <Brain size={14} className="text-slate-400" />
                        Skills
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Model selector */}
                      <button className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[13px] text-slate-500 hover:bg-slate-50 transition-all">
                        <Sparkles size={13} className="text-violet-400" />
                        <span className="font-medium">Max</span>
                        <ChevronDown size={12} className="text-slate-400" />
                      </button>

                      {/* Send / Mic */}
                      {prompt.trim() ? (
                        <button
                          onClick={runAgent}
                          disabled={isStreaming}
                          className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-800 text-white hover:bg-slate-700 transition-colors disabled:opacity-50"
                        >
                          <ArrowUp size={14} />
                        </button>
                      ) : (
                        <button className="flex items-center justify-center w-7 h-7 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all">
                          <Mic size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Skills dropdown */}
                {showSkills && (
                  <div className="mt-3 grid grid-cols-2 gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    {SKILL_SUGGESTIONS.map((skill) => (
                      <button
                        key={skill.label}
                        onClick={() => {
                          setPrompt(
                            `Use ${skill.label.toLowerCase()} skill to `
                          );
                          setShowSkills(false);
                          textareaRef.current?.focus();
                        }}
                        className="flex items-center gap-2.5 px-4 py-3 rounded-xl border border-slate-100 bg-white/60 hover:bg-white hover:shadow-sm hover:border-slate-200 transition-all text-left"
                      >
                        <span className={cn("shrink-0", skill.color)}>
                          {skill.icon}
                        </span>
                        <span className="text-[13px] text-slate-600 font-medium">
                          {skill.label}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* ─── Agents Tab ─── */
              <div className="w-full grid grid-cols-2 gap-3 mt-2">
                {[
                  {
                    name: "Survey Agent",
                    desc: "Create & manage surveys with AI",
                    icon: <FileText size={18} />,
                    color: "text-violet-500",
                    bg: "bg-violet-50",
                    border: "border-violet-100",
                  },
                  {
                    name: "Research Agent",
                    desc: "Deep research & analysis",
                    icon: <Search size={18} />,
                    color: "text-blue-500",
                    bg: "bg-blue-50",
                    border: "border-blue-100",
                  },
                  {
                    name: "Moderation Agent",
                    desc: "Content moderation & safety",
                    icon: <Shield size={18} />,
                    color: "text-emerald-500",
                    bg: "bg-emerald-50",
                    border: "border-emerald-100",
                  },
                  {
                    name: "Insights Agent",
                    desc: "Generate data-driven insights",
                    icon: <Lightbulb size={18} />,
                    color: "text-amber-500",
                    bg: "bg-amber-50",
                    border: "border-amber-100",
                  },
                ].map((agent) => (
                  <button
                    key={agent.name}
                    onClick={() => {
                      setActiveTab("ask");
                      setPrompt(`@${agent.name.replace(" ", "")} `);
                      textareaRef.current?.focus();
                    }}
                    className={cn(
                      "flex items-start gap-3 p-4 rounded-2xl border bg-white/60 hover:bg-white hover:shadow-md transition-all text-left group",
                      agent.border
                    )}
                  >
                    <div
                      className={cn(
                        "shrink-0 flex h-10 w-10 items-center justify-center rounded-xl",
                        agent.bg,
                        agent.color
                      )}
                    >
                      {agent.icon}
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">
                        {agent.name}
                      </p>
                      <p className="text-[11.5px] text-slate-400 mt-0.5 leading-snug">
                        {agent.desc}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* ─── Active session / Log view ─── */
          <div className="flex-1 w-full flex flex-col min-h-0">
            {/* Session header */}
            <div className="shrink-0 flex items-center justify-between px-6 py-3 border-b border-slate-100 bg-white/60 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <ThricoAILogo className="w-6 h-6" />
                  <span className="text-[14px] font-semibold text-slate-700">
                    Thrico
                    <sup className="text-[8px] text-slate-400 ml-[1px]">2</sup>
                  </span>
                </div>
                <div className="h-4 w-px bg-slate-200" />
                <div className="flex items-center gap-1.5">
                  <Terminal size={12} className="text-slate-400" />
                  <span className="text-[12px] font-mono text-slate-400 uppercase tracking-wider">
                    Execution Log
                  </span>
                </div>
                {logs.length > 0 && (
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                    {logs.length} events
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {elapsedMs !== null && (
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-50 border border-slate-100">
                    <Clock size={11} className="text-slate-400" />
                    <span className="text-[11px] font-mono text-slate-500">
                      {formatElapsed(elapsedMs)}
                    </span>
                  </div>
                )}
                {isStreaming && (
                  <Badge
                    variant="outline"
                    className="gap-1.5 text-blue-500 border-blue-200 bg-blue-50 text-[10.5px] px-2"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
                    Streaming
                  </Badge>
                )}
                {isComplete && !hasError && (
                  <Badge
                    variant="outline"
                    className="gap-1.5 text-emerald-500 border-emerald-200 bg-emerald-50 text-[10.5px] px-2"
                  >
                    <CheckCircle2 size={10} />
                    Complete
                  </Badge>
                )}
                {hasError && (
                  <Badge
                    variant="outline"
                    className="gap-1.5 text-red-500 border-red-200 bg-red-50 text-[10.5px] px-2"
                  >
                    <AlertCircle size={10} />
                    Error
                  </Badge>
                )}
                {isStreaming && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={stopStream}
                    className="h-7 gap-1.5 text-red-500 border-red-200 hover:bg-red-50 text-[12px]"
                  >
                    <Square size={10} />
                    Stop
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                  className="h-7 gap-1.5 text-slate-400 hover:text-slate-600 text-[12px]"
                >
                  <RotateCcw size={12} />
                  New Chat
                </Button>
              </div>
            </div>

            {/* Log entries */}
            <div
              ref={scrollRef}
              className="flex-1 min-h-0 overflow-y-auto py-3 px-4 space-y-0.5 max-w-[800px] mx-auto w-full"
            >
              {logs.map((log, idx) => (
                <LogEntry
                  key={log.id}
                  log={log}
                  isLatest={idx === logs.length - 1}
                />
              ))}
              {isStreaming && logs.length > 0 && <TypingIndicator />}
            </div>

            {/* Bottom input (during active session) */}
            <div className="shrink-0 border-t border-slate-100 bg-white/80 backdrop-blur-sm px-6 py-3">
              <div className="max-w-[800px] mx-auto flex items-center gap-3">
                <div className="flex-1 relative rounded-xl border border-slate-200 bg-white shadow-sm focus-within:border-violet-200 focus-within:shadow-[0_0_0_2px_rgba(139,92,246,0.06)] transition-all">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask a follow-up…"
                    disabled={isStreaming}
                    rows={1}
                    className={cn(
                      "w-full bg-transparent border-0 outline-none resize-none px-4 py-2.5",
                      "text-[13px] text-slate-700 placeholder:text-slate-400",
                      "leading-relaxed min-h-[20px] max-h-[80px]",
                      isStreaming && "opacity-60 cursor-not-allowed"
                    )}
                  />
                </div>
                <button
                  onClick={runAgent}
                  disabled={!prompt.trim() || isStreaming}
                  className={cn(
                    "flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-200",
                    prompt.trim() && !isStreaming
                      ? "bg-slate-800 text-white hover:bg-slate-700 shadow-sm"
                      : "bg-slate-100 text-slate-300 cursor-not-allowed"
                  )}
                >
                  <ArrowUp size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
