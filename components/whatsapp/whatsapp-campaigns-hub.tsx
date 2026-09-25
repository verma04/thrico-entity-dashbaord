"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Send,
  CheckCircle2,
  Eye,
  AlertCircle,
  Clock,
  MessageSquare,
  LayoutGrid,
  List as ListIcon,
  Upload,
  MoreHorizontal,
  BarChart2,
  TrendingUp,
  Megaphone,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CtaButton } from "@/components/ui/cta-button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { AdminStatusBadge } from "@/components/shared/admin-table/admin-table";
import { useWhatsAppStore } from "./whatsapp-store";
import { WhatsAppMessage } from "./types";
import { toast } from "sonner";
import { buildCsv, downloadCsv } from "@/lib/export-csv";

export function WhatsAppCampaignsHub() {
  const router = useRouter();
  const { messages } = useWhatsAppStore();

  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedMessage, setSelectedMessage] =
    useState<WhatsAppMessage | null>(null);

  const stats = useMemo(() => {
    const total = messages.length;
    const delivered = messages.filter(
      (m) => m.status === "DELIVERED" || m.status === "READ"
    ).length;
    const read = messages.filter((m) => m.status === "READ").length;
    const failed = messages.filter((m) => m.status === "FAILED").length;
    const deliveryRate = total > 0 ? ((delivered / total) * 100).toFixed(1) : "0.0";
    const readRate = delivered > 0 ? ((read / delivered) * 100).toFixed(1) : "0.0";
    return { total, delivered, read, failed, deliveryRate, readRate };
  }, [messages]);

  const filteredMessages = useMemo(() => {
    return messages.filter((msg) => {
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        msg.recipientName.toLowerCase().includes(q) ||
        msg.recipientPhone.includes(q) ||
        msg.templateName.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === "ALL" || msg.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [messages, search, statusFilter]);

  const handleExportCsv = () => {
    const columns = [
      { header: "ID", getValue: (r: WhatsAppMessage) => r.id },
      { header: "Recipient Name", getValue: (r: WhatsAppMessage) => r.recipientName },
      { header: "Recipient Phone", getValue: (r: WhatsAppMessage) => r.recipientPhone },
      { header: "Template", getValue: (r: WhatsAppMessage) => r.templateName },
      { header: "Status", getValue: (r: WhatsAppMessage) => r.status },
      { header: "Sent At", getValue: (r: WhatsAppMessage) => r.sentAt },
      { header: "Delivered At", getValue: (r: WhatsAppMessage) => r.deliveredAt || "" },
      { header: "Read At", getValue: (r: WhatsAppMessage) => r.readAt || "" },
    ];
    const csv = buildCsv(filteredMessages, columns);
    downloadCsv(csv, `whatsapp_broadcasts_${Date.now()}.csv`);
    toast.success("Broadcast logs exported to CSV");
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* ── KPI Summary Cards (Matching Email CampaignKpiSummary) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Total Campaigns */}
        <Card className="border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs hover:border-[#aeb4b9] dark:hover:border-zinc-700 transition-all rounded-[8px]">
          <CardContent className="p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Total Broadcasts
              </span>
              <div className="h-7 w-7 rounded-[4px] bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/40">
                <Megaphone className="h-3.5 w-3.5" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-foreground tracking-tight">
                  {stats.total.toLocaleString()}
                </span>
                <Badge
                  variant="secondary"
                  className="text-[9px] px-1.5 py-0 font-bold bg-muted text-muted-foreground rounded-[3px]"
                >
                  {stats.delivered} Delivered
                </Badge>
              </div>
              <p className="text-[11px] text-muted-foreground mt-2 flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-indigo-500" />
                Dispatched WhatsApp broadcasts
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Deliverability Rate */}
        <Card className="border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs hover:border-[#aeb4b9] dark:hover:border-zinc-700 transition-all rounded-[8px]">
          <CardContent className="p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Deliverability Rate
              </span>
              <div className="h-7 w-7 rounded-[4px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-100 dark:border-emerald-900/40">
                <CheckCircle2 className="h-3.5 w-3.5" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400 tracking-tight">
                  {stats.deliveryRate}%
                </span>
                <Badge
                  variant="secondary"
                  className="text-[9px] px-1.5 py-0 font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 rounded-[3px]"
                >
                  {stats.total > 0 ? "Meta Verified" : "No Dispatches"}
                </Badge>
              </div>
              <p className="text-[11px] text-muted-foreground mt-2 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                {stats.total > 0 ? "Successful DLR handshake" : "No transmission data"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Read / Open Rate */}
        <Card className="border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs hover:border-[#aeb4b9] dark:hover:border-zinc-700 transition-all rounded-[8px]">
          <CardContent className="p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Read Rate
              </span>
              <div className="h-7 w-7 rounded-[4px] bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-100 dark:border-blue-900/40">
                <Eye className="h-3.5 w-3.5" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-blue-600 dark:text-blue-400 tracking-tight">
                  {stats.readRate}%
                </span>
                <Badge
                  variant="secondary"
                  className="text-[9px] px-1.5 py-0 font-bold bg-muted text-muted-foreground rounded-[3px]"
                >
                  {stats.read} Opened
                </Badge>
              </div>
              <p className="text-[11px] text-muted-foreground mt-2 flex items-center gap-1">
                <Eye className="h-3 w-3 text-blue-500" />
                Audience read receipts
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Failed */}
        <Card className="border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs hover:border-[#aeb4b9] dark:hover:border-zinc-700 transition-all rounded-[8px]">
          <CardContent className="p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Delivery Failures
              </span>
              <div className="h-7 w-7 rounded-[4px] bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-100 dark:border-rose-900/40">
                <AlertCircle className="h-3.5 w-3.5" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-rose-600 dark:text-rose-400 tracking-tight">
                  {stats.failed}
                </span>
                <Badge
                  variant="secondary"
                  className="text-[9px] px-1.5 py-0 font-bold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 rounded-[3px]"
                >
                  {stats.failed > 0 ? "Failed Deliveries" : "Zero Errors"}
                </Badge>
              </div>
              <p className="text-[11px] text-muted-foreground mt-2 flex items-center gap-1">
                <AlertCircle className="h-3 w-3 text-rose-500" />
                {stats.failed > 0 ? "Opted-out or invalid numbers" : "No delivery failures"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Action / Filter Bar (Matching EcosystemActionBar in CampaignsHub) ── */}
      <EcosystemActionBar shadow="none" className="rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800">
        <EcosystemActionBar.Group className="flex-1 flex-wrap sm:flex-nowrap">
          <EcosystemActionBar.Item className="w-56 sm:w-64 shrink-0">
            <EcosystemActionBar.Search
              value={search}
              onChange={setSearch}
              placeholder="Search broadcasts by member, phone, or template…"
            />
          </EcosystemActionBar.Item>

          <EcosystemActionBar.Separator />

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-[30px] w-[130px] shrink-0 rounded-[4px] border-[#aeb4b9] dark:border-zinc-700 shadow-2xs text-[12px] bg-white dark:bg-zinc-900 font-medium">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent align="start" className="rounded-[6px]">
              <SelectItem value="ALL" className="text-xs">All Statuses</SelectItem>
              <SelectItem value="READ" className="text-xs">Read ({stats.read})</SelectItem>
              <SelectItem value="DELIVERED" className="text-xs">Delivered</SelectItem>
              <SelectItem value="SENT" className="text-xs">Sent</SelectItem>
              <SelectItem value="FAILED" className="text-xs">Failed ({stats.failed})</SelectItem>
            </SelectContent>
          </Select>

          {/* View Switcher: Grid vs List */}
          <div className="flex items-center rounded-[4px] border border-[#aeb4b9] dark:border-zinc-700 bg-white dark:bg-zinc-900 p-0.5 shadow-2xs shrink-0">
            <button
              type="button"
              onClick={() => setView("grid")}
              className={`p-1 rounded-[3px] transition-all cursor-pointer ${
                view === "grid"
                  ? "bg-[#303030] text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="Grid View"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setView("list")}
              className={`p-1 rounded-[3px] transition-all cursor-pointer ${
                view === "list"
                  ? "bg-[#303030] text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="List View"
            >
              <ListIcon className="h-3.5 w-3.5" />
            </button>
          </div>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Group align="right">
          <CtaButton
            variant="outline"
            size="sm"
            onClick={handleExportCsv}
            className="h-[30px] rounded-[4px] text-xs gap-1.5 font-medium border-[#aeb4b9] dark:border-zinc-700 shadow-2xs"
          >
            <Upload className="h-3.5 w-3.5" />
            Export CSV
          </CtaButton>

          <CtaButton
            size="sm"
            onClick={() => router.push("/marketing/whatsapp/send")}
            className="h-[30px] rounded-[4px] gap-1.5 text-[12px] font-semibold bg-[#303030] text-white hover:bg-[#202020] dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer shadow-2xs"
          >
            <Send className="h-3.5 w-3.5" />
            Send Broadcast
          </CtaButton>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      {/* ── Content View: Grid vs Table ── */}
      {filteredMessages.length === 0 ? (
        <Card className="border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-12 text-center rounded-[8px]">
          <MessageSquare className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-foreground">No message broadcasts found</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Try adjusting your search criteria or compose a new broadcast.
          </p>
          <div className="mt-4">
            <CtaButton
              size="sm"
              onClick={() => router.push("/marketing/whatsapp/send")}
              className="h-[30px] rounded-[4px] gap-1.5 text-[12px] font-semibold bg-[#303030] text-white hover:bg-[#202020] dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer shadow-2xs"
            >
              <Send className="h-3.5 w-3.5" />
              Compose Broadcast
            </CtaButton>
          </div>
        </Card>
      ) : view === "grid" ? (
        /* ── Grid View (Matching CampaignCard) ── */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredMessages.map((msg) => (
            <Card
              key={msg.id}
              className="group rounded-xl border border-border/60 bg-card hover:border-border hover:shadow-2xs transition-all flex flex-col justify-between space-y-4 p-4"
            >
              <div className="space-y-3">
                {/* Header row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-[4px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-100 dark:border-emerald-900/40 shrink-0">
                      <MessageSquare className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-[13px] font-bold text-foreground truncate max-w-[180px] group-hover:text-emerald-600 transition-colors">
                        {msg.recipientName}
                      </h4>
                      <p className="text-[10.5px] text-muted-foreground font-mono truncate max-w-[180px]">
                        {msg.recipientPhone}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <AdminStatusBadge
                      status={msg.status}
                      variant={
                        msg.status === "READ" || msg.status === "DELIVERED"
                          ? "success"
                          : msg.status === "FAILED"
                          ? "error"
                          : "info"
                      }
                      className="text-[9.5px] px-1.5 py-0"
                    />

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <CtaButton
                          variant="ghost"
                          size="icon-xs"
                          className="h-6 w-6 text-muted-foreground hover:text-foreground rounded-[4px] cursor-pointer"
                        >
                          <MoreHorizontal className="h-3.5 w-3.5" />
                        </CtaButton>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-36 rounded-[6px]">
                        <DropdownMenuItem
                          onClick={() => setSelectedMessage(msg)}
                          className="text-[11.5px] font-semibold cursor-pointer"
                        >
                          <BarChart2 className="h-3 w-3 mr-1.5 text-emerald-500" />
                          Analytics
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(
                              `/marketing/whatsapp/send?template=${encodeURIComponent(msg.templateName)}`
                            )
                          }
                          className="text-[11.5px] font-semibold cursor-pointer"
                        >
                          <Send className="h-3 w-3 mr-1.5 text-blue-500" />
                          Resend Template
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Template badge */}
                <div className="p-2.5 rounded-[6px] bg-muted/40 border border-border/40 space-y-1">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-muted-foreground">Template:</span>
                    <span className="font-mono font-semibold text-foreground">
                      {msg.templateName}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[10.5px]">
                    <span className="text-muted-foreground">Handshake:</span>
                    <span className="text-emerald-600 font-medium">Meta Cloud API</span>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-2 border-t border-border/50 flex items-center justify-between text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {new Date(msg.sentAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <CtaButton
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedMessage(msg)}
                  className="h-6 text-[11px] px-1.5 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  View Details
                </CtaButton>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        /* ── List / Table View (Matching CampaignsTable) ── */
        <Card className="border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs rounded-[8px] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-muted/40 border-b border-border/60 text-muted-foreground text-left font-semibold text-[10.5px] uppercase tracking-wider">
                  <th className="py-2.5 px-4">Recipient</th>
                  <th className="py-2.5 px-4">Template</th>
                  <th className="py-2.5 px-4">Status</th>
                  <th className="py-2.5 px-4">Dispatched</th>
                  <th className="py-2.5 px-4">Delivered</th>
                  <th className="py-2.5 px-4">Read</th>
                  <th className="py-2.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filteredMessages.map((msg) => (
                  <tr
                    key={msg.id}
                    className="hover:bg-muted/40 transition-colors group cursor-pointer"
                    onClick={() => setSelectedMessage(msg)}
                  >
                    <td className="py-2.5 px-4">
                      <div>
                        <p className="font-semibold text-foreground text-[12px]">
                          {msg.recipientName}
                        </p>
                        <p className="text-[11px] text-muted-foreground font-mono">
                          {msg.recipientPhone}
                        </p>
                      </div>
                    </td>
                    <td className="py-2.5 px-4">
                      <span className="font-mono text-foreground font-medium bg-muted px-2 py-0.5 rounded-[4px] text-[11px]">
                        {msg.templateName}
                      </span>
                    </td>
                    <td className="py-2.5 px-4">
                      <AdminStatusBadge
                        status={msg.status}
                        variant={
                          msg.status === "READ" || msg.status === "DELIVERED"
                            ? "success"
                            : msg.status === "FAILED"
                            ? "error"
                            : "info"
                        }
                        className="text-[10px]"
                      />
                    </td>
                    <td className="py-2.5 px-4 text-muted-foreground">
                      {new Date(msg.sentAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="py-2.5 px-4 text-muted-foreground">
                      {msg.deliveredAt
                        ? new Date(msg.deliveredAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "—"}
                    </td>
                    <td className="py-2.5 px-4 text-muted-foreground">
                      {msg.readAt
                        ? new Date(msg.readAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "—"}
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      <CtaButton
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedMessage(msg);
                        }}
                        className="h-7 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        Inspect
                      </CtaButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ── Inspection Modal (Matching CampaignAnalyticsSheet) ── */}
      <Dialog
        open={!!selectedMessage}
        onOpenChange={(open) => !open && setSelectedMessage(null)}
      >
        <DialogContent className="sm:max-w-md bg-white dark:bg-zinc-900 border-[#d2d5d9] dark:border-zinc-800 rounded-[8px]">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#25D366]" />
              Broadcast Dispatch Details
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Audit log and transmission receipt from Meta Cloud API
            </DialogDescription>
          </DialogHeader>

          {selectedMessage && (
            <div className="space-y-4 pt-2 text-xs">
              <div className="p-3.5 rounded-[6px] bg-muted/40 border border-border/50 space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Recipient Name</span>
                  <span className="font-semibold text-foreground">
                    {selectedMessage.recipientName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phone Number</span>
                  <span className="font-mono text-foreground">
                    {selectedMessage.recipientPhone}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Template Used</span>
                  <span className="font-mono font-medium text-emerald-600">
                    {selectedMessage.templateName}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Delivery Status</span>
                  <AdminStatusBadge
                    status={selectedMessage.status}
                    variant={
                      selectedMessage.status === "READ" ||
                      selectedMessage.status === "DELIVERED"
                        ? "success"
                        : selectedMessage.status === "FAILED"
                        ? "error"
                        : "info"
                    }
                  />
                </div>
              </div>

              {selectedMessage.failureReason && (
                <div className="p-3 rounded-[6px] bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs">
                  <p className="font-semibold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> Failure Reason:
                  </p>
                  <p className="mt-1">{selectedMessage.failureReason}</p>
                </div>
              )}

              {/* Delivery Receipt Timelines */}
              <div className="space-y-2 border-t border-border/50 pt-3">
                <p className="text-[10.5px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Timeline
                </p>
                <div className="space-y-1.5 text-foreground/80">
                  <div className="flex justify-between">
                    <span>Dispatched from Dashboard</span>
                    <span className="font-mono text-muted-foreground">
                      {new Date(selectedMessage.sentAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivered to Handset</span>
                    <span className="font-mono text-muted-foreground">
                      {selectedMessage.deliveredAt
                        ? new Date(selectedMessage.deliveredAt).toLocaleString()
                        : "Pending"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Read by Recipient</span>
                    <span className="font-mono text-muted-foreground">
                      {selectedMessage.readAt
                        ? new Date(selectedMessage.readAt).toLocaleString()
                        : "Unread"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-border/50 flex justify-end gap-2">
                <CtaButton
                  size="sm"
                  onClick={() => {
                    const name = selectedMessage.templateName;
                    setSelectedMessage(null);
                    router.push(
                      `/marketing/whatsapp/send?template=${encodeURIComponent(name)}`
                    );
                  }}
                  className="h-[30px] rounded-[4px] gap-1.5 text-[12px] font-semibold bg-[#303030] text-white hover:bg-[#202020] dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer shadow-2xs"
                >
                  <Send className="h-3.5 w-3.5" />
                  Resend Template
                </CtaButton>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
