"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useQuery, useMutation } from "@apollo/client";
import { useDebounce } from "use-debounce";
import {
  GitBranch,
  Plus,
  Settings2,
  Trash2,
  ChevronRight,
  Zap,
  ArrowRight,
  Layers,
  TrendingUp,
  Users,
  Mail,
  Play,
  Circle,
  Repeat,
  LayoutGrid,
  List as ListIcon,
  SlidersHorizontal,
  Upload,
  Calendar,
  Clock,
  Sparkles,
  School,
  Building,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  MoreHorizontal,
  Pencil,
  FileText,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MODULE_COLORS } from "./types";
import {
  GET_AUTOMATION_CAMPAIGNS,
  GET_AUTOMATION_JOB_LOGS,
} from "@/graphql/automation/queries";
import { useGetEntity } from "@/graphql/actions";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { ExportCsvModal } from "@/components/shared/export-csv-modal";
import { buildCsv, downloadCsv } from "@/lib/export-csv";

interface CampaignsListProps {
  onCreate?: () => void;
}

const STATUS_STYLE: Record<
  string,
  {
    pill: string;
    dot: string;
    label: string;
    accent: string;
    cardBorder: string;
  }
> = {
  active: {
    pill: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200",
    dot: "bg-emerald-500",
    label: "Active",
    accent: "bg-emerald-500",
    cardBorder: "border-emerald-200 hover:border-emerald-300",
  },
  draft: {
    pill: "bg-muted text-muted-foreground border-border",
    dot: "bg-muted-foreground",
    label: "Draft",
    accent: "bg-slate-300",
    cardBorder: "border-border hover:border-border",
  },
  inactive: {
    pill: "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200",
    dot: "bg-blue-400",
    label: "Inactive",
    accent: "bg-blue-300",
    cardBorder: "border-blue-200 hover:border-blue-300",
  },
  paused: {
    pill: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200",
    dot: "bg-amber-400",
    label: "Paused",
    accent: "bg-amber-400",
    cardBorder: "border-amber-200 hover:border-amber-300",
  },
};

const EMAIL_RECIPES = [
  {
    title: "New Member Welcome Series",
    category: "Communities",
    description: "Delivers an engaging welcome message and onboarding perks when a user joins.",
    module: "Communities",
    icon: Sparkles,
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    title: "Member Birthday Celebrations 🎂",
    category: "Gamification",
    description: "Automatically dispatches a personalized birthday greeting and milestone reward.",
    module: "Users",
    icon: Zap,
    gradient: "from-pink-500 to-rose-600",
  },
  {
    title: "Job Application Alert & Match",
    category: "Jobs",
    description: "Notifies recruiters and applicants immediately when candidates apply to listings.",
    module: "Jobs",
    icon: Mail,
    gradient: "from-amber-500 to-orange-600",
  },
  {
    title: "30-Day Inactive Win-Back",
    category: "Marketing",
    description: "Nudges members who haven't logged in with curated community highlights.",
    module: "Users",
    icon: Users,
    gradient: "from-purple-500 to-violet-600",
  },
];

export const campaignTableColumns = [
  { key: "campaign", header: "Campaign & Module" },
  { key: "frequency", header: "Frequency & Schedule" },
  { key: "status", header: "Status" },
  { key: "channel", header: "Channel" },
  { key: "updatedAt", header: "Last Modified" },
];

