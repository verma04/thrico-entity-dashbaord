"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  Plus,
  RefreshCw,
  Clock,
  Send,
  Eye,
  Copy,
  Check,
  LayoutGrid,
  List as ListIcon,
  Upload,
  MoreHorizontal,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WhatsAppTemplatePreview } from "./whatsapp-template-preview";
import { CheckTemplateStatusButton } from "./check-template-status-button";
import { CreateWhatsAppTemplateDialog } from "./create-whatsapp-template-dialog";
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
  DropdownMenuSeparator,
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
import {
  useGetWhatsAppConnections,
  useGetWhatsAppTemplates,
  useSyncWhatsAppTemplates,
  WhatsAppConnectionStatus,
  type WhatsAppTemplate,
} from "@/graphql/actions";
import { toast } from "sonner";
import { buildCsv, downloadCsv } from "@/lib/export-csv";

const TEMPLATE_STARTERS = [
  {
    name: "Event Reminder",
    description: "Pre-event alerts with date & RSVP link",
    type: "UTILITY",
    color: "#10b981",
    template: "event_reminder",
    defaultHeader: "Event Reminder",
    defaultBody: "Hi {{1}}, this is a friendly reminder that {{2}} starts at {{3}}. Click the link below to view details and join.",
    defaultButtonText: "View Event",
    defaultButtonUrl: "https://event.thrico.com",
  },
  {
    name: "Welcome Onboarding",
    description: "Greet new members with portal link",
    type: "MARKETING",
    color: "#4f46e5",
    template: "welcome_message",
    defaultHeader: "Welcome to our Community!",
    defaultBody: "Hi {{1}}, thank you for joining! Your member account has been activated. Explore your dashboard and connect with other members.",
    defaultButtonText: "Open Dashboard",
    defaultButtonUrl: "https://app.thrico.com",
  },
  {
    name: "Membership Updates",
    description: "Tier changes and membership benefits",
    type: "UTILITY",
    color: "#7c3aed",
    template: "membership_update",
    defaultHeader: "Membership Status Update",
    defaultBody: "Hi {{1}}, your membership tier has been updated to {{2}}. Enjoy your new member perks and benefits!",
    defaultButtonText: "Explore Perks",
    defaultButtonUrl: "https://app.thrico.com/membership",
  },
  {
    name: "Announcement Drop",
    description: "Broadcast platform updates & news",
    type: "MARKETING",
    color: "#d97706",
    template: "announcement_broadcast",
    defaultHeader: "Important Community Notice",
    defaultBody: "Hello {{1}}, we have an exciting update to share: {{2}}. Click the link below to read the full announcement.",
    defaultButtonText: "Read More",
    defaultButtonUrl: "https://thrico.com/news",
  },
] as const;

export interface WhatsAppTemplatesStudioProps {
  isCreateOpen?: boolean;
  onOpenCreateChange?: (open: boolean) => void;
}

