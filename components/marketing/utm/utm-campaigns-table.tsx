"use client";

import React, { useState } from "react";
import {
  Link2,
  Copy,
  Check,
  BarChart3,
  QrCode,
  MoreHorizontal,
  Trash2,
  ExternalLink,
  PauseCircle,
  PlayCircle,
  Archive,
  Globe,
  Share2,
  Edit3,
  Info,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import { safeFormat } from "@/lib/date-utils";
import { toast } from "sonner";
import { UtmCampaignItem, UtmCampaignStatus } from "@/types/utm";

interface UtmCampaignsTableProps {
  campaigns: UtmCampaignItem[];
  loading?: boolean;
  viewMode?: "table" | "grid";
  onSelect360: (campaignSlug: string) => void;
  onOpenQr: (campaign: UtmCampaignItem) => void;
  onInspectCampaign?: (campaign: UtmCampaignItem) => void;
  onEditCampaign?: (campaign: UtmCampaignItem) => void;
  onToggleStatus: (campaign: UtmCampaignItem, nextStatus: UtmCampaignStatus) => void;
  onDeleteCampaign: (id: string) => void;
}

export function UtmCampaignsTable({
  campaigns,
  loading,
  viewMode = "table",
  onSelect360,
  onOpenQr,
  onInspectCampaign,
  onEditCampaign,
  onToggleStatus,
  onDeleteCampaign,
}: UtmCampaignsTableProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyLink = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.success("Tracking link copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getDestinationBadge = (type: string) => {
    switch (type) {
      case "SIGNUP":
        return (
          <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800">
            SIGNUP FUNNEL
          </span>
        );
      case "LOGIN":
        return (
          <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800">
            LOGIN FUNNEL
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-semibold rounded-full bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800">
            CUSTOM URL
          </span>
        );
    }
  };

  const getStatusBadge = (status: UtmCampaignStatus, item: UtmCampaignItem) => {
    const isActive = status === "ACTIVE";
    const isPaused = status === "PAUSED";
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-semibold rounded-full transition-all cursor-pointer ${
              isActive
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
                : isPaused
                ? "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800"
                : "bg-zinc-100 text-zinc-600 border border-zinc-200 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isActive
                  ? "bg-emerald-500 animate-pulse"
                  : isPaused
                  ? "bg-amber-500"
                  : "bg-zinc-400"
              }`}
            />
            {status}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-36 text-xs">
          <DropdownMenuItem onClick={() => onToggleStatus(item, "ACTIVE")}>
            <PlayCircle className="h-3.5 w-3.5 mr-2 text-emerald-600" />
            Active
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onToggleStatus(item, "PAUSED")}>
            <PauseCircle className="h-3.5 w-3.5 mr-2 text-amber-600" />
            Paused
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onToggleStatus(item, "ARCHIVED")}>
            <Archive className="h-3.5 w-3.5 mr-2 text-zinc-500" />
            Archived
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-border/60 shadow-2xs p-12 text-center space-y-3">
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
          <span>Loading UTM campaigns & attribution telemetry…</span>
        </div>
      </div>
    );
  }

  if (campaigns.length === 0) {
    return (
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-border/60 shadow-2xs p-12 text-center space-y-3">
        <div className="h-10 w-10 mx-auto rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/40">
          <Link2 className="h-5 w-5" />
        </div>
        <h3 className="text-sm font-bold text-foreground">No UTM Campaigns Found</h3>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          Create your first tagged tracking URL to monitor conversions and signup page attribution.
        </p>
      </div>
    );
  }

  // ── Grid View ─────────────────────────────────────────────────────────────
  if (viewMode === "grid") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {campaigns.map((c) => (
          <Card
            key={c.id}
            className="border-border/60 bg-card shadow-2xs hover:border-indigo-300 dark:hover:border-indigo-700 transition-all flex flex-col justify-between"
          >
            <CardContent className="p-4 space-y-3.5">
              <div className="flex items-start justify-between gap-2">
                <div
                  className="space-y-1 min-w-0 cursor-pointer"
                  onClick={() => onInspectCampaign?.(c)}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm text-foreground truncate hover:text-indigo-600 transition-colors">
                      {c.name}
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-muted-foreground flex items-center gap-1">
                    <span>tag:</span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-semibold truncate">
                      {c.utmCampaign}
                    </span>
                  </div>
                </div>
                {getStatusBadge(c.status, c)}
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {getDestinationBadge(c.destinationType)}
                <Badge variant="outline" className="text-[10px] font-mono">
                  {c.utmSource} / {c.utmMedium}
                </Badge>
              </div>

              {/* URL Preview Box */}
              <div className="p-2.5 rounded-lg bg-muted/40 border border-border/60 flex items-center justify-between gap-2">
                <span className="truncate text-[11px] font-mono text-muted-foreground">
                  {c.generatedUrl}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleCopyLink(c.generatedUrl, c.id)}
                  className="h-6 w-6 shrink-0 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  {copiedId === c.id ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                </Button>
              </div>

              <div className="pt-2 border-t border-border/40 flex items-center justify-between text-xs">
                <span className="text-[10.5px] text-muted-foreground">
                  {safeFormat(c.createdAt, "MMM d, yyyy")}
                </span>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onInspectCampaign?.(c)}
                    className="h-7 w-7 text-muted-foreground hover:text-foreground cursor-pointer"
                    title="Inspect Campaign Details"
                  >
                    <Info className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onOpenQr(c)}
                    className="h-7 w-7 text-muted-foreground hover:text-foreground cursor-pointer"
                    title="QR Code & Short Link"
                  >
                    <QrCode className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => onSelect360(c.utmCampaign)}
                    className="h-7 text-xs gap-1 font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-300 cursor-pointer"
                  >
                    <BarChart3 className="h-3 w-3" />
                    360 Stats →
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        <MoreHorizontal className="h-3.5 w-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44 text-xs">
                      <DropdownMenuItem onClick={() => onInspectCampaign?.(c)}>
                        <Info className="h-3.5 w-3.5 mr-2" />
                        Inspect Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEditCampaign?.(c)}>
                        <Edit3 className="h-3.5 w-3.5 mr-2" />
                        Edit Campaign
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleCopyLink(c.generatedUrl, c.id)}>
                        <Copy className="h-3.5 w-3.5 mr-2" />
                        Copy URL
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => window.open(c.generatedUrl, "_blank")}>
                        <ExternalLink className="h-3.5 w-3.5 mr-2" />
                        Test Link
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onDeleteCampaign(c.id)}
                        className="text-rose-600 dark:text-rose-400 focus:text-rose-600"
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-2" />
                        Delete Campaign
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // ── Table View ────────────────────────────────────────────────────────────
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-border/60 shadow-2xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-foreground">
          <thead className="bg-muted/40 text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border/60">
            <tr>
              <th className="px-5 py-3.5 font-bold">Campaign Name & Tag</th>
              <th className="px-5 py-3.5 font-bold">Destination</th>
              <th className="px-5 py-3.5 font-bold">Source / Medium</th>
              <th className="px-5 py-3.5 font-bold">Tracking URL</th>
              <th className="px-5 py-3.5 font-bold">Status</th>
              <th className="px-5 py-3.5 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {campaigns.map((c) => (
              <tr
                key={c.id}
                className="hover:bg-muted/20 transition-colors group"
              >
                {/* Campaign Name */}
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/40 shrink-0">
                      <Link2 className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <div
                        onClick={() => onInspectCampaign?.(c)}
                        className="font-bold text-xs text-foreground group-hover:text-indigo-600 transition-colors truncate max-w-[220px] cursor-pointer"
                        title={c.name}
                      >
                        {c.name}
                      </div>
                      <div className="text-[10.5px] font-mono text-muted-foreground flex items-center gap-1">
                        <span>tag:</span>
                        <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{c.utmCampaign}</span>
                      </div>
                    </div>
                  </div>
                </td>

                {/* Destination Type */}
                <td className="px-5 py-3.5 whitespace-nowrap">
                  {getDestinationBadge(c.destinationType)}
                </td>

                {/* Source & Medium */}
                <td className="px-5 py-3.5 whitespace-nowrap">
                  <div className="font-mono text-xs text-foreground">
                    {c.utmSource} / {c.utmMedium}
                  </div>
                  {c.utmContent && (
                    <div className="text-[10px] text-muted-foreground font-mono truncate max-w-[140px]">
                      • {c.utmContent}
                    </div>
                  )}
                </td>

                {/* Tracking URL */}
                <td className="px-5 py-3.5 max-w-xs">
                  <div className="flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
                    <span className="truncate max-w-[180px] select-all">{c.generatedUrl}</span>
                    <button
                      type="button"
                      onClick={() => handleCopyLink(c.generatedUrl, c.id)}
                      className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                      title="Copy URL"
                    >
                      {copiedId === c.id ? (
                        <Check className="h-3 w-3 text-emerald-600" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </button>
                    <a
                      href={c.generatedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                      title="Test URL"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </td>

                {/* Status Badge */}
                <td className="px-5 py-3.5 whitespace-nowrap">
                  {getStatusBadge(c.status, c)}
                </td>

                {/* Action Buttons */}
                <td className="px-5 py-3.5 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onInspectCampaign?.(c)}
                      className="h-[28px] w-[28px] rounded-[4px] text-muted-foreground hover:text-foreground cursor-pointer"
                      title="Inspect Details"
                    >
                      <Info className="h-3.5 w-3.5" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onOpenQr(c)}
                      className="h-[28px] w-[28px] rounded-[4px] text-muted-foreground hover:text-foreground cursor-pointer"
                      title="QR Code & Short Link"
                    >
                      <QrCode className="h-3.5 w-3.5" />
                    </Button>

                    <Button
                      size="sm"
                      onClick={() => onSelect360(c.utmCampaign)}
                      className="h-[28px] text-[11px] gap-1 px-2.5 font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-300 rounded-[4px] cursor-pointer"
                    >
                      <BarChart3 className="h-3 w-3" />
                      360 Stats
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-[28px] w-[28px] rounded-[4px] text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                          <MoreHorizontal className="h-3.5 w-3.5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44 text-xs">
                        <DropdownMenuItem onClick={() => onInspectCampaign?.(c)}>
                          <Info className="h-3.5 w-3.5 mr-2" />
                          Inspect Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEditCampaign?.(c)}>
                          <Edit3 className="h-3.5 w-3.5 mr-2" />
                          Edit Campaign
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleCopyLink(c.generatedUrl, c.id)}>
                          <Copy className="h-3.5 w-3.5 mr-2" />
                          Copy Tracking URL
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onOpenQr(c)}>
                          <QrCode className="h-3.5 w-3.5 mr-2" />
                          QR Code & Short Link
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => window.open(c.generatedUrl, "_blank")}>
                          <ExternalLink className="h-3.5 w-3.5 mr-2" />
                          Test Destination Link
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => onDeleteCampaign(c.id)}
                          className="text-rose-600 dark:text-rose-400 focus:text-rose-600"
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-2" />
                          Delete Campaign
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