export function CampaignsList({ onCreate }: CampaignsListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === "" || value === "grid" || value === "ALL") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, pathname, router]
  );

  const view = (searchParams.get("view") as "grid" | "list") || "grid";
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [selectedModule, setSelectedModule] = useState(searchParams.get("module") || "ALL");
  const [selectedStatus, setSelectedStatus] = useState(searchParams.get("status") || "ALL");
  const [debouncedSearch] = useDebounce(search, 400);

  useEffect(() => {
    const currentQ = searchParams.get("q") || "";
    if (debouncedSearch.trim() !== currentQ) {
      updateParams({ q: debouncedSearch.trim() || null });
    }
  }, [debouncedSearch, searchParams, updateParams]);

  const setView = (v: "grid" | "list") =>
    updateParams({ view: v === "grid" ? null : v });

  const { data: entityData } = useGetEntity();
  const entityId = entityData?.getEntity?.id;

  const { data, loading, refetch } = useQuery(GET_AUTOMATION_CAMPAIGNS, {
    variables: { entityId },
    skip: !entityId,
  });
  const campaigns: any[] = data?.getAutomationCampaigns || [];

  const [logsOpenFor, setLogsOpenFor] = useState<string | null>(null);
  const [campaignToDelete, setCampaignToDelete] = useState<string | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);

  const { data: logsData, loading: logsLoading } = useQuery(GET_AUTOMATION_JOB_LOGS, {
    variables: { jobId: logsOpenFor },
    skip: !logsOpenFor,
  });

  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    campaign: true,
    frequency: true,
    status: true,
    channel: true,
    updatedAt: true,
  });

  const toggleColumn = (key: string) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((c) => {
      const q = debouncedSearch.toLowerCase().trim();
      const matchSearch =
        !q ||
        c.name?.toLowerCase().includes(q) ||
        c.module?.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q);

      const matchModule =
        selectedModule === "ALL" ||
        c.module?.toLowerCase() === selectedModule.toLowerCase();

      const matchStatus =
        selectedStatus === "ALL" ||
        c.status?.toLowerCase() === selectedStatus.toLowerCase();

      return matchSearch && matchModule && matchStatus;
    });
  }, [campaigns, debouncedSearch, selectedModule, selectedStatus]);

  const handleNew = () => router.push("/email/automation/add");
  const handleEdit = (id: string) => router.push(`/email/automation/edit/${id}`);

  return (
    <div className="space-y-4">
      {/* ── Action / Filter Bar ─────────────────────────────────────────── */}
      <EcosystemActionBar shadow="none">
        <EcosystemActionBar.Group>
          <EcosystemActionBar.Item grow className="max-w-xs">
            <EcosystemActionBar.Search
              value={search}
              onChange={setSearch}
              placeholder="Search campaigns by name or trigger…"
            />
          </EcosystemActionBar.Item>

          <Select
            value={selectedModule}
            onValueChange={(val) => {
              setSelectedModule(val);
              updateParams({ module: val === "ALL" ? null : val });
            }}
          >
            <SelectTrigger className="h-[30px] w-[130px] bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 text-[12px] font-medium rounded-[4px]">
              <SelectValue placeholder="Module" />
            </SelectTrigger>
            <SelectContent className="rounded-[6px]">
              <SelectItem value="ALL">All Modules</SelectItem>
              <SelectItem value="Communities">Communities</SelectItem>
              <SelectItem value="Jobs">Jobs</SelectItem>
              <SelectItem value="Events">Events</SelectItem>
              <SelectItem value="Shop">Shop</SelectItem>
              <SelectItem value="Users">Users</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={selectedStatus}
            onValueChange={(val) => {
              setSelectedStatus(val);
              updateParams({ status: val === "ALL" ? null : val });
            }}
          >
            <SelectTrigger className="h-[30px] w-[120px] bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 text-[12px] font-medium rounded-[4px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="rounded-[6px]">
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
            </SelectContent>
          </Select>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Separator />

        <EcosystemActionBar.Group align="right">
          {view === "list" && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="h-[30px] gap-1.5 shrink-0 bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 shadow-2xs text-[12px] font-medium text-[#303030] dark:text-zinc-200 px-2.5 rounded-[4px] cursor-pointer"
                >
                  <SlidersHorizontal className="h-3 w-3" />
                  Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[180px] rounded-[6px]">
                <DropdownMenuLabel className="text-[10px] font-bold text-[#616161] uppercase tracking-wider px-2 py-1.5">
                  Toggle Columns
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {campaignTableColumns.map((col) => (
                  <DropdownMenuCheckboxItem
                    key={col.key}
                    checked={visibleColumns[col.key] !== false}
                    onCheckedChange={() => toggleColumn(col.key)}
                    className="text-[12px] font-medium cursor-pointer"
                  >
                    {col.header}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <Button
            variant="outline"
            onClick={() => setShowExportModal(true)}
            className="h-[30px] gap-1.5 shrink-0 bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 shadow-2xs text-[12px] font-medium text-[#303030] dark:text-zinc-200 px-2.5 rounded-[4px] cursor-pointer"
          >
            <Upload className="h-3 w-3" />
            Export
          </Button>

          <Button
            onClick={handleNew}
            className="h-[30px] gap-1.5 shrink-0 bg-[#303030] text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-2xs text-[12px] font-semibold px-2.5 rounded-[4px] cursor-pointer hover:bg-[#202020]"
          >
            <Plus className="h-3 w-3" />
            Create Campaign
          </Button>

          <EcosystemActionBar.ViewToggle
            value={view}
            onChange={(v) => setView(v as "grid" | "list")}
            options={[
              { id: "grid", label: "Grid", icon: LayoutGrid },
              { id: "list", label: "List", icon: ListIcon },
            ]}
          />
          <EcosystemActionBar.Separator />
          <EcosystemActionBar.Status active={filteredCampaigns.length > 0}>
            Showing {filteredCampaigns.length} of {campaigns.length} Automations
          </EcosystemActionBar.Status>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      {/* ── Starter Recipes Carousel ── */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
          <span className="text-[11.5px] font-bold text-foreground uppercase tracking-wider">
            Curated Campaign Recipes
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {EMAIL_RECIPES.map((recipe, idx) => {
            const Icon = recipe.icon;
            return (
              <button
                key={idx}
                type="button"
                onClick={handleNew}
                className="group flex flex-col justify-between p-3.5 rounded-xl border border-border/60 bg-card hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-2xs transition-all text-left cursor-pointer"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className={cn("h-7 w-7 rounded-lg bg-gradient-to-br flex items-center justify-center text-white shrink-0 shadow-xs", recipe.gradient)}>
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <Badge variant="secondary" className="text-[9px] px-1.5 py-0 font-semibold rounded-[3px]">
                      {recipe.category}
                    </Badge>
                  </div>
                  <p className="text-[12px] font-bold text-foreground group-hover:text-indigo-600 transition-colors">
                    {recipe.title}
                  </p>
                  <p className="text-[10.5px] text-muted-foreground leading-snug line-clamp-2">
                    {recipe.description}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-[10.5px] font-semibold text-indigo-600 dark:text-indigo-400 pt-3 border-t border-border/40 mt-3">
                  <span>Use Recipe</span>
                  <ArrowRight className="h-3 w-3" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Content Container ── */}
      <EcosystemContainer className="p-0 m-0 border-none bg-transparent shadow-none ring-0 space-y-4">
        {loading ? (
          <div className="h-60 flex items-center justify-center">
            <Clock className="h-5 w-5 text-muted-foreground animate-spin" />
          </div>
        ) : filteredCampaigns.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 bg-white dark:bg-zinc-900 rounded-[8px] border border-dashed border-[#d2d5d9] dark:border-zinc-800 text-center space-y-2.5">
            <div className="w-10 h-10 rounded-[6px] bg-[#f6f6f7] dark:bg-zinc-800 flex items-center justify-center text-[#616161]">
              <Zap className="h-5 w-5" />
            </div>
            <div className="space-y-0.5">
              <h3 className="text-[13px] font-bold text-[#303030] dark:text-zinc-100">
                {search ? "No matching automations found" : "No campaign automations created yet"}
              </h3>
              <p className="text-[11.5px] text-[#616161] dark:text-zinc-400 max-w-sm">
                {search
                  ? "Try clearing your filters or search keywords."
                  : "Build your first automated trigger to send dynamic emails when members join, earn badges, or take platform actions."}
              </p>
            </div>
            {!search && (
              <Button
                type="button"
                onClick={handleNew}
                className="h-[30px] px-3 text-[12px] font-semibold gap-1.5 mt-1 bg-[#303030] text-white rounded-[4px] cursor-pointer"
              >
                <Plus className="h-3 w-3" />
                Create First Automation
              </Button>
            )}
          </div>
        ) : view === "grid" ? (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredCampaigns.map((c) => {
              const status = STATUS_STYLE[c.status] || STATUS_STYLE.draft;
              return (
                <div
                  key={c.id}
                  className="group rounded-xl border border-border/60 bg-card p-4 hover:border-border hover:shadow-2xs transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <Badge
                        variant="secondary"
                        className="text-[9.5px] px-2 py-0.5 rounded-[4px] font-bold text-foreground bg-muted"
                      >
                        {c.module || "General"}
                      </Badge>
                      <span className={cn("text-[9.5px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1", status.pill)}>
                        <span className={cn("h-1.5 w-1.5 rounded-full", status.dot)} />
                        {status.label}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-[13px] font-bold text-foreground group-hover:text-indigo-600 transition-colors">
                        {c.name}
                      </h4>
                      <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">
                        {c.description || "No description provided."}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border/50 flex items-center justify-between text-[11px] text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Repeat className="h-3.5 w-3.5 text-indigo-500" />
                      <span className="capitalize">{c.frequency || "One-time"}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(c.id)}
                        className="h-7 text-[11px] font-semibold rounded-[4px] border-border"
                      >
                        <Pencil className="h-3 w-3 mr-1" /> Edit Workflow
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* List View (Table) */
          <div className="rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900/60 overflow-hidden shadow-2xs">
            <Table>
              <TableHeader className="bg-[#f6f6f7]/50 dark:bg-zinc-900/50 border-b border-[#e1e3e5] dark:border-zinc-800">
                <TableRow className="hover:bg-transparent">
                  {visibleColumns.campaign && (
                    <TableHead className="text-[11px] font-bold uppercase tracking-wider text-[#616161] py-2.5">
                      Campaign & Module
                    </TableHead>
                  )}
                  {visibleColumns.frequency && (
                    <TableHead className="text-[11px] font-bold uppercase tracking-wider text-[#616161] py-2.5">
                      Frequency
                    </TableHead>
                  )}
                  {visibleColumns.status && (
                    <TableHead className="text-[11px] font-bold uppercase tracking-wider text-[#616161] py-2.5">
                      Status
                    </TableHead>
                  )}
                  {visibleColumns.channel && (
                    <TableHead className="text-[11px] font-bold uppercase tracking-wider text-[#616161] py-2.5">
                      Channel
                    </TableHead>
                  )}
                  {visibleColumns.updatedAt && (
                    <TableHead className="text-[11px] font-bold uppercase tracking-wider text-[#616161] py-2.5">
                      Last Modified
                    </TableHead>
                  )}
                  <TableHead className="text-right text-[11px] font-bold uppercase tracking-wider text-[#616161] py-2.5">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-[#e1e3e5] dark:divide-zinc-800/60">
                {filteredCampaigns.map((c) => {
                  const status = STATUS_STYLE[c.status] || STATUS_STYLE.draft;
                  return (
                    <TableRow key={c.id} className="hover:bg-[#f6f6f7]/50 dark:hover:bg-zinc-800/30 transition-colors">
                      {visibleColumns.campaign && (
                        <TableCell className="py-2.5">
                          <div className="flex items-center gap-2.5">
                            <div className="h-8 w-8 rounded-[4px] bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-100 dark:border-purple-900/40 shrink-0">
                              <Zap className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-[12.5px] font-semibold text-foreground truncate max-w-[260px]">
                                {c.name}
                              </p>
                              <Badge variant="secondary" className="text-[9px] px-1.5 py-0 rounded-[3px] mt-0.5">
                                {c.module || "General"}
                              </Badge>
                            </div>
                          </div>
                        </TableCell>
                      )}
                      {visibleColumns.frequency && (
                        <TableCell className="py-2.5 text-[11.5px] text-[#616161] dark:text-zinc-400 font-medium capitalize">
                          {c.frequency || "One-time"}
                        </TableCell>
                      )}
                      {visibleColumns.status && (
                        <TableCell className="py-2.5">
                          <span className={cn("text-[9.5px] font-bold px-2 py-0.5 rounded-full border inline-flex items-center gap-1", status.pill)}>
                            <span className={cn("h-1.5 w-1.5 rounded-full", status.dot)} />
                            {status.label}
                          </span>
                        </TableCell>
                      )}
                      {visibleColumns.channel && (
                        <TableCell className="py-2.5">
                          <Badge variant="outline" className="text-[9.5px] font-semibold rounded-[3px]">
                            {c.channelType || "Email"}
                          </Badge>
                        </TableCell>
                      )}
                      {visibleColumns.updatedAt && (
                        <TableCell className="py-2.5 text-[11.5px] text-[#616161] dark:text-zinc-400 font-medium">
                          {c.updatedAt ? new Date(c.updatedAt).toLocaleDateString() : "Recent"}
                        </TableCell>
                      )}
                      <TableCell className="py-2.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(c.id)}
                            className="h-[28px] text-[11.5px] font-semibold border-[#aeb4b9] dark:border-zinc-700 rounded-[4px] cursor-pointer"
                          >
                            <Pencil className="h-3 w-3 mr-1" /> Edit
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setLogsOpenFor(c.id)}
                            className="h-[28px] text-[11.5px] font-semibold text-muted-foreground rounded-[4px] cursor-pointer"
                          >
                            <FileText className="h-3 w-3 mr-1" /> Logs
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Job Execution Logs Dialog */}
        <Dialog open={!!logsOpenFor} onOpenChange={(open) => !open && setLogsOpenFor(null)}>
          <DialogContent className="max-w-xl rounded-2xl border border-border bg-card">
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-foreground flex items-center gap-2">
                <Clock className="h-4 w-4 text-indigo-500" />
                Execution History & Logs
              </DialogTitle>
            </DialogHeader>
            <ScrollArea className="max-h-[350px] pr-4">
              {logsLoading ? (
                <div className="py-12 flex justify-center">
                  <Clock className="h-5 w-5 text-muted-foreground animate-spin" />
                </div>
              ) : logsData?.getAutomationJobLogs?.length > 0 ? (
                <div className="space-y-2">
                  {logsData.getAutomationJobLogs.map((log: any, idx: number) => (
                    <div key={idx} className="p-3 rounded-xl border border-border bg-muted/20 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-semibold text-foreground">{log.jobName || "Trigger executed"}</p>
                        <p className="text-[10px] text-muted-foreground">{new Date(log.createdAt).toLocaleString()}</p>
                      </div>
                      <Badge variant="outline" className="text-[9.5px]">
                        {log.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-10 text-center text-xs text-muted-foreground">
                  No execution logs recorded yet.
                </div>
              )}
            </ScrollArea>
          </DialogContent>
        </Dialog>

        {/* Export CSV Modal */}
        <ExportCsvModal
          open={showExportModal}
          onOpenChange={setShowExportModal}
          entityName="email automations"
          description="Export all configured email automation workflows and triggers as CSV."
          totalCount={campaigns.length}
          onExport={(_scope, format) => {
            if (campaigns.length === 0) {
              toast.error("Nothing to export", {
                description: "No automations created yet.",
              });
              return;
            }
            const csv = buildCsv(campaigns, [
              { header: "Name", getValue: (c) => c.name || "" },
              { header: "Module", getValue: (c) => c.module || "" },
              { header: "Status", getValue: (c) => c.status || "" },
              { header: "Frequency", getValue: (c) => c.frequency || "" },
              { header: "Channel", getValue: (c) => c.channelType || "" },
            ]);
            downloadCsv(
              csv,
              `email-automations-${new Date().toISOString().slice(0, 10)}`,
              format
            );
            toast.success("Export ready", {
              description: `${campaigns.length} automations exported.`,
            });
          }}
        />
      </EcosystemContainer>
    </div>
  );
}
