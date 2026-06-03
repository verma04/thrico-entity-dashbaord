"use client";

import React, { useState, useEffect } from "react";
import {
  Loader2,
  Headset,
  MessageSquare,
  ChevronRight,
  Send,
  Plus,
  PenTool,
  Lock,
  ArrowRight,
  UserCheck,
  ShieldAlert,
  X,
  MoreVertical,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { UserProfileHoverCard } from "@/components/shared/user-profile-hover-card";
import { useQuery } from "@apollo/client";
import { CreateTicketModal } from "./create-ticket-modal";
import {
  GET_SUPPORT_TICKETS,
  GET_TICKET_MESSAGES,
} from "@/graphql/quries/trust-center";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { EcosystemCard } from "@/components/layout/ecosystem/ecosystem-analytics";
import { Ticket, Strike } from "./trust-center-dashboard";
import { getMediaUrls } from "@/lib/media-utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MemberInboxPortalProps {
  onSignPolicy: (id: string, signature: string) => void;
  onReply: (id: string, body: string) => void;
  onCreateTicket: (
    subject: string,
    category: any,
    subCategory: string | undefined,
    description: string,
    targetUserId?: string,
    targetUserIds?: string[],
    allowReplies?: boolean,
    recipientType?: "all" | "one" | "multiple",
  ) => void;
  onUpdateTicket?: (
    id: string,
    input: { status?: string; priority?: string; allowReplies?: boolean },
  ) => void;
  onCreateAppeal: (subject: string, description: string) => void;
}

const STATUS_STYLES: Record<string, string> = {
  open: "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
  in_progress:
    "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
  resolved:
    "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
  closed: "bg-muted text-muted-foreground border-border",
};

