"use client";

import React, { useState, useEffect } from "react";
import {
  Inbox,
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
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSearchUserByName } from "@/graphql/actions/mentorship/mentorship-actions";
import { useQuery } from "@apollo/client";
import { GET_SUPPORT_TICKETS } from "@/graphql/quries/trust-center";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { EcosystemCard } from "@/components/layout/ecosystem/ecosystem-analytics";
import { Ticket, Strike } from "./trust-center-dashboard";

interface MemberInboxPortalProps {
  onSignPolicy: (id: string, signature: string) => void;
  onReply: (id: string, body: string) => void;
  onCreateTicket: (
    subject: string,
    category: any,
    subCategory: string | undefined,
    description: string,
    linkedUser?: string,
    allowReplies?: boolean,
    recipientType?: "all" | "one" | "multiple",
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
  onCreateAppeal,
}: MemberInboxPortalProps) {
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [limit] = useState(10);
  const [offset, setOffset] = useState(0);

  const { data: ticketsData, loading: ticketsLoading } = useQuery(GET_SUPPORT_TICKETS, {
    variables: {
      category: activeCategory === "ALL" ? null : activeCategory,
      limit,
      offset,
    },
    fetchPolicy: "cache-and-network",
  });

  const rawTickets = ticketsData?.getSupportTickets?.items || [];
  const totalTickets = ticketsData?.getSupportTickets?.totalCount || 0;

  const fetchedTickets: Ticket[] = rawTickets.map((t: any) => ({
    id: t.id,
    subject: t.subject,
    category: t.category,
    status: t.status?.toLowerCase() || "open",
    priority: t.priority?.toLowerCase() || "medium",
    lastActivity: new Date(t.updatedAt).toLocaleDateString(),
    creator: t.createdBy ? `${t.createdBy.firstName} ${t.createdBy.lastName}` : "Unknown",
    type: t.category === "ANNOUNCEMENT" ? "announcement" : "conversation",
    replyMode: t.allowReplies ? "interactive" : "read-only",
    allowedReplies: t.allowReplies,
    messages: (t.messages || []).map((m: any) => ({
      id: m.id,
      sender: m.senderType === "SYSTEM" ? "system" : m.senderType === "ADMIN" ? "staff" : "user",
      senderName: m.senderName || "Unknown",
      body: m.body,
      timestamp: new Date(m.createdAt).toLocaleDateString(),
    })),
    linkedUser: t.targetUserIds?.length ? `${t.targetUserIds.length} Users` : t.targetUserId ? "Specific User" : undefined,
    subCategory: t.subCategory,
    description: t.description,
  }));

  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  useEffect(() => {
    if (fetchedTickets.length > 0 && !selectedTicketId) {
      setSelectedTicketId(fetchedTickets[0].id);
    }
  }, [fetchedTickets, selectedTicketId]);
  const [replyText, setReplyText] = useState("");
  const [signatureName, setSignatureName] = useState("");

  // Modals
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [appealModalOpen, setAppealModalOpen] = useState(false);
  const [newSubject, setNewSubject] = useState("");
  const [newCat, setNewCat] = useState<Ticket["category"]>("Entity Support");
  const [newSubCat, setNewSubCat] = useState<string>("Policy Update");
  const [newDesc, setNewDesc] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [recipientType, setRecipientType] = useState<"all" | "one" | "multiple">("one");
  const [allowReplies, setAllowReplies] = useState(true);
  const [appealSubject, setAppealSubject] = useState("");
  const [appealDesc, setAppealDesc] = useState("");

  const [searchUser, { data: searchData, loading: searching }] =
    useSearchUserByName();

  useEffect(() => {
    if (recipientType === "all") {
      setNewCat("Announcement");
    } else if (newCat === "Announcement" || newCat === "Policy Updates" || newCat === "Security Notices") {
      setNewCat("Entity Support");
    }
  }, [recipientType]);

  useEffect(() => {
    if (newCat === "Moderation") setNewSubCat("Block");
    else if (newCat === "Entity Support") setNewSubCat("Policy Update");
    else setNewSubCat("");
  }, [newCat]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value.length >= 2) {
      searchUser({ variables: { name: value } });
    }
  };

  // Filtering is now handled by the backend
  const filteredTickets = fetchedTickets;

  const selectedTicket =
    fetchedTickets.find((t) => t.id === selectedTicketId) ||
    fetchedTickets[0] ||
    null;

  const handleSendReply = () => {
    if (!replyText.trim() || !selectedTicket) return;
    onReply(selectedTicket.id, replyText.trim());
    setReplyText("");
  };

  const handleLaunchTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim() || !newDesc.trim()) return;

    let linkedUserStr = undefined;
    if (recipientType === "one" && selectedUser) {
      linkedUserStr = `${selectedUser.user.firstName} ${selectedUser.user.lastName}`;
    } else if (recipientType === "multiple" && selectedUsers.length > 0) {
      linkedUserStr = selectedUsers.map(u => `${u.user.firstName} ${u.user.lastName}`).join(", ");
    }

    onCreateTicket(
      newSubject.trim(),
      newCat,
      newSubCat,
      newDesc.trim(),
      linkedUserStr,
      allowReplies,
      recipientType,
    );
    setNewSubject("");
    setNewDesc("");
    setNewSubCat(newCat === "Moderation" ? "Block" : newCat === "Entity Support" ? "Policy Update" : "");
    setSelectedUser(null);
    setSelectedUsers([]);
    setSearchQuery("");
    setRecipientType("one");
    setAllowReplies(true);
    setTicketModalOpen(false);
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
              <div className="h-7 w-7 rounded-lg bg-muted border border-border flex items-center justify-center">
                <Inbox className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
              <span className="text-sm font-semibold text-foreground">
                Inbox
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTicketModalOpen(true)}
              className="h-7 text-xs gap-1 rounded-lg"
            >
              <Plus className="h-3 w-3" /> New
            </Button>
          </div>

          {/* Category filter */}
          <div className="px-3 py-2 border-b border-border flex gap-1 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setOffset(0);
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

          {/* Items */}
          <div className="flex-1 overflow-y-auto divide-y divide-border max-h-[440px]">
            {filteredTickets.length === 0 ? (
              <div className="py-12 text-center">
                <Inbox className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">
                  No items in this category
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
                      "px-4 py-3 cursor-pointer transition-colors",
                      isActive ? "bg-muted/60" : "hover:bg-muted/30",
                    )}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Badge
                        variant="outline"
                        className="text-[9px] font-medium px-1.5 h-4"
                      >
                        {t.category}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground">
                        {t.lastActivity}
                      </span>
                    </div>
                    <p className="text-[13px] font-medium text-foreground truncate">
                      {t.subject}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-muted-foreground">
                        {t.id}
                      </span>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[9px] h-4 px-1.5 border",
                          STATUS_STYLES[t.status],
                        )}
                      >
                        {t.status.replace("_", " ")}
                      </Badge>
                    </div>
                    {t.linkedUser && (
                      <div className="mt-1 flex items-center gap-1 text-[9px] text-muted-foreground">
                        <UserCheck className="h-3 w-3" />
                        Target User: {t.linkedUser}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Pagination controls */}
          <div className="p-3 border-t border-border flex items-center justify-between">
            <span className="text-[11px] text-muted-foreground font-medium">
              Showing {Math.min(offset + 1, totalTickets)} - {Math.min(offset + limit, totalTickets)} of {totalTickets}
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs px-2"
                disabled={offset === 0}
                onClick={() => setOffset(Math.max(0, offset - limit))}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs px-2"
                disabled={offset + limit >= totalTickets}
                onClick={() => setOffset(offset + limit)}
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
              <div className="px-4 py-3 border-b border-border bg-muted/30">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-[9px] h-4 px-1.5">
                    {selectedTicket.category}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground">
                    {selectedTicket.id}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-foreground">
                  {selectedTicket.subject}
                </h3>
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
                {selectedTicket.messages?.map((m) => {
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
                              ? "bg-primary text-primary-foreground rounded-tr-sm"
                              : "bg-muted border border-border text-foreground rounded-tl-sm",
                          )}
                        >
                          {m.body}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Reply input */}
              <div className="p-3 border-t border-border">
                {selectedTicket.replyMode === "read-only" ? (
                  <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg text-muted-foreground">
                    <Lock className="h-3.5 w-3.5" />
                    <span className="text-[11px] font-medium">
                      Replies disabled for this thread. Only admins can post.
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
                        size="sm"
                        onClick={handleSendReply}
                        className="h-8 text-xs px-4"
                      >
                        <Send className="h-3.5 w-3.5 mr-1.5" />
                        Send Reply
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8">
              <Inbox className="h-10 w-10 text-muted-foreground/30 mb-2" />
              <p className="text-sm font-medium text-foreground">
                No thread selected
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Select a conversation from the inbox
              </p>
            </div>
          )}
        </div>
      </div>


      {/* ── Modal: Create Ticket ── */}
      {ticketModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-xl border border-border bg-card shadow-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">
                New Message / Ticket
              </h3>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => setTicketModalOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <form onSubmit={handleLaunchTicket} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-muted-foreground">
                  Recipient
                </label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={recipientType === "one" ? "default" : "outline"}
                    className="flex-1 h-8 text-xs"
                    onClick={() => {
                      setRecipientType("one");
                      setAllowReplies(true);
                    }}
                  >
                    Specific User
                  </Button>
                  <Button
                    type="button"
                    variant={recipientType === "multiple" ? "default" : "outline"}
                    className="flex-1 h-8 text-xs"
                    onClick={() => {
                      setRecipientType("multiple");
                      setAllowReplies(true);
                    }}
                  >
                    Multiple
                  </Button>
                  <Button
                    type="button"
                    variant={recipientType === "all" ? "default" : "outline"}
                    className="flex-1 h-8 text-xs"
                    onClick={() => {
                      setRecipientType("all");
                      setAllowReplies(false);
                    }}
                  >
                    All Members
                  </Button>
                </div>
              </div>

              {recipientType === "multiple" && (
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-muted-foreground">
                    Target Users
                  </label>
                  
                  {selectedUsers.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2 p-2 border border-border rounded-md bg-muted/30 max-h-24 overflow-y-auto">
                      {selectedUsers.map((u) => (
                        <div key={u.id} className="flex items-center gap-1.5 bg-background border border-border px-2 py-1 rounded-full">
                          <div className="h-4 w-4 rounded-full overflow-hidden bg-muted shrink-0">
                            {u.user?.avatar ? (
                              <Image
                                src={`https://cdn.thrico.network/${u.user.avatar}`}
                                alt="Avatar"
                                width={16}
                                height={16}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <UserCheck className="h-2.5 w-2.5 m-0.5 text-muted-foreground" />
                            )}
                          </div>
                          <span className="text-[10px] font-medium text-foreground">
                            {u.user?.firstName}
                          </span>
                          <button
                            type="button"
                            className="text-muted-foreground hover:text-foreground ml-0.5"
                            onClick={() => setSelectedUsers(selectedUsers.filter(user => user.id !== u.id))}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search to add users..."
                      value={searchQuery}
                      onChange={handleSearch}
                      className="h-9 pl-9 text-xs"
                    />
                    {searchQuery.length >= 2 &&
                      searchData?.searchUserByName && (
                        <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-md shadow-md max-h-48 overflow-y-auto">
                          {searchData.searchUserByName.filter((u: any) => !selectedUsers.find(su => su.id === u.id)).length === 0 ? (
                            <div className="p-3 text-xs text-muted-foreground text-center">
                              No more users found
                            </div>
                          ) : (
                            searchData.searchUserByName
                              .filter((u: any) => !selectedUsers.find(su => su.id === u.id))
                              .map((u: any) => (
                              <div
                                key={u.id}
                                className="flex items-center gap-2 p-2 hover:bg-muted cursor-pointer transition-colors"
                                onClick={() => {
                                  setSelectedUsers([...selectedUsers, u]);
                                  setSearchQuery("");
                                }}
                              >
                                <div className="h-6 w-6 rounded-full overflow-hidden bg-muted shrink-0">
                                  {u.user?.avatar ? (
                                    <Image
                                      src={`https://cdn.thrico.network/${u.user.avatar}`}
                                      alt="Avatar"
                                      width={24}
                                      height={24}
                                      className="h-full w-full object-cover"
                                    />
                                  ) : (
                                    <UserCheck className="h-4 w-4 m-1 text-muted-foreground" />
                                  )}
                                </div>
                                <div>
                                  <p className="text-xs font-medium text-foreground">
                                    {u.user?.firstName} {u.user?.lastName}
                                  </p>
                                  <p className="text-[9px] text-muted-foreground">
                                    {u.status}
                                  </p>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      )}
                  </div>
                </div>
              )}

              {recipientType === "one" && (
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-muted-foreground">
                    Target User
                  </label>
                  {!selectedUser ? (
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search users by name..."
                        value={searchQuery}
                        onChange={handleSearch}
                        className="h-9 pl-9 text-xs"
                      />
                      {searchQuery.length >= 2 &&
                        searchData?.searchUserByName && (
                          <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-md shadow-md max-h-48 overflow-y-auto">
                            {searchData.searchUserByName.length === 0 ? (
                              <div className="p-3 text-xs text-muted-foreground text-center">
                                No users found
                              </div>
                            ) : (
                              searchData.searchUserByName.map((u: any) => (
                                <div
                                  key={u.id}
                                  className="flex items-center gap-2 p-2 hover:bg-muted cursor-pointer transition-colors"
                                  onClick={() => {
                                    setSelectedUser(u);
                                    setSearchQuery("");
                                  }}
                                >
                                  <div className="h-6 w-6 rounded-full overflow-hidden bg-muted shrink-0">
                                    {u.user?.avatar ? (
                                      <Image
                                        src={`https://cdn.thrico.network/${u.user.avatar}`}
                                        alt="Avatar"
                                        width={24}
                                        height={24}
                                        className="h-full w-full object-cover"
                                      />
                                    ) : (
                                      <UserCheck className="h-4 w-4 m-1 text-muted-foreground" />
                                    )}
                                  </div>
                                  <div>
                                    <p className="text-xs font-medium text-foreground">
                                      {u.user?.firstName} {u.user?.lastName}
                                    </p>
                                    <p className="text-[9px] text-muted-foreground">
                                      {u.status}
                                    </p>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-2 border border-border rounded-md bg-muted/50">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full overflow-hidden bg-background shrink-0">
                          {selectedUser.user?.avatar ? (
                            <Image
                              src={`https://cdn.thrico.network/${selectedUser.user.avatar}`}
                              alt="Avatar"
                              width={24}
                              height={24}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <UserCheck className="h-4 w-4 m-1 text-muted-foreground" />
                          )}
                        </div>
                        <span className="text-xs font-medium text-foreground">
                          {selectedUser.user?.firstName}{" "}
                          {selectedUser.user?.lastName}
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-[10px]"
                        onClick={() => setSelectedUser(null)}
                      >
                        Change
                      </Button>
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[11px] font-medium text-muted-foreground">
                  Subject
                </label>
                <Input
                  required
                  placeholder="Summarize the request"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-muted-foreground">
                  Category
                </label>
                <select
                  value={newCat}
                  onChange={(e) => setNewCat(e.target.value as any)}
                  className="w-full h-9 px-3 text-xs bg-background border border-input rounded-md"
                >
                  {recipientType === "all" ? (
                    <>
                      <option value="Announcement">Announcement</option>
                      <option value="Policy Updates">Policy Updates</option>
                      <option value="Security Notices">Security Notices</option>
                    </>
                  ) : (
                    <>
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Entity Support">Entity Support</option>
                      <option value="Moderation">Moderation</option>
                      <option value="Appeals">Appeals</option>
                    </>
                  )}
                </select>
              </div>

              {(newCat === "Moderation" || newCat === "Entity Support") && (
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-muted-foreground">
                    Sub-Category
                  </label>
                  <select
                    value={newSubCat}
                    onChange={(e) => setNewSubCat(e.target.value)}
                    className="w-full h-9 px-3 text-xs bg-background border border-input rounded-md"
                  >
                    {newCat === "Moderation" && (
                      <>
                        <option value="Block">Block</option>
                        <option value="Warning">Warning</option>
                      </>
                    )}
                    {newCat === "Entity Support" && (
                      <>
                        <option value="Policy Update">Policy Update</option>
                        <option value="Platform Update">Platform Update</option>
                      </>
                    )}
                  </select>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[11px] font-medium text-muted-foreground">
                  Details
                </label>
                <RichTextEditor
                  value={newDesc}
                  onChange={(val) => setNewDesc(val)}
                  placeholder="Describe the issue..."
                  minHeight="120px"
                />
              </div>

              <div className="space-y-2 pt-2 border-t border-border">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allowReplies}
                    onChange={(e) => setAllowReplies(e.target.checked)}
                    className="mt-1"
                  />
                  <div>
                    <span className="text-xs font-medium text-foreground">
                      Allow user replies
                    </span>
                    <p className="text-[10px] text-muted-foreground">
                      {allowReplies
                        ? "Users can reply to this thread."
                        : "Only admins can reply to this thread."}
                    </p>
                  </div>
                </label>
              </div>

              <Button type="submit" className="w-full h-9 text-xs">
                Send Message
              </Button>
            </form>
          </div>
        </div>
      )}

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