export function WhatsAppTemplatesStudio({
  isCreateOpen: externalIsCreateOpen,
  onOpenCreateChange: externalOnOpenCreateChange,
}: WhatsAppTemplatesStudioProps = {}) {
  const router = useRouter();
  const { templates } = useWhatsAppStore();
  const { data: whatsappData } = useGetWhatsAppConnections();
  const { data: templatesData, refetch: refetchTemplates } = useGetWhatsAppTemplates();
  const [syncMetaTemplates, { loading: isSyncingMutation }] = useSyncWhatsAppTemplates();

  const templatesList = useMemo(() => {
    return templatesData?.getWhatsAppTemplates || templates;
  }, [templatesData, templates]);

  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedTemplate, setSelectedTemplate] =
    useState<WhatsAppTemplate | null>(null);
  const [internalIsCreateModalOpen, setInternalIsCreateModalOpen] = useState(false);

  const isCreateModalOpen =
    externalIsCreateOpen !== undefined
      ? externalIsCreateOpen
      : internalIsCreateModalOpen;

  const setIsCreateModalOpen = (open: boolean) => {
    setInternalIsCreateModalOpen(open);
    externalOnOpenCreateChange?.(open);
  };
  const [createInitialValues, setCreateInitialValues] = useState<{
    name?: string;
    category?: "UTILITY" | "MARKETING" | "AUTHENTICATION";
    headerText?: string;
    bodyText?: string;
    footerText?: string;
    buttonText?: string;
    buttonUrl?: string;
  } | undefined>(undefined);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredTemplates = useMemo(() => {
    return templatesList.filter((t) => {
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        t.name.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q);
      const matchesCat =
        categoryFilter === "ALL" || t.category === categoryFilter;
      const matchesStatus =
        statusFilter === "ALL" || t.status === statusFilter;
      return matchesSearch && matchesCat && matchesStatus;
    });
  }, [templatesList, search, categoryFilter, statusFilter]);

  const handleSync = async () => {
    const liveConn = whatsappData?.getWhatsAppConnections?.find(
      (c) => c.status === WhatsAppConnectionStatus.CONNECTED
    );
    if (!liveConn?.id) {
      toast.error("Please connect your WhatsApp number first in Settings > Integrations.");
      return;
    }
    try {
      await syncMetaTemplates({ variables: { connectionId: liveConn.id } });
      await refetchTemplates();
      toast.success("Meta Cloud API templates re-synced successfully!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to sync templates";
      toast.error(msg);
    }
  };

  const handleCopyName = (name: string) => {
    navigator.clipboard.writeText(name);
    setCopiedId(name);
    toast.success(`Template name "${name}" copied!`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportCsv = () => {
    const columns = [
      { header: "ID", getValue: (t: WhatsAppTemplate) => t.id },
      { header: "Template Name", getValue: (t: WhatsAppTemplate) => t.name },
      { header: "Category", getValue: (t: WhatsAppTemplate) => t.category },
      { header: "Status", getValue: (t: WhatsAppTemplate) => t.status },
      { header: "Language", getValue: (t: WhatsAppTemplate) => t.language },
      { header: "Last Synced", getValue: (t: WhatsAppTemplate) => t.lastSyncedAt || "Never" },
    ];
    const csv = buildCsv(filteredTemplates, columns);
    downloadCsv(csv, `whatsapp_templates_${Date.now()}.csv`);
    toast.success("Templates exported to CSV");
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* ── Start from a Template Row (Matching Email TemplateStarters) ── */}
      <div className="space-y-3 pb-2 border-b border-border/50">
        <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Start from a template
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {TEMPLATE_STARTERS.map((s) => {
            const existingTemplate = templatesList.find(
              (t) => t.name.toLowerCase() === s.template.toLowerCase() || t.category === s.type
            );
            return (
              <button
                key={s.name}
                type="button"
                onClick={() => {
                  if (existingTemplate) {
                    router.push(
                      `/marketing/whatsapp/send?template=${encodeURIComponent(existingTemplate.name)}`
                    );
                  } else {
                    setCreateInitialValues({
                      name: s.template,
                      category: s.type,
                      headerText: s.defaultHeader,
                      bodyText: s.defaultBody,
                      footerText: "Reply STOP to unsubscribe",
                      buttonText: s.defaultButtonText,
                      buttonUrl: s.defaultButtonUrl,
                    });
                    setIsCreateModalOpen(true);
                  }
                }}
              className="group flex items-center gap-3 p-3 rounded-xl border border-border bg-background hover:bg-muted/30 hover:border-border transition-all text-left cursor-pointer"
            >
              <div
                className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0"
                style={{
                  backgroundColor: s.color + "15",
                  border: `1px solid ${s.color}30`,
                }}
              >
                <FileText className="h-3.5 w-3.5" style={{ color: s.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-foreground truncate">
                  {s.name}
                </p>
                <p className="text-[10px] text-muted-foreground truncate">
                  {s.description}
                </p>
              </div>
              <ChevronRight className="h-3 w-3 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors shrink-0" />
            </button>
          );
        })}
        </div>
      </div>

      {/* ── Action / Filter Bar (Matching EcosystemActionBar in TemplateList) ── */}
      <EcosystemActionBar shadow="none" className="rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800">
        <EcosystemActionBar.Group className="flex-1 flex-wrap sm:flex-nowrap">
          <EcosystemActionBar.Item className="w-56 sm:w-64 shrink-0">
            <EcosystemActionBar.Search
              value={search}
              onChange={setSearch}
              placeholder="Search templates by name or category…"
            />
          </EcosystemActionBar.Item>

          <EcosystemActionBar.Separator />

          {/* Category Filter */}
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="h-[30px] w-[135px] shrink-0 rounded-[4px] border-[#aeb4b9] dark:border-zinc-700 shadow-2xs text-[12px] bg-white dark:bg-zinc-900 font-medium">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent align="start" className="rounded-[6px]">
              <SelectItem value="ALL" className="text-xs">All Categories</SelectItem>
              <SelectItem value="UTILITY" className="text-xs">Utility</SelectItem>
              <SelectItem value="MARKETING" className="text-xs">Marketing</SelectItem>
              <SelectItem value="AUTHENTICATION" className="text-xs">Authentication</SelectItem>
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-[30px] w-[130px] shrink-0 rounded-[4px] border-[#aeb4b9] dark:border-zinc-700 shadow-2xs text-[12px] bg-white dark:bg-zinc-900 font-medium">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent align="start" className="rounded-[6px]">
              <SelectItem value="ALL" className="text-xs">All Statuses</SelectItem>
              <SelectItem value="APPROVED" className="text-xs">Approved</SelectItem>
              <SelectItem value="PENDING" className="text-xs">Pending Review</SelectItem>
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
          <Button
            variant="outline"
            size="sm"
            onClick={handleSync}
            disabled={isSyncingMutation}
            className="h-[30px] gap-1.5 shrink-0 bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 shadow-2xs text-[12px] font-medium text-[#303030] dark:text-zinc-200 px-2.5 rounded-[4px] cursor-pointer"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 text-blue-500 ${isSyncingMutation ? "animate-spin" : ""}`}
            />
            <span>{isSyncingMutation ? "Syncing…" : "Sync Meta"}</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCsv}
            className="h-[30px] rounded-[4px] text-xs gap-1.5 font-medium border-[#aeb4b9] dark:border-zinc-700 shadow-2xs"
          >
            <Upload className="h-3.5 w-3.5" />
            Export CSV
          </Button>

          <Button
            size="sm"
            onClick={() => {
              setCreateInitialValues(undefined);
              setIsCreateModalOpen(true);
            }}
            className="h-[30px] rounded-[4px] gap-1.5 text-[12px] font-semibold bg-[#303030] text-white hover:bg-[#202020] dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer shadow-2xs"
          >
            <Plus className="h-3.5 w-3.5" />
            New Template
          </Button>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      {/* ── Content View: Grid vs Table ── */}
      {filteredTemplates.length === 0 ? (
        <Card className="border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-12 text-center rounded-[8px]">
          <FileText className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-foreground">No templates match filter</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Try adjusting your search criteria or sync from Meta Cloud API.
          </p>
        </Card>
      ) : view === "grid" ? (
        /* ── Grid View (Matching TemplateCard) ── */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredTemplates.map((template) => {
            const header = template.components?.find((c) => c.type === "HEADER");
            const body = template.components?.find((c) => c.type === "BODY");
            const footer = template.components?.find((c) => c.type === "FOOTER");
            const buttons = template.components?.find((c) => c.type === "BUTTONS");

            return (
              <Card
                key={template.id}
                className="group relative border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-2xs hover:border-[#aeb4b9] dark:hover:border-zinc-700 hover:shadow-xs transition-all duration-200 rounded-[8px] flex flex-col justify-between"
              >
                {/* Thumbnail Preview Area (Matching TemplateCard style) */}
                <div
                  className="relative bg-muted/20 border-b border-border/50 cursor-pointer overflow-hidden p-3"
                  style={{ minHeight: 140 }}
                  onClick={() => setSelectedTemplate(template)}
                >
                  {/* Fake browser / app chrome strip */}
                  <div className="flex items-center justify-between px-2 py-1 bg-muted/40 rounded-t-[4px] border-b border-border/50 mb-2">
                    <div className="flex items-center gap-1.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      <span className="text-[10px] font-mono text-muted-foreground">
                        {template.language.toUpperCase()}
                      </span>
                    </div>
                    <Badge
                      variant="outline"
                      className="text-[9px] px-1.5 py-0 font-medium border-border/60 bg-background"
                    >
                      {template.category}
                    </Badge>
                  </div>

                  {/* WhatsApp mini message balloon */}
                  <div className="rounded-[6px] p-2.5 bg-[#d9fdd3]/70 dark:bg-[#005c4b]/50 border border-emerald-500/20 text-xs space-y-1">
                    {header?.text && (
                      <p className="font-bold text-[11px] text-foreground truncate">
                        {header.text}
                      </p>
                    )}
                    {body?.text && (
                      <p className="text-[11px] leading-relaxed text-foreground/80 line-clamp-2">
                        {body.text}
                      </p>
                    )}
                    {footer?.text && (
                      <p className="text-[9.5px] text-muted-foreground italic pt-0.5 truncate">
                        {footer.text}
                      </p>
                    )}
                    {buttons?.buttons && buttons.buttons.length > 0 && (
                      <div className="pt-1 flex gap-1 overflow-hidden">
                        {buttons.buttons.slice(0, 2).map((btn, bIdx) => (
                          <span
                            key={bIdx}
                            className="bg-white/90 dark:bg-zinc-800 text-[9px] font-medium text-[#00a884] dark:text-[#25D366] px-1.5 py-0.5 rounded truncate"
                          >
                            {btn.text}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card footer (Matching TemplateCard) */}
                <div className="p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-xs font-semibold text-foreground truncate font-mono">
                          {template.name}
                        </h3>
                        <button
                          type="button"
                          onClick={() => handleCopyName(template.name)}
                          className="text-muted-foreground hover:text-foreground p-0.5"
                          title="Copy name"
                        >
                          {copiedId === template.name ? (
                            <Check className="w-3 h-3 text-emerald-500" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                      <p className="text-[10px] text-muted-foreground truncate">
                        Meta Cloud API • {template.category}
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      <AdminStatusBadge
                        status={template.status}
                        variant={template.status === "APPROVED" ? "success" : "warning"}
                        className="text-[9.5px] px-1.5 py-0"
                      />

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="h-6 w-6 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all shrink-0 cursor-pointer">
                            <MoreHorizontal className="h-3.5 w-3.5" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="min-w-[140px] rounded-[6px]">
                          <DropdownMenuItem
                            onClick={() => setSelectedTemplate(template)}
                            className="text-xs cursor-pointer"
                          >
                            <Eye className="h-3.5 w-3.5 mr-2 text-indigo-500" />
                            Preview
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              router.push(
                                `/marketing/whatsapp/send?template=${encodeURIComponent(template.name)}`
                              )
                            }
                            className="text-xs cursor-pointer"
                          >
                            <Send className="h-3.5 w-3.5 mr-2 text-emerald-500" />
                            Use in Broadcast
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleCopyName(template.name)}
                            className="text-xs cursor-pointer"
                          >
                            <Copy className="h-3.5 w-3.5 mr-2" />
                            Copy Name
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-1.5 mt-2 pt-2 border-t border-border/50 text-[10.5px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-2.5 w-2.5" />
                      {template.lastSyncedAt
                        ? `Synced ${new Date(template.lastSyncedAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}`
                        : "Not synced"}
                    </span>
                    <Button
                      size="sm"
                      onClick={() =>
                        router.push(
                          `/marketing/whatsapp/send?template=${encodeURIComponent(template.name)}`
                        )
                      }
                      className="h-6 text-[10.5px] px-2 rounded-[3px] bg-[#303030] text-white hover:bg-[#202020] dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer font-medium"
                    >
                      Use
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        /* ── Table View (Matching templateTableColumns) ── */
        <Card className="border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs rounded-[8px] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-muted/40 border-b border-border/60 text-muted-foreground text-left font-semibold text-[10.5px] uppercase tracking-wider">
                  <th className="py-2.5 px-4">Template Name</th>
                  <th className="py-2.5 px-4">Category / Type</th>
                  <th className="py-2.5 px-4">Language</th>
                  <th className="py-2.5 px-4">Status</th>
                  <th className="py-2.5 px-4">Last Synced</th>
                  <th className="py-2.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filteredTemplates.map((t) => (
                  <tr
                    key={t.id}
                    className="hover:bg-muted/40 transition-colors group cursor-pointer"
                    onClick={() => setSelectedTemplate(t)}
                  >
                    <td className="py-2.5 px-4 font-mono font-semibold text-foreground text-[12px]">
                      {t.name}
                    </td>
                    <td className="py-2.5 px-4">
                      <Badge
                        variant="secondary"
                        className="text-[10px] px-2 py-0 font-medium rounded-[3px]"
                      >
                        {t.category}
                      </Badge>
                    </td>
                    <td className="py-2.5 px-4 font-mono text-muted-foreground">
                      {t.language.toUpperCase()}
                    </td>
                    <td className="py-2.5 px-4">
                      <AdminStatusBadge
                        status={t.status}
                        variant={t.status === "APPROVED" ? "success" : "warning"}
                        className="text-[10px]"
                      />
                    </td>
                    <td className="py-2.5 px-4 text-muted-foreground">
                      {t.lastSyncedAt
                        ? new Date(t.lastSyncedAt).toLocaleString()
                        : "Never"}
                    </td>
                    <td className="py-2.5 px-4 text-right space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          setSelectedTemplate(t);
                        }}
                        className="h-7 text-xs text-muted-foreground hover:text-foreground"
                      >
                        Preview
                      </Button>
                      <Button
                        size="sm"
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          router.push(
                            `/marketing/whatsapp/send?template=${encodeURIComponent(t.name)}`
                          );
                        }}
                        className="h-7 text-xs rounded-[4px] font-semibold bg-[#303030] text-white hover:bg-[#202020] dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer shadow-2xs"
                      >
                        Use
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ── Template Preview Modal (Matching TemplatePreviewModal) ── */}
      <Dialog
        open={!!selectedTemplate}
        onOpenChange={(open) => !open && setSelectedTemplate(null)}
      >
        <DialogContent className="sm:max-w-md bg-white dark:bg-zinc-900 border-[#d2d5d9] dark:border-zinc-800 rounded-[8px]">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold flex items-center gap-2 font-mono">
              <FileText className="w-4 h-4 text-[#25D366]" />
              {selectedTemplate?.name}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Pre-approved Meta WhatsApp Cloud API template structure
            </DialogDescription>
          </DialogHeader>

          {selectedTemplate && (
            <div className="space-y-4 pt-2 text-xs">
              <div className="flex items-center justify-between text-xs p-2.5 rounded-[6px] bg-muted/40 border border-border/50">
                <span className="text-muted-foreground">Category & Language</span>
                <span className="font-semibold text-foreground">
                  {selectedTemplate.category} • {selectedTemplate.language.toUpperCase()}
                </span>
              </div>

              {/* WhatsApp Live Bubble Preview */}
              <div className="flex justify-center py-2">
                <WhatsAppTemplatePreview
                  components={selectedTemplate.components || []}
                  variables={(selectedTemplate.sampleParameters as Record<string, string>) || {}}
                />
              </div>

              <div className="pt-2 border-t border-border/50 flex items-center justify-between gap-2">
                <CheckTemplateStatusButton templateId={selectedTemplate.id} />
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedTemplate(null)}
                    className="h-[30px] rounded-[4px] text-xs border-[#aeb4b9] dark:border-zinc-700"
                  >
                    Close
                  </Button>
                  <Button
                    size="sm"
                    className="h-[30px] rounded-[4px] gap-1.5 text-[12px] font-semibold bg-[#303030] text-white hover:bg-[#202020] dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer shadow-2xs"
                    onClick={() => {
                      const name = selectedTemplate.name;
                      setSelectedTemplate(null);
                      router.push(
                        `/marketing/whatsapp/send?template=${encodeURIComponent(name)}`
                      );
                    }}
                  >
                    <Send className="w-3.5 h-3.5" />
                    Use in Broadcast
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* In-App WhatsApp Template Creator Dialog */}
      <CreateWhatsAppTemplateDialog
        open={isCreateModalOpen}
        onOpenChange={(open) => {
          setIsCreateModalOpen(open);
          if (!open) setCreateInitialValues(undefined);
        }}
        initialValues={createInitialValues}
        onSuccess={() => {
          refetchTemplates();
        }}
      />
    </div>
  );
}
