"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  MessageSquare,
  Plus,
  Search,
  Trash2,
  RotateCcw,
  PanelLeftClose,
  PanelLeft,
  Loader2,
  Copy,
  Check,
  MoreHorizontal,
  X,
  Sparkles,
  Calendar,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  useListAiSessions,
  useClearAiSession,
  AiSessionSummary,
} from "@/graphql/actions/ai";
import { cn } from "@/lib/utils";

function formatRelativeTime(dateStr?: string) {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    if (isNaN(diffMs)) return "";

    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHours = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSec < 60) return "Just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString([], { month: "short", day: "numeric" });
  } catch {
    return "";
  }
}

interface GroupedSessions {
  label: string;
  items: AiSessionSummary[];
}

function groupSessionsByDate(sessions: AiSessionSummary[]): GroupedSessions[] {
  const now = new Date();
  const todayStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  ).getTime();
  const yesterdayStart = todayStart - 24 * 60 * 60 * 1000;
  const last7DaysStart = todayStart - 7 * 24 * 60 * 60 * 1000;
  const last30DaysStart = todayStart - 30 * 24 * 60 * 60 * 1000;

  const groups: Record<string, AiSessionSummary[]> = {
    Today: [],
    Yesterday: [],
    "Previous 7 Days": [],
    "Previous 30 Days": [],
    Earlier: [],
  };

  sessions.forEach((s) => {
    const timeStr = s.updatedAt || s.createdAt;
    const time = timeStr ? new Date(timeStr).getTime() : 0;
    if (isNaN(time) || time === 0) {
      groups["Earlier"].push(s);
    } else if (time >= todayStart) {
      groups["Today"].push(s);
    } else if (time >= yesterdayStart) {
      groups["Yesterday"].push(s);
    } else if (time >= last7DaysStart) {
      groups["Previous 7 Days"].push(s);
    } else if (time >= last30DaysStart) {
      groups["Previous 30 Days"].push(s);
    } else {
      groups["Earlier"].push(s);
    }
  });

  return [
    { label: "Today", items: groups["Today"] },
    { label: "Yesterday", items: groups["Yesterday"] },
    { label: "Previous 7 Days", items: groups["Previous 7 Days"] },
    { label: "Previous 30 Days", items: groups["Previous 30 Days"] },
    { label: "Earlier", items: groups["Earlier"] },
  ].filter((g) => g.items.length > 0);
}

