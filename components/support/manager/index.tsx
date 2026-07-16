"use client";

import React, { useState } from "react";
import {
  HeadphonesIcon,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  User,
  Tag,
  Search,
  Filter,
  ArrowUpRight,
  ChevronRight,
  MoreHorizontal,
  Inbox,
  Zap,
  TrendingUp,
  Star,
  RefreshCw,
  Plus,
  Circle,
  XCircle,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type TicketStatus = "open" | "in_progress" | "resolved" | "closed";
type TicketPriority = "low" | "medium" | "high" | "urgent";

interface Ticket {
  id: string;
  subject: string;
  member: string;
  memberAvatar: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: string;
  createdAt: string;
  lastActivity: string;
  messages: number;
  assignee?: string;
}

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------
const MOCK_TICKETS: Ticket[] = [
  {
    id: "TKT-001",
    subject: "Unable to access premium features after upgrade",
    member: "Aarav Sharma",
    memberAvatar: "AS",
    status: "open",
    priority: "urgent",
    category: "Billing",
    createdAt: "2h ago",
    lastActivity: "45m ago",
    messages: 3,
    assignee: "You",
  },
  {
    id: "TKT-002",
    subject: "Profile photo not updating after multiple attempts",
    member: "Priya Kapoor",
    memberAvatar: "PK",
    status: "in_progress",
    priority: "medium",
    category: "Account",
    createdAt: "5h ago",
    lastActivity: "2h ago",
    messages: 7,
    assignee: "You",
  },
  {
    id: "TKT-003",
    subject: "Community event not showing in calendar",
    member: "Rohan Mehta",
    memberAvatar: "RM",
    status: "open",
    priority: "low",
    category: "Events",
    createdAt: "1d ago",
    lastActivity: "8h ago",
    messages: 2,
  },
  {
    id: "TKT-004",
    subject: "Forum post getting flagged incorrectly by moderation",
    member: "Sneha Verma",
    memberAvatar: "SV",
    status: "resolved",
    priority: "high",
    category: "Moderation",
    createdAt: "2d ago",
    lastActivity: "1d ago",
    messages: 12,
    assignee: "You",
  },
  {
    id: "TKT-005",
    subject: "Reward points not credited after completing challenge",
    member: "Karan Joshi",
    memberAvatar: "KJ",
    status: "in_progress",
    priority: "high",
    category: "Gamification",
    createdAt: "3h ago",
    lastActivity: "1h ago",
    messages: 5,
    assignee: "You",
  },
  {
    id: "TKT-006",
    subject: "Newsletter subscription confirmation not arriving",
    member: "Divya Nair",
    memberAvatar: "DN",
    status: "closed",
    priority: "low",
    category: "Email",
    createdAt: "3d ago",
    lastActivity: "2d ago",
    messages: 4,
  },
];

const STATUS_CONFIG: Record<TicketStatus, { label: string; icon: any; color: string; bg: string }> = {
  open: { label: "Open", icon: Circle, color: "text-blue-600", bg: "bg-blue-50 border-blue-100" },
  in_progress: { label: "In Progress", icon: RefreshCw, color: "text-amber-600", bg: "bg-amber-50 border-amber-100" },
  resolved: { label: "Resolved", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100" },
  closed: { label: "Closed", icon: XCircle, color: "text-slate-400", bg: "bg-slate-50 border-slate-100" },
};

const PRIORITY_CONFIG: Record<TicketPriority, { label: string; color: string; dot: string }> = {
  low: { label: "Low", color: "text-slate-400", dot: "bg-slate-300" },
  medium: { label: "Medium", color: "text-blue-500", dot: "bg-blue-400" },
  high: { label: "High", color: "text-amber-500", dot: "bg-amber-400" },
  urgent: { label: "Urgent", color: "text-rose-500", dot: "bg-rose-500" },
};

// ---------------------------------------------------------------------------
// Stat Card
// ---------------------------------------------------------------------------
function SupportStat({
  label,
  value,
  icon: Icon,
  trend,
  color,
}: {
  label: string;
  value: string;
  icon: any;
  trend?: string;
  color: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className={cn("h-9 w-9 rounded-xl border flex items-center justify-center", color)}>
          <Icon className="h-4 w-4" />
        </div>
        {trend && (
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">
            {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-xl font-black text-slate-900 tabular-nums">{value}</p>
        <p className="text-[11px] font-medium text-slate-500 mt-0.5">{label}</p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Ticket Row
// ---------------------------------------------------------------------------
function TicketRow({ ticket }: { ticket: Ticket }) {
  const status = STATUS_CONFIG[ticket.status];
  const priority = PRIORITY_CONFIG[ticket.priority];
  const StatusIcon = status.icon;

  return (
    <div className="group px-6 py-4 flex items-center gap-4 hover:bg-slate-50/50 transition-colors cursor-pointer border-b border-slate-50 last:border-0">
      {/* Priority dot */}
      <div className={cn("h-2 w-2 rounded-full shrink-0", priority.dot)} />

      {/* Avatar */}
      <div className="h-8 w-8 rounded-full bg-linear-to-br from-slate-200 to-slate-300 flex items-center justify-center text-[10px] font-black text-slate-600 shrink-0">
        {ticket.memberAvatar}
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
          {ticket.subject}
        </p>
        <div className="flex items-center gap-3 mt-0.5">
          <span className="text-[10px] font-medium text-slate-400">{ticket.member}</span>
          <span className="h-0.5 w-0.5 rounded-full bg-slate-300" />
          <span className="text-[10px] font-medium text-slate-400">{ticket.id}</span>
          <span className="h-0.5 w-0.5 rounded-full bg-slate-300" />
          <span className="text-[10px] font-bold text-slate-400">{ticket.category}</span>
        </div>
      </div>

      {/* Status badge */}
      <div className={cn("hidden sm:flex items-center gap-1 px-2 py-1 rounded-lg border text-[10px] font-bold", status.bg, status.color)}>
        <StatusIcon className="h-2.5 w-2.5" />
        {status.label}
      </div>

      {/* Messages */}
      <div className="hidden md:flex items-center gap-1 text-[10px] font-bold text-slate-400">
        <MessageSquare className="h-3 w-3" />
        {ticket.messages}
      </div>

      {/* Time */}
      <div className="hidden lg:block text-[10px] font-medium text-slate-400 shrink-0">
        {ticket.lastActivity}
      </div>

      {/* Assignee chip */}
      {ticket.assignee && (
        <div className="hidden md:flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
          <User className="h-2.5 w-2.5" />
          {ticket.assignee}
        </div>
      )}

      <ChevronRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-slate-500 transition-colors shrink-0" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------
export default function SupportManagerDashboard() {
  const [search, setSearch] = useState("");
  const [activeStatus, setActiveStatus] = useState<TicketStatus | "all">("all");

  const filtered = MOCK_TICKETS.filter((t) => {
    const matchSearch = t.subject.toLowerCase().includes(search.toLowerCase()) ||
      t.member.toLowerCase().includes(search.toLowerCase());
    const matchStatus = activeStatus === "all" || t.status === activeStatus;
    return matchSearch && matchStatus;
  });

  const openCount = MOCK_TICKETS.filter((t) => t.status === "open").length;
  const inProgressCount = MOCK_TICKETS.filter((t) => t.status === "in_progress").length;
  const resolvedToday = MOCK_TICKETS.filter((t) => t.status === "resolved").length;
  const urgentCount = MOCK_TICKETS.filter((t) => t.priority === "urgent").length;

  return (
    <div className="max-w-7xl mx-auto py-10 px-6 space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-2 w-2 rounded-full bg-blue-500" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Support Hub
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Support Manager</h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Handle member support tickets, resolve issues, and track resolution metrics.
          </p>
        </div>
        <button className="h-11 px-6 bg-slate-900 hover:bg-black text-white text-sm font-bold rounded-xl transition-all flex items-center gap-2 self-start md:self-auto">
          <Plus className="h-4 w-4" />
          New Ticket
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <SupportStat
          label="Open Tickets"
          value={openCount.toString()}
          icon={Inbox}
          color="bg-blue-50 border-blue-100 text-blue-600"
        />
        <SupportStat
          label="In Progress"
          value={inProgressCount.toString()}
          icon={RefreshCw}
          color="bg-amber-50 border-amber-100 text-amber-600"
        />
        <SupportStat
          label="Resolved Today"
          value={resolvedToday.toString()}
          icon={CheckCircle2}
          trend="+3 vs yesterday"
          color="bg-emerald-50 border-emerald-100 text-emerald-600"
        />
        <SupportStat
          label="Urgent"
          value={urgentCount.toString()}
          icon={AlertCircle}
          color="bg-rose-50 border-rose-100 text-rose-500"
        />
      </div>

      {/* Main Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ticket List */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
          {/* Toolbar */}
          <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search tickets..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all text-slate-900 placeholder:text-slate-400"
              />
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {(["all", "open", "in_progress", "resolved", "closed"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setActiveStatus(s)}
                  className={cn(
                    "h-7 px-3 rounded-lg text-[10px] font-bold transition-all",
                    activeStatus === s
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  )}
                >
                  {s === "all" ? "All" : s === "in_progress" ? "In Progress" : STATUS_CONFIG[s].label}
                </button>
              ))}
            </div>
          </div>

          {/* List */}
          <div className="divide-y divide-transparent">
            {filtered.length === 0 ? (
              <div className="py-16 flex flex-col items-center gap-3 text-center">
                <HeadphonesIcon className="h-10 w-10 text-slate-200" />
                <p className="text-sm font-semibold text-slate-500">No tickets found</p>
              </div>
            ) : (
              filtered.map((ticket) => <TicketRow key={ticket.id} ticket={ticket} />)
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Response Time */}
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-900">Response Time</h4>
              <Clock className="h-4 w-4 text-slate-300" />
            </div>
            {[
              { label: "Avg. First Response", value: "2.4h", good: true },
              { label: "Avg. Resolution", value: "18.2h", good: true },
              { label: "SLA Breached", value: "1", good: false },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">{item.label}</span>
                <span className={cn("text-xs font-black", item.good ? "text-slate-900" : "text-rose-500")}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>

          {/* Category Breakdown */}
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-900">By Category</h4>
              <Layers className="h-4 w-4 text-slate-300" />
            </div>
            {Object.entries(
              MOCK_TICKETS.reduce((acc: Record<string, number>, t) => {
                acc[t.category] = (acc[t.category] || 0) + 1;
                return acc;
              }, {})
            ).map(([cat, count]) => (
              <div key={cat} className="flex items-center justify-between">
                <span className="text-xs text-slate-600 font-medium">{cat}</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${(count / MOCK_TICKETS.length) * 100}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-black text-slate-500 w-4 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>

          {/* CSAT */}
          <div className="bg-slate-950 rounded-2xl p-5 text-white space-y-4">
            <div>
              <Star className="h-5 w-5 text-amber-400 mb-2" />
              <p className="text-sm font-bold">CSAT Score</p>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black">4.7</span>
              <span className="text-slate-400 text-sm font-bold">/ 5.0</span>
            </div>
            <div className="flex gap-0.5">
              {[5, 5, 5, 5, 3].map((v, i) => (
                <div
                  key={i}
                  className={cn("flex-1 h-1.5 rounded-full", v >= 5 ? "bg-amber-400" : "bg-slate-700")}
                />
              ))}
            </div>
            <p className="text-[10px] text-slate-400 font-medium">Based on 48 recent ratings</p>
          </div>
        </div>
      </div>
    </div>
  );
}
