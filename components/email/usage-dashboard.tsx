"use client";

import React, { useState, useMemo } from "react";
import {
  RotateCcw,
  Plus,
  Upload,
  BarChart3,
  Mail,
  CreditCard,
  Activity,
  SlidersHorizontal,
  Info,
} from "lucide-react";
import { useSubscriptionStore } from "@/store/subscriptionStore";
import {
  useGetEmailOverview,
  useGetEmailLogs,
  useGetEmailTopupHistory,
  EmailLog,
} from "@/graphql/actions/email";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";
import { startOfDay, endOfDay, isWithinInterval } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ExportCsvModal, ExportCsvScope, ExportCsvFormat } from "@/components/shared/export-csv-modal";
import { buildCsv, downloadCsv } from "@/lib/export-csv";

import { UsageStats } from "./usage/usage-stats";
import { UsageChart } from "./usage/usage-chart";
import { UsageActivityTable } from "./usage/usage-activity-table";
import { UsageTopupTable } from "./usage/usage-topup-table";
import { UsageTopupModal } from "./usage/usage-topup-modal";

export default function UsageDashboard() {
  const [activeTab, setActiveTab] = useState<"logs" | "purchases" | "trends">("logs");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [showExportModal, setShowExportModal] = useState(false);
  const [topOpen, setTopOpen] = useState(false);

  const { setShowBuyPlanDialog } = useSubscriptionStore();

  const {
    data: overviewData,
    loading: overviewLoading,
    refetch: refetchOverview,
  } = useGetEmailOverview();

  const {
    data: logsData,
    loading: logsLoading,
    refetch: refetchLogs,
  } = useGetEmailLogs({ limit: 5000, offset: 0 });

  const {
    data: topupData,
    loading: topupLoading,
    refetch: refetchTopup,
  } = useGetEmailTopupHistory();

  const handleRefreshAll = () => {
    refetchOverview();
    refetchLogs();
    refetchTopup();
    toast.success("Usage metrics and transmission logs refreshed");
  };

  const usage = overviewData?.getEmailOverview?.usage || {
    emailsSent: 0,
    numberOfEmailsPerMonth: 10000,
    usagePercent: 0,
    remaining: 10000,
    periodEnd: "",
  };

  const daysUntilReset = usage.periodEnd
    ? Math.max(0, Math.ceil((new Date(usage.periodEnd).getTime() - Date.now()) / 86400000))
    : 30;

  const rawLogs: EmailLog[] = logsData?.getEmailLogs || [];
  const rawTopups = topupData?.getEmailTopupHistory || [];

  // Filter logs by search, status, and date range
  const filteredLogs = useMemo(() => {
    return rawLogs.filter((log) => {
      // 1. Search Query
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const toMatch = (log.to || "").toLowerCase().includes(q);
        const subjectMatch = (log.subject || "").toLowerCase().includes(q);
        const senderMatch = (log.senderAddress || "").toLowerCase().includes(q);
        const sesMatch = (log.sesMessageId || "").toLowerCase().includes(q);
        if (!toMatch && !subjectMatch && !senderMatch && !sesMatch) return false;
      }

      // 2. Status Filter
      if (statusFilter !== "ALL") {
        if ((log.status || "").toLowerCase() !== statusFilter.toLowerCase()) return false;
      }

      // 3. Date Range Filter
      if (dateRange?.from && log.sentAt) {
        const logDate = new Date(log.sentAt);
        const from = startOfDay(dateRange.from);
        const to = dateRange.to ? endOfDay(dateRange.to) : endOfDay(dateRange.from);
        if (!isWithinInterval(logDate, { start: from, end: to })) return false;
      }

      return true;
    });
  }, [rawLogs, search, statusFilter, dateRange]);

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      {/* ── Top Metric Cards ────────────────────────────────────────────── */}
      <UsageStats
        emailsSent={usage.emailsSent}
        monthlyQuota={usage.numberOfEmailsPerMonth}
        remaining={usage.remaining}
        daysToReset={daysUntilReset}
        loading={overviewLoading}
      />

      {/* ── Action / Filter Bar ─────────────────────────────────────────── */}
      <EcosystemActionBar shadow="none">
        <EcosystemActionBar.Group>
          <EcosystemActionBar.Item grow className="max-w-xs">
            <EcosystemActionBar.Search
              value={search}
              onChange={setSearch}
              placeholder="Search by recipient, subject, or SES ID…"
            />
          </EcosystemActionBar.Item>

          <EcosystemActionBar.Item>
            <DateRangePicker date={dateRange} onDateChange={setDateRange} />
          </EcosystemActionBar.Item>

          <EcosystemActionBar.Item>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-[30px] w-[130px] bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 text-[12px] font-medium rounded-[4px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="rounded-[6px]">
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="opened">Opened</SelectItem>
                <SelectItem value="clicked">Clicked</SelectItem>
                <SelectItem value="bounced">Bounced</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Separator />

        <EcosystemActionBar.Group align="right">
          <EcosystemActionBar.Item>
            <div className="flex items-center gap-1.5 px-1.5 py-0.5 rounded-[4px] bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10.5px] font-bold text-emerald-700 dark:text-emerald-400">
                Live Audit
              </span>
            </div>
          </EcosystemActionBar.Item>

          <Button
            variant="outline"
            size="icon"
            onClick={handleRefreshAll}
            className="h-[30px] w-[30px] border-[#aeb4b9] dark:border-zinc-700 rounded-[4px] text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <RotateCcw
              className={cn(
                "h-3.5 w-3.5",
                (overviewLoading || logsLoading || topupLoading) && "animate-spin"
              )}
            />
          </Button>

          <Button
            variant="outline"
            onClick={() => setShowExportModal(true)}
            className="h-[30px] gap-1.5 shrink-0 bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 shadow-2xs text-[12px] font-medium text-[#303030] dark:text-zinc-200 px-2.5 rounded-[4px] cursor-pointer"
          >
            <Upload className="h-3 w-3" />
            Export Logs
          </Button>

          <Button
            variant="outline"
            onClick={() => setShowBuyPlanDialog(true)}
            className="h-[30px] gap-1.5 shrink-0 bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 shadow-2xs text-[12px] font-medium text-[#303030] dark:text-zinc-200 px-2.5 rounded-[4px] cursor-pointer"
          >
            Upgrade Plan
          </Button>

          <Button
            onClick={() => setTopOpen(true)}
            className="h-[30px] gap-1.5 shrink-0 bg-[#303030] text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-2xs text-[12px] font-semibold px-2.5 rounded-[4px] cursor-pointer hover:bg-[#202020]"
          >
            <Plus className="h-3 w-3" />
            Top Up Credits
          </Button>

          <EcosystemActionBar.Separator />
          <EcosystemActionBar.Status active={filteredLogs.length > 0}>
            {filteredLogs.length} Events · {usage.remaining.toLocaleString()} Credits Left
          </EcosystemActionBar.Status>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      {/* ── Ecosystem Tabs & Views ───────────────────────────────────────── */}
      <div className="flex items-center gap-1.5 border-b border-border/60 pb-1">
        <button
          type="button"
          onClick={() => setActiveTab("logs")}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-[4px] text-[12px] font-bold transition-all cursor-pointer",
            activeTab === "logs"
              ? "bg-[#303030] text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-2xs"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
          )}
        >
          <Mail className="h-3.5 w-3.5" />
          Transmission Logs ({filteredLogs.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("purchases")}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-[4px] text-[12px] font-bold transition-all cursor-pointer",
            activeTab === "purchases"
              ? "bg-[#303030] text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-2xs"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
          )}
        >
          <CreditCard className="h-3.5 w-3.5" />
          Top-Up History ({rawTopups.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("trends")}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-[4px] text-[12px] font-bold transition-all cursor-pointer",
            activeTab === "trends"
              ? "bg-[#303030] text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-2xs"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
          )}
        >
          <Activity className="h-3.5 w-3.5" />
          Deliverability Trends
        </button>
      </div>

      {/* ── Content Area ─────────────────────────────────────────────────── */}
      <EcosystemContainer className="p-0 m-0 border-none bg-transparent shadow-none ring-0 space-y-4">
        {/* Info Callout Banner */}
        <div className="flex items-start gap-3 p-3 rounded-[6px] bg-muted/30 border border-border/60">
          <div className="h-6 w-6 rounded-[4px] bg-background flex items-center justify-center shadow-2xs shrink-0 border border-border/60 text-muted-foreground">
            <Info className="h-3.5 w-3.5" />
          </div>
          <p className="text-[11.5px] text-muted-foreground leading-relaxed">
            This live audit trail monitors all outbound email dispatches across transactional notices, manual broadcasts, and automation triggers. Search or filter by date range to inspect delivery statuses and SES message fingerprints.
          </p>
        </div>

        {/* Tab 1: Transmission Activity Table */}
        {activeTab === "logs" && (
          <UsageActivityTable logs={filteredLogs} isLoading={logsLoading} />
        )}

        {/* Tab 2: Top-Up History Table */}
        {activeTab === "purchases" && (
          <UsageTopupTable history={rawTopups} isLoading={topupLoading} />
        )}

        {/* Tab 3: Deliverability Chart */}
        {activeTab === "trends" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <UsageChart />
            </div>
            <div className="space-y-4">
              <div className="p-5 rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-[4px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-100 dark:border-emerald-900/40">
                    <Activity className="h-3.5 w-3.5" />
                  </div>
                  <h4 className="text-[13px] font-bold text-foreground">
                    Sender Reputation Status
                  </h4>
                </div>
                <p className="text-[11.5px] text-muted-foreground leading-relaxed">
                  Your current bounce rate and complaint rates are well within the standard 0.05% threshold. Amazon SES high-throughput sending active.
                </p>
                <div className="pt-2 border-t border-border/40 flex justify-between items-center text-[11px] font-semibold">
                  <span className="text-muted-foreground">Reputation Score</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">99.8% Healthy</span>
                </div>
              </div>

              <div className="p-5 rounded-[8px] border border-dashed border-[#d2d5d9] dark:border-zinc-800 bg-muted/20 text-center space-y-2">
                <p className="text-[12px] font-bold text-foreground uppercase tracking-wider">
                  Need Dedicated IP Pool?
                </p>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Upgrade to Enterprise for dedicated sending IPs, automated warmup cycles, and custom DKIM keys.
                </p>
                <Button
                  size="sm"
                  onClick={() => setShowBuyPlanDialog(true)}
                  className="mt-2 h-7 text-[11px] font-bold bg-[#303030] text-white hover:bg-[#202020] dark:bg-zinc-100 dark:text-zinc-900 rounded-[4px] cursor-pointer"
                >
                  View Enterprise Plans
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ── Topup Modal ───────────────────────────────────────────────── */}
        {topOpen && (
          <UsageTopupModal
            onClose={() => {
              setTopOpen(false);
              refetchOverview();
              refetchTopup();
            }}
            usage={usage}
          />
        )}

        {/* ── Export CSV Modal ───────────────────────────────────────────── */}
        <ExportCsvModal
          open={showExportModal}
          onOpenChange={setShowExportModal}
          entityName="transmission logs"
          description="Export all transmission logs, recipient emails, statuses, and SES message IDs as CSV. Active search and date filters are applied to the export."
          totalCount={rawLogs.length}
          matchingCount={(search.trim() || statusFilter !== "ALL" || dateRange) ? filteredLogs.length : undefined}
          onExport={(scope: ExportCsvScope, format: ExportCsvFormat) => {
            const rows = scope === "matching" ? filteredLogs : rawLogs;

            if (rows.length === 0) {
              toast.error("Nothing to export", {
                description: "No transmission logs match your criteria.",
              });
              return;
            }

            const csv = buildCsv(rows, [
              { header: "Recipient Email", getValue: (l) => l.to || "" },
              { header: "Subject",         getValue: (l) => l.subject || "" },
              { header: "Status",          getValue: (l) => l.status || "SENT" },
              { header: "Sender Address",  getValue: (l) => l.senderAddress || "" },
              { header: "SES Message ID",  getValue: (l) => l.sesMessageId || "" },
              { header: "Dispatched Date", getValue: (l) => (l.sentAt ? new Date(l.sentAt).toISOString().slice(0, 10) : "") },
              { header: "Dispatched Time", getValue: (l) => (l.sentAt ? new Date(l.sentAt).toLocaleTimeString() : "") },
            ]);

            const label = scope === "matching" ? "email-logs-filtered" : "email-logs";
            downloadCsv(csv, `${label}-${new Date().toISOString().slice(0, 10)}`, format);

            toast.success("Export ready", {
              description: `${rows.length} transmission entr${rows.length !== 1 ? "ies" : "y"} exported successfully.`,
            });
          }}
        />
      </EcosystemContainer>
    </div>
  );
}