export function ChatSessionsSidebar({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deleteSessionId, setDeleteSessionId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    data: sessionsData,
    loading: sessionsLoading,
    refetch: refetchSessions,
  } = useListAiSessions();

  const [clearAiSessionMutation] = useClearAiSession();

  const sessions: AiSessionSummary[] = sessionsData?.listAiSessions || [];

  // Filter sessions by search query
  const filteredSessions = useMemo(() => {
    if (!searchQuery.trim()) return sessions;
    const query = searchQuery.toLowerCase();
    return sessions.filter(
      (s) =>
        s.title?.toLowerCase().includes(query) ||
        s.lastMessage?.toLowerCase().includes(query) ||
        s.sessionId.toLowerCase().includes(query)
    );
  }, [sessions, searchQuery]);

  // Group filtered sessions chronologically
  const groupedSessions = useMemo(() => {
    return groupSessionsByDate(filteredSessions);
  }, [filteredSessions]);

  // Keyboard shortcut ⌘N / Ctrl+N to trigger new chat
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "n") {
        e.preventDefault();
        router.push("/ai/chat/new");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  const handleSelectSession = (sessionId: string) => {
    router.push(`/ai/chat/${sessionId}`);
  };

  const handleNewChat = () => {
    router.push("/ai/chat/new");
  };

  const handleCopyId = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(sessionId);
    setCopiedId(sessionId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const confirmDeleteSession = async () => {
    if (!deleteSessionId) return;
    setIsDeleting(true);
    try {
      await clearAiSessionMutation({ variables: { sessionId: deleteSessionId } });
      if (pathname.includes(deleteSessionId)) {
        router.replace("/ai/chat/new");
      }
      refetchSessions();
    } catch (err) {
      console.error("Failed to delete session:", err);
    } finally {
      setIsDeleting(false);
      setDeleteSessionId(null);
    }
  };

  if (!open) {
    return null;
  }

  return (
    <>
      <aside className="w-72 sm:w-80 h-full border-r border-border/70 bg-card/60 backdrop-blur-md flex flex-col min-h-0 shrink-0 transition-all select-none z-20">
        {/* Sessions Header */}
        <div className="p-3.5 border-b border-border/70 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-lg overflow-hidden shrink-0 border border-border/60 bg-background flex items-center justify-center shadow-2xs">
              <Image
                src="/thrico_ai.png"
                alt="Thrico AI"
                width={20}
                height={20}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-foreground tracking-tight">
                Conversations
              </span>
              <Badge
                variant="secondary"
                className="text-[10px] px-1.5 py-0 h-4 font-mono font-medium rounded-full"
              >
                {sessions.length}
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-7 w-7 text-muted-foreground hover:text-foreground rounded-lg cursor-pointer"
              title="Collapse sidebar"
            >
              <PanelLeftClose className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Action: New Chat Button */}
        <div className="p-3 pb-2 shrink-0">
          <Button
            onClick={handleNewChat}
            className="w-full h-9 rounded-xl bg-foreground text-background hover:bg-foreground/90 font-medium text-xs flex items-center justify-between px-3 shadow-xs cursor-pointer transition-all active:scale-[0.99]"
          >
            <span className="flex items-center gap-2 font-semibold">
              <Plus className="h-4 w-4 stroke-[2.5]" />
              <span>New Conversation</span>
            </span>
            <kbd className="text-[10px] bg-background/20 text-background px-1.5 py-0.5 rounded font-mono font-normal">
              ⌘N
            </kbd>
          </Button>
        </div>

        {/* Search Filter */}
        <div className="px-3 pb-2 shrink-0">
          <div className="relative flex items-center">
            <Search className="absolute left-2.5 h-3.5 w-3.5 text-muted-foreground/70 pointer-events-none" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations…"
              className="h-8 pl-8 pr-7 text-xs rounded-xl bg-muted/40 border-border/60 placeholder:text-muted-foreground/60 focus-visible:ring-1 focus-visible:ring-primary/40 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2 p-0.5 text-muted-foreground hover:text-foreground rounded cursor-pointer"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Sessions List */}
        <div className="flex-1 min-h-0 overflow-y-auto px-2.5 py-1 space-y-4 scrollbar-thin">
          {sessionsLoading && sessions.length === 0 ? (
            <div className="p-3 space-y-2.5">
              {Array.from({ length: 5 }).map((_, idx) => (
                <div key={idx} className="p-2.5 rounded-xl border border-border/40 space-y-2">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-3 w-28 rounded" />
                    <Skeleton className="h-3 w-8 ml-auto rounded" />
                  </div>
                  <Skeleton className="h-2.5 w-44 rounded opacity-70" />
                </div>
              ))}
            </div>
          ) : filteredSessions.length === 0 ? (
            <div className="p-6 text-center text-xs text-muted-foreground space-y-3 my-auto flex flex-col items-center justify-center h-48">
              <div className="h-10 w-10 rounded-2xl bg-muted/60 flex items-center justify-center text-muted-foreground">
                <MessageSquare className="h-5 w-5 stroke-[1.5]" />
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-foreground text-xs">
                  {searchQuery ? "No matching conversations" : "No conversation history"}
                </p>
                <p className="text-[11px] text-muted-foreground/80 max-w-[200px]">
                  {searchQuery
                    ? "Try searching with a different prompt or keyword"
                    : "Ask questions or execute workflows to start a new thread."}
                </p>
              </div>
              {!searchQuery && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleNewChat}
                  className="h-7 text-xs rounded-lg gap-1.5 font-medium border-border/80"
                >
                  <Plus className="h-3 w-3" />
                  Start Chat
                </Button>
              )}
            </div>
          ) : (
            groupedSessions.map((group) => (
              <div key={group.label} className="space-y-1">
                {/* Group Date Header */}
                <div className="px-2 py-1 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-muted-foreground/70 uppercase tracking-wider">
                    {group.label}
                  </span>
                  <span className="text-[9px] text-muted-foreground/50 font-mono">
                    {group.items.length}
                  </span>
                </div>

                {/* Group Items */}
                <div className="space-y-1">
                  {group.items.map((s) => {
                    const isActive = pathname === `/ai/chat/${s.sessionId}`;
                    const displayTitle = s.title || "AI Conversation";
                    const relativeTime = formatRelativeTime(s.updatedAt || s.createdAt);

                    return (
                      <div
                        key={s.sessionId}
                        onClick={() => handleSelectSession(s.sessionId)}
                        className={cn(
                          "group relative flex flex-col p-2.5 rounded-xl border transition-all cursor-pointer text-left space-y-1",
                          isActive
                            ? "bg-accent/80 dark:bg-zinc-800/80 border-border text-foreground shadow-2xs"
                            : "border-transparent text-foreground/80 hover:bg-muted/50 hover:border-border/50 hover:text-foreground"
                        )}
                      >
                        {/* Active Accent Indicator */}
                        {isActive && (
                          <div className="absolute left-0 top-2 bottom-2 w-1 bg-primary rounded-r-full" />
                        )}

                        <div className="flex items-start justify-between gap-1.5 pl-0.5">
                          <span
                            className={cn(
                              "text-xs leading-snug line-clamp-1 flex-1 pr-1",
                              isActive
                                ? "font-bold text-foreground"
                                : "font-medium text-foreground/90 group-hover:text-foreground"
                            )}
                            title={displayTitle}
                          >
                            {displayTitle}
                          </span>

                          {/* Hover Action Menu */}
                          <div className="shrink-0 flex items-center">
                            <DropdownMenu>
                              <DropdownMenuTrigger
                                asChild
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 opacity-0 group-hover:opacity-100 data-[state=open]:opacity-100 p-0 text-muted-foreground hover:text-foreground rounded-md cursor-pointer transition-opacity"
                                >
                                  <MoreHorizontal className="h-3.5 w-3.5" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="end"
                                className="w-44 text-xs rounded-xl shadow-lg border-border/70"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <DropdownMenuItem
                                  onClick={(e) => handleCopyId(e, s.sessionId)}
                                  className="gap-2 cursor-pointer"
                                >
                                  {copiedId === s.sessionId ? (
                                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                                  ) : (
                                    <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                                  )}
                                  <span>Copy Session ID</span>
                                </DropdownMenuItem>

                                <DropdownMenuSeparator />

                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setDeleteSessionId(s.sessionId);
                                  }}
                                  className="gap-2 text-rose-600 dark:text-rose-400 focus:text-rose-600 focus:bg-rose-50 dark:focus:bg-rose-950/40 cursor-pointer"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                  <span>Delete Session</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>

                        {/* Last Message Snippet */}
                        <div className="pl-0.5">
                          {s.lastMessage ? (
                            <p className="text-[11px] text-muted-foreground line-clamp-1 leading-snug">
                              {s.lastMessage}
                            </p>
                          ) : (
                            <p className="text-[10px] text-muted-foreground/60 italic">
                              New conversation started
                            </p>
                          )}
                        </div>

                        {/* Footer: relative time & msg count */}
                        <div className="flex items-center justify-between text-[10px] text-muted-foreground/60 pt-0.5 pl-0.5 font-mono">
                          <span>{relativeTime}</span>
                          {s.messageCount !== undefined && s.messageCount > 0 && (
                            <span className="bg-muted/60 px-1.5 py-0.2 rounded text-[9px] font-sans text-muted-foreground">
                              {s.messageCount} msg{s.messageCount !== 1 ? "s" : ""}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bottom Status Bar */}
        <div className="p-3 border-t border-border/70 bg-muted/20 text-[11px] text-muted-foreground flex items-center justify-between shrink-0">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-medium">Memory Synced</span>
          </span>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => refetchSessions()}
            className="h-6 px-2 text-[10px] gap-1 hover:text-foreground cursor-pointer rounded-md"
            title="Refresh session history"
          >
            <RotateCcw className="h-2.5 w-2.5" />
            <span>Sync</span>
          </Button>
        </div>
      </aside>

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog
        open={!!deleteSessionId}
        onOpenChange={(open) => !open && setDeleteSessionId(null)}
      >
        <AlertDialogContent className="rounded-2xl max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base font-bold">
              Delete Conversation?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-muted-foreground">
              This will permanently delete this conversation and its memory context. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-0">
            <AlertDialogCancel
              disabled={isDeleting}
              className="rounded-xl text-xs h-8"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={isDeleting}
              onClick={confirmDeleteSession}
              className="rounded-xl text-xs h-8 bg-rose-600 hover:bg-rose-700 text-white font-semibold gap-1.5"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Deleting…</span>
                </>
              ) : (
                <>
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Delete</span>
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