export default function MemberInboxPortal({
  onSignPolicy,
  onReply,
  onCreateTicket,
  onUpdateTicket,
  onCreateAppeal,
}: MemberInboxPortalProps) {
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [activeStatus, setActiveStatus] = useState<string>("ALL");
  const [activePriority, setActivePriority] = useState<string>("ALL");
  const [pageSize] = useState(10);
  const [afterCursor, setAfterCursor] = useState<string | null>(null);
  const [cursorStack, setCursorStack] = useState<string[]>([]);

  const { data: ticketsData, loading: ticketsLoading } = useQuery(
    GET_SUPPORT_TICKETS,
    {
      variables: {
        category: activeCategory === "ALL" ? null : activeCategory,
        status: activeStatus === "ALL" ? null : activeStatus,
        priority: activePriority === "ALL" ? null : activePriority,
        first: pageSize,
        after: afterCursor,
      },
      fetchPolicy: "cache-and-network",
    },
  );

  const rawTickets = ticketsData?.getSupportTickets?.items || [];
  const totalTickets = ticketsData?.getSupportTickets?.totalCount || 0;
  const pageInfo = ticketsData?.getSupportTickets?.pageInfo;

  const fetchedTickets: Ticket[] = rawTickets.map((t: any) => ({
    id: t.id,
    subject: t.subject,
    category: t.category,
    status: t.status?.toLowerCase() || "open",
    priority: t.priority?.toLowerCase() || "medium",
    lastActivity: new Date(t.updatedAt).toLocaleDateString(),
    creator: t.createdBy
      ? `${t.createdBy.firstName} ${t.createdBy.lastName}`
      : "System",
    creatorAvatar: t.createdBy?.avatar,
    creatorId: t.createdBy?.id,
    creatorData: t.createdBy,
    type: t.category === "ANNOUNCEMENT" ? "announcement" : "conversation",
    replyMode: t.allowReplies ? "interactive" : "read-only",
    allowedReplies: t.allowReplies,

    linkedUser: t.targetUserIds?.length
      ? `${t.targetUserIds.length} Users`
      : t.targetUserId
        ? "Specific User"
        : undefined,
    subCategory: t.subCategory,
    description: t.description,
  }));

  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  useEffect(() => {
    if (fetchedTickets.length > 0 && !selectedTicketId) {
      setSelectedTicketId(fetchedTickets[0].id);
    }
  }, [fetchedTickets, selectedTicketId]);

  const [messagesPageSize] = useState(20);
  const [messagesCursorStack, setMessagesCursorStack] = useState<string[]>([]);
  const [messagesAfterCursor, setMessagesAfterCursor] = useState<string | null>(
    null,
  );

  // Reset message pagination when selected ticket changes
  useEffect(() => {
    setMessagesCursorStack([]);
    setMessagesAfterCursor(null);
  }, [selectedTicketId]);

  const { data: messagesData, loading: messagesLoading } = useQuery(
    GET_TICKET_MESSAGES,
    {
      variables: {
        ticketId: selectedTicketId,
        first: messagesPageSize,
        after: messagesAfterCursor,
      },
      skip: !selectedTicketId,
      fetchPolicy: "cache-and-network",
    },
  );

  const rawMessages = messagesData?.getTicketMessages?.items || [];
  const messagesPageInfo = messagesData?.getTicketMessages?.pageInfo;

  const ticketMessages = rawMessages.map((m: any) => ({
    id: m.id,
    sender:
      m.senderType === "SYSTEM"
        ? "system"
        : m.senderType === "ADMIN"
          ? "staff"
          : "user",
    senderName: m.senderName || "Unknown",
    body: m.body,
    timestamp: new Date(m.createdAt).toLocaleDateString(),
  }));
  const [replyText, setReplyText] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const [signatureName, setSignatureName] = useState("");

  // Modals
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [appealModalOpen, setAppealModalOpen] = useState(false);
  const [appealSubject, setAppealSubject] = useState("");
  const [appealDesc, setAppealDesc] = useState("");

  // Filtering is now handled by the backend
  const filteredTickets = fetchedTickets;

  const selectedTicket =
    fetchedTickets.find((t) => t.id === selectedTicketId) ||
    fetchedTickets[0] ||
    null;

  const handleSendReply = async () => {
    if (!replyText.trim() || !selectedTicket) return;
    setIsReplying(true);
    try {
      await onReply(selectedTicket.id, replyText.trim());
      setReplyText("");
    } finally {
      setIsReplying(false);
    }
  };

  const handleLaunchAppeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appealSubject.trim() || !appealDesc.trim()) return;
    onCreateAppeal(appealSubject.trim(), appealDesc.trim());
    setAppealSubject("");
    setAppealDesc("");
    setAppealModalOpen(false);
  };

  const categories = [
    "ALL",
    "GENERAL_INQUIRY",
    "ENTITY_SUPPORT",
    "MODERATION",
    "APPEALS",
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
      {/* ── Inbox ── */}
      <div className="xl:col-span-12 grid grid-cols-1 md:grid-cols-12 gap-4 min-h-[560px]">
        {/* Ticket list */}
        <div className="md:col-span-5 rounded-xl border border-border bg-card shadow-sm overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-border bg-muted/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Headset className="h-3.5 w-3.5 text-primary" />
              </div>
              <span className="text-sm font-semibold text-foreground">
                Global Support Desk
              </span>
            </div>
            <Button
              size="sm"
              onClick={() => setTicketModalOpen(true)}
              className="h-7 text-xs gap-1 rounded-lg"
            >
              <Plus className="h-3 w-3" /> New Broadcast
            </Button>
          </div>

          {/* Category and extra filters */}
          <div className="px-3 py-2 border-b border-border flex flex-col gap-2">
            <div className="flex gap-1 overflow-x-auto pb-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    setAfterCursor(null);
                    setCursorStack([]);
                    setSelectedTicketId(null);
                  }}
                  className={cn(
                    "px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors whitespace-nowrap cursor-pointer",
                    activeCategory === cat
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted",
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <Select
                value={activeStatus}
                onValueChange={(v) => {
                  setActiveStatus(v);
                  setAfterCursor(null);
                  setCursorStack([]);
                  setSelectedTicketId(null);
                }}
              >
                <SelectTrigger className="h-6 text-[10px] w-[120px] bg-muted/50 border-transparent hover:bg-muted font-medium">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Status</SelectItem>
                  <SelectItem value="OPEN">Open</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="RESOLVED">Resolved</SelectItem>
                  <SelectItem value="CLOSED">Closed</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={activePriority}
                onValueChange={(v) => {
                  setActivePriority(v);
                  setAfterCursor(null);
                  setCursorStack([]);
                  setSelectedTicketId(null);
                }}
              >
                <SelectTrigger className="h-6 text-[10px] w-[120px] bg-muted/50 border-transparent hover:bg-muted font-medium">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Priorities</SelectItem>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="URGENT">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto divide-y divide-border max-h-[440px]">
            {filteredTickets.length === 0 ? (
              <div className="py-12 text-center">
                <Headset className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">
                  No tickets found
                </p>
              </div>
            ) : (
              filteredTickets.map((t) => {
                const isActive = selectedTicket?.id === t.id;
                return (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTicketId(t.id)}
                    className={cn(
                      "px-4 py-3 cursor-pointer transition-all border-b border-border/40 last:border-0",
                      isActive
                        ? "bg-muted/80 shadow-inner"
                        : "hover:bg-muted/40",
                    )}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2 overflow-hidden">
                        {t.creatorData?.id ? (
                          <UserProfileHoverCard user={t.creatorData}>
                            <div className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                              <div className="h-6 w-6 shrink-0 rounded-full bg-muted border border-border overflow-hidden flex items-center justify-center">
                                {t.creatorAvatar ? (
                                  <Image
                                    src={getMediaUrls(t.creatorAvatar)}
                                    alt="Avatar"
                                    width={24}
                                    height={24}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <UserCheck className="h-3 w-3 text-muted-foreground" />
                                )}
                              </div>

                              <div className="min-w-0">
                                <p className="text-[12px] font-semibold text-foreground truncate">
                                  {t.creator}
                                </p>
                                <p className="text-[10px] text-muted-foreground truncate">
                                  {t.subject}
                                </p>
                              </div>
                            </div>
                          </UserProfileHoverCard>
                        ) : (
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 shrink-0 rounded-full bg-muted border border-border overflow-hidden flex items-center justify-center">
                              {t.creatorAvatar ? (
                                <Image
                                  src={`https://cdn.thrico.network/${t.creatorAvatar}`}
                                  alt="Avatar"
                                  width={24}
                                  height={24}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <UserCheck className="h-3 w-3 text-muted-foreground" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="text-[12px] font-semibold text-foreground truncate">
                                {t.creator}
                              </p>
                              <p className="text-[10px] text-muted-foreground truncate">
                                {t.subject}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] text-muted-foreground shrink-0 mt-0.5">
                        {t.lastActivity}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-2 ml-8">
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[9px] h-4 px-1.5 border",
                          STATUS_STYLES[t.status] || STATUS_STYLES.open,
                        )}
                      >
                        {t.status.toUpperCase().replace("_", " ")}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="text-[9px] h-4 px-1.5 border border-border/50 bg-background/50"
                      >
                        {t.category}
                      </Badge>
                      {t.priority === "urgent" && (
                        <span className="flex h-2 w-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]"></span>
                      )}
                      {t.priority === "high" && (
                        <span className="flex h-2 w-2 rounded-full bg-amber-500"></span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Pagination controls */}
          <div className="p-3 border-t border-border flex items-center justify-between">
            <span className="text-[11px] text-muted-foreground font-medium">
              {totalTickets} total tickets
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs px-2"
                disabled={cursorStack.length === 0}
                onClick={() => {
                  const newStack = [...cursorStack];
                  newStack.pop();
                  setCursorStack(newStack);
                  setAfterCursor(
                    newStack.length > 0 ? newStack[newStack.length - 1] : null,
                  );
                }}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs px-2"
                disabled={!pageInfo?.hasNextPage}
                onClick={() => {
                  if (pageInfo?.endCursor) {
                    setCursorStack([
                      ...cursorStack,
                      afterCursor || "__start__",
                    ]);
                    setAfterCursor(pageInfo.endCursor);
                  }
                }}
              >
                Next
              </Button>
            </div>
          </div>
        </div>

        {/* Thread view */}
        <div className="md:col-span-7 rounded-xl border border-border bg-card shadow-sm overflow-hidden flex flex-col">
          {selectedTicket ? (
            <>
              {/* Header */}
              <div className="px-5 py-4 border-b border-border bg-card">
                <div className="flex items-start justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="text-[9px] h-4 px-1.5 border-primary/20 text-primary"
                      >
                        {selectedTicket.id}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="text-[9px] h-4 px-1.5"
                      >
                        {selectedTicket.category}
                      </Badge>
                    </div>
                    <h3 className="text-base font-semibold text-foreground">
                      {selectedTicket.subject}
                    </h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground shrink-0"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
                <div className="mt-4 flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/30">
                  {selectedTicket.creatorData?.id ? (
                    <UserProfileHoverCard user={selectedTicket.creatorData}>
                      <div className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <div className="h-8 w-8 rounded-full bg-muted overflow-hidden flex items-center justify-center">
                          {selectedTicket.creatorAvatar ? (
                            <Image
                              src={`https://cdn.thrico.network/${selectedTicket.creatorAvatar}`}
                              alt="Avatar"
                              width={32}
                              height={32}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <UserCheck className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                        <div className="min-w-0 text-left">
                          <p className="text-xs font-semibold text-foreground truncate">
                            {selectedTicket.creator}
                          </p>
                          <p className="text-[10px] text-muted-foreground truncate">
                            Requester
                          </p>
                        </div>
                      </div>
                    </UserProfileHoverCard>
                  ) : (
                    <>
                      <div className="h-8 w-8 rounded-full bg-muted overflow-hidden flex items-center justify-center">
                        {selectedTicket.creatorAvatar ? (
                          <Image
                            src={`https://cdn.thrico.network/${selectedTicket.creatorAvatar}`}
                            alt="Avatar"
                            width={32}
                            height={32}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <UserCheck className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-foreground truncate">
                          {selectedTicket.creator}
                        </p>
                        <p className="text-[10px] text-muted-foreground truncate">
                          Requester
                        </p>
                      </div>
                    </>
                  )}

                  <div className="shrink-0 flex items-center gap-3 border-l border-border pl-4 ml-auto">
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[9px] text-muted-foreground uppercase font-semibold tracking-wider">
                        Status
                      </span>
                      {onUpdateTicket ? (
                        <Select
                          value={selectedTicket.status.toUpperCase()}
                          onValueChange={(val) =>
                            onUpdateTicket(selectedTicket.id, { status: val })
                          }
                        >
                          <SelectTrigger className="h-6 text-[10px] px-2 py-0 border-transparent bg-muted/50 hover:bg-muted font-medium w-[110px]">
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="OPEN">Open</SelectItem>
                            <SelectItem value="IN_PROGRESS">
                              In Progress
                            </SelectItem>
                            <SelectItem value="RESOLVED">Resolved</SelectItem>
                            <SelectItem value="CLOSED">Closed</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="text-[10px] font-medium text-foreground h-6 flex items-center px-2 bg-muted/50 rounded-md">
                          {selectedTicket.status.toUpperCase()}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[9px] text-muted-foreground uppercase font-semibold tracking-wider">
                        Priority
                      </span>
                      {onUpdateTicket ? (
                        <Select
                          value={selectedTicket.priority.toUpperCase()}
                          onValueChange={(val) =>
                            onUpdateTicket(selectedTicket.id, { priority: val })
                          }
                        >
                          <SelectTrigger
                            className={cn(
                              "h-6 text-[10px] px-2 py-0 border-transparent font-medium w-[90px]",
                              selectedTicket.priority === "urgent"
                                ? "bg-rose-500/10 text-rose-600 hover:bg-rose-500/20"
                                : selectedTicket.priority === "high"
                                  ? "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20"
                                  : "bg-muted/50 hover:bg-muted",
                            )}
                          >
                            <SelectValue placeholder="Priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="LOW">Low</SelectItem>
                            <SelectItem value="MEDIUM">Medium</SelectItem>
                            <SelectItem value="HIGH">High</SelectItem>
                            <SelectItem value="URGENT">Urgent</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <span
                          className={cn(
                            "font-medium text-[10px] h-6 flex items-center px-2 rounded-md",
                            selectedTicket.priority === "urgent"
                              ? "bg-rose-500/10 text-rose-600"
                              : selectedTicket.priority === "high"
                                ? "bg-amber-500/10 text-amber-600"
                                : "bg-muted/50 text-foreground",
                          )}
                        >
                          {selectedTicket.priority.toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 max-h-[360px]">
                {/* Policy acknowledgement */}
                {selectedTicket.type === "policy" && (
                  <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-3">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <PenTool className="h-4 w-4" />
                      <span className="text-xs font-medium">
                        Requires Policy Acknowledgement
                      </span>
                    </div>

                    <div className="border border-border rounded-lg p-3 bg-card max-h-40 overflow-y-auto text-xs text-muted-foreground leading-relaxed space-y-2">
                      <p className="font-semibold text-foreground">
                        SECTION 1: SCOPE OF TRUST PROTOCOLS
                      </p>
                      <p>
                        By signing this document, you certify that all content
                        created within the Thrico ecosystem is subject to
                        automatic safety classifications. You consent to
                        periodic evaluations and administrative enforcement
                        actions.
                      </p>
                      <p className="font-semibold text-foreground">
                        SECTION 2: DATA RETENTION
                      </p>
                      <p>
                        Compliance indices and user databases are saved inside
                        secure structures. We retain verification hashes for up
                        to 30 days post-termination.
                      </p>
                      <p className="font-semibold text-foreground">
                        SECTION 3: APPEALS
                      </p>
                      <p>
                        You have a 7-day active period to launch appeals for
                        strike actions issued by auto-moderation.
                      </p>
                    </div>

                    {selectedTicket.signed ? (
                      <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-lg flex items-center gap-2">
                        <UserCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        <div>
                          <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                            Acknowledged & Signed
                          </p>
                          <p className="text-[10px] text-emerald-600/70 dark:text-emerald-400/60">
                            Signed as: &quot;{selectedTicket.signatureText}
                            &quot; on {selectedTicket.signedAt}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <Input
                          placeholder="Type your full name to sign"
                          value={signatureName}
                          onChange={(e) => setSignatureName(e.target.value)}
                          className="h-9 text-xs"
                        />
                        <Button
                          size="sm"
                          onClick={() => {
                            if (!signatureName.trim()) return;
                            onSignPolicy(
                              selectedTicket.id,
                              signatureName.trim(),
                            );
                            setSignatureName("");
                          }}
                          className="h-9 text-xs shrink-0"
                        >
                          Sign & Accept
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {/* Messages thread */}
                {messagesPageInfo?.hasNextPage && (
                  <div className="flex justify-center mb-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs h-7"
                      onClick={() => {
                        if (messagesPageInfo.endCursor) {
                          setMessagesCursorStack([
                            ...messagesCursorStack,
                            messagesAfterCursor || "__start__",
                          ]);
                          setMessagesAfterCursor(messagesPageInfo.endCursor);
                        }
                      }}
                    >
                      Load Older Messages
                    </Button>
                  </div>
                )}

                {messagesLoading ? (
                  <div className="py-8 text-center text-xs text-muted-foreground">
                    Loading messages...
                  </div>
                ) : ticketMessages.length === 0 ? (
                  <div className="py-8 text-center text-xs text-muted-foreground">
                    No messages yet.
                  </div>
                ) : (
                  [...ticketMessages].reverse().map((m: any) => {
                    const isUser = m.sender === "user";
                    const isSystem = m.sender === "system";
                    return (
                      <div
                        key={m.id}
                        className={cn(
                          "flex gap-2.5 max-w-[88%]",
                          isUser ? "ml-auto flex-row-reverse" : "",
                        )}
                      >
                        <div
                          className={cn(
                            "h-7 w-7 rounded-lg shrink-0 flex items-center justify-center text-[10px] font-medium border",
                            isUser
                              ? "bg-primary text-primary-foreground border-primary/20"
                              : isSystem
                                ? "bg-muted text-muted-foreground border-border"
                                : "bg-muted text-muted-foreground border-border",
                          )}
                        >
                          {isUser ? "U" : isSystem ? "S" : "M"}
                        </div>
                        <div className="space-y-1">
                          <div
                            className={cn(
                              "flex items-center gap-2",
                              isUser && "justify-end",
                            )}
                          >
                            <span className="text-[11px] font-medium text-foreground">
                              {m.senderName}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              {m.timestamp}
                            </span>
                          </div>
                          <div
                            className={cn(
                              "px-3 py-2 rounded-xl text-xs leading-relaxed",
                              isUser
                                ? "bg-muted border border-border text-foreground rounded-tr-sm"
                                : "bg-primary text-primary-foreground rounded-tl-sm",
                            )}
                          >
                            <div
                              dangerouslySetInnerHTML={{ __html: m.body }}
                              className="[&_ul]:list-disc [&_ul]:ml-4 [&_ol]:list-decimal [&_ol]:ml-4 [&_h1]:text-lg [&_h1]:font-bold [&_h2]:text-base [&_h2]:font-bold [&_h3]:text-sm [&_h3]:font-bold [&_p]:mb-2 last:[&_p]:mb-0 [&_a]:underline"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}

                {messagesCursorStack.length > 0 && (
                  <div className="flex justify-center mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs h-7"
                      onClick={() => {
                        const newStack = [...messagesCursorStack];
                        newStack.pop();
                        setMessagesCursorStack(newStack);
                        setMessagesAfterCursor(
                          newStack.length > 0
                            ? newStack[newStack.length - 1]
                            : null,
                        );
                      }}
                    >
                      Show Newer Messages
                    </Button>
                  </div>
                )}
              </div>

              {/* Reply input */}
              <div className="p-3 border-t border-border">
                {selectedTicket.replyMode === "read-only" ? (
                  <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg text-muted-foreground">
                    <Lock className="h-3.5 w-3.5" />
                    <span className="text-[11px] font-medium">
                      Replies are locked for this thread.
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <RichTextEditor
                      value={replyText}
                      onChange={(val) => setReplyText(val)}
                      placeholder="Type your response..."
                      minHeight="80px"
                    />
                    <div className="flex justify-end">
                      <Button
                        onClick={handleSendReply}
                        disabled={isReplying}
                        className="h-8 text-xs px-4 bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        {isReplying ? (
                          <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                        ) : (
                          <Send className="h-3.5 w-3.5 mr-1.5" />
                        )}
                        Reply as Admin
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 bg-muted/10">
              <Headset className="h-10 w-10 text-muted-foreground/20 mb-3" />
              <p className="text-sm font-semibold text-foreground">
                No active thread
              </p>
              <p className="text-xs text-muted-foreground mt-1 max-w-[220px] text-center leading-relaxed">
                Select a ticket from the queue on the left to review details and
                respond.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Modal: Create Ticket ── */}
      <CreateTicketModal
        isOpen={ticketModalOpen}
        onClose={() => setTicketModalOpen(false)}
        onCreateTicket={async (subject, category, subCategory, description, targetUserId, targetUserIds, allowReplies, recipientType) => {
          await onCreateTicket(subject, category, subCategory, description, targetUserId, targetUserIds, allowReplies, recipientType);
          setTicketModalOpen(false);
        }}
      />

      {/* ── Modal: Appeal ── */}
      {appealModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-xl border border-border bg-card shadow-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">
                File Appeal
              </h3>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => setAppealModalOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <form onSubmit={handleLaunchAppeal} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-muted-foreground">
                  Target Strike
                </label>
                <Input
                  required
                  placeholder="e.g. STR-002 Temporary Restriction"
                  value={appealSubject}
                  onChange={(e) => setAppealSubject(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-muted-foreground">
                  Reason
                </label>
                <RichTextEditor
                  value={appealDesc}
                  onChange={(val) => setAppealDesc(val)}
                  placeholder="Explain why this action was incorrect..."
                  minHeight="120px"
                />
              </div>
              <Button
                type="submit"
                variant="destructive"
                className="w-full h-9 text-xs"
              >
                Submit Appeal
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
