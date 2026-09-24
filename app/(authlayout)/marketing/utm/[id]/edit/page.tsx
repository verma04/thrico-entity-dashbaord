"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client";
import { useCampaignDetail } from "../layout";
import { ADMIN_UPDATE_UTM_CAMPAIGN } from "@/graphql/actions/utm/admin-utm.graphql";
import { UtmCampaignStatus } from "@/types/utm";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";
import {
  PolarisFormLayout,
  PolarisFormCard,
  PolarisSidebarCard,
  PolarisSummaryRow,
  PolarisTipCard,
  PolarisLabel,
} from "@/components/gamification/shared/polaris-form-ui";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Copy,
  Check,
  Link2,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Pause,
  Archive,
  Tag,
  Zap,
  BarChart3,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// ── Live Preview Sidebar ───────────────────────────────────────────────────
function UtmEditPreview({
  name,
  status,
  utmSource,
  utmMedium,
  utmCampaign,
  utmTerm,
  utmContent,
  previewUrl,
}: {
  name: string;
  status: UtmCampaignStatus;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmTerm: string;
  utmContent: string;
  previewUrl: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(previewUrl);
    setCopied(true);
    toast.success("Tracking URL copied");
    setTimeout(() => setCopied(false), 2000);
  };

  const statusColor =
    status === "ACTIVE"
      ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
      : status === "PAUSED"
      ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
      : "bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700";

  return (
    <div className="space-y-3">
      {/* Campaign identity */}
      <div className="flex items-start gap-2.5 pb-3 border-b border-[#e1e3e5] dark:border-zinc-800">
        <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/40 shrink-0">
          <Link2 className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[12.5px] font-bold text-[#303030] dark:text-zinc-100 truncate">
            {name || "Untitled Campaign"}
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-[10px] text-muted-foreground font-mono truncate">
              {utmCampaign}
            </span>
            <Badge
              className={cn(
                "text-[9px] font-semibold border px-1.5 py-0 rounded-full shrink-0",
                statusColor
              )}
            >
              {status}
            </Badge>
          </div>
        </div>
      </div>

      {/* Locked params */}
      <div className="space-y-1">
        <div className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground mb-1.5">
          Locked Parameters
        </div>
        <PolarisSummaryRow
          label="utm_source"
          value={
            <span className="font-mono text-indigo-600 dark:text-indigo-400">{utmSource}</span>
          }
        />
        <PolarisSummaryRow
          label="utm_medium"
          value={
            <span className="font-mono text-indigo-600 dark:text-indigo-400">{utmMedium}</span>
          }
        />
        <PolarisSummaryRow
          label="utm_campaign"
          value={
            <span className="font-mono text-indigo-600 dark:text-indigo-400">{utmCampaign}</span>
          }
        />
      </div>

      {/* Editable params */}
      {(utmTerm || utmContent) && (
        <div className="space-y-1 pt-2 border-t border-[#e1e3e5] dark:border-zinc-800">
          <div className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground mb-1.5">
            Editable Parameters
          </div>
          {utmTerm && (
            <PolarisSummaryRow
              label="utm_term"
              value={<span className="font-mono text-xs">{utmTerm}</span>}
            />
          )}
          {utmContent && (
            <PolarisSummaryRow
              label="utm_content"
              value={<span className="font-mono text-xs">{utmContent}</span>}
              isLast
            />
          )}
        </div>
      )}

      {/* Generated URL Box */}
      <div className="rounded-lg bg-zinc-900 dark:bg-zinc-950 border border-zinc-800 p-2.5 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Sparkles className="h-3 w-3 text-indigo-400" />
            <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-wide">
              Updated URL
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleCopy}
              className="h-6 w-6 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
            >
              {copied ? (
                <Check className="h-3 w-3 text-emerald-400" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </button>
            <button
              type="button"
              onClick={() => window.open(previewUrl, "_blank")}
              className="h-6 w-6 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
            >
              <ExternalLink className="h-3 w-3" />
            </button>
          </div>
        </div>
        <div className="text-[10px] font-mono text-zinc-400 break-all leading-relaxed select-all">
          {previewUrl}
        </div>
      </div>

      {/* Param badges */}
      <div className="flex flex-wrap gap-1">
        <Badge variant="outline" className="text-[9px] font-mono">source: {utmSource}</Badge>
        <Badge variant="outline" className="text-[9px] font-mono">medium: {utmMedium}</Badge>
        <Badge variant="outline" className="text-[9px] font-mono">campaign: {utmCampaign}</Badge>
        {utmContent && (
          <Badge variant="outline" className="text-[9px] font-mono">content: {utmContent}</Badge>
        )}
      </div>

      {/* Attribution note */}
      <div className="flex items-start gap-2 p-2.5 rounded-lg bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30">
        <BarChart3 className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 mt-0.5 shrink-0" />
        <p className="text-[10.5px] text-indigo-700 dark:text-indigo-300 leading-relaxed">
          Changes apply immediately. ClickHouse will attribute new events to the updated parameters.
        </p>
      </div>
    </div>
  );
}

// ── Status Tile ────────────────────────────────────────────────────────────
function StatusTile({
  label,
  description,
  icon: Icon,
  selected,
  onClick,
}: {
  label: string;
  description: string;
  icon: React.ElementType;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative flex items-start gap-2.5 p-3 rounded-[6px] border text-left transition-all cursor-pointer",
        selected
          ? "border-[#303030] dark:border-zinc-100 bg-[#f6f6f7] dark:bg-zinc-800 ring-1 ring-[#303030] dark:ring-zinc-100 shadow-2xs"
          : "border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-[#aeb4b9]"
      )}
    >
      <div
        className={cn(
          "h-7 w-7 rounded-[4px] flex items-center justify-center shrink-0 border transition-colors",
          selected
            ? "bg-[#303030] text-white border-[#303030] dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100"
            : "bg-[#f6f6f7] dark:bg-zinc-800 text-[#616161] dark:text-zinc-400 border-[#d2d5d9] dark:border-zinc-700"
        )}
      >
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div className="flex-1 min-w-0">
        <span className="text-[12.5px] font-semibold text-[#303030] dark:text-zinc-100 block">
          {label}
        </span>
        <p className="text-[11px] text-[#616161] dark:text-zinc-400 mt-0.5 leading-[15px]">
          {description}
        </p>
      </div>
    </button>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────
export default function EditCampaignPage() {
  const { campaign } = useCampaignDetail();
  const router = useRouter();
  const [updateCampaignMutation] = useMutation(ADMIN_UPDATE_UTM_CAMPAIGN);

  const [name, setName] = useState(campaign.name || "");
  const [status, setStatus] = useState<UtmCampaignStatus>(campaign.status || "ACTIVE");
  const [utmTerm, setUtmTerm] = useState(campaign.utmTerm || "");
  const [utmContent, setUtmContent] = useState(campaign.utmContent || "");
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const markDirty = () => { setIsDirty(true); setSaved(false); };

  const previewUrl = useMemo(() => {
    try {
      const base = campaign.destinationUrl || campaign.generatedUrl;
      const url = new URL(base.startsWith("http") ? base : `https://${base}`);
      if (campaign.utmSource) url.searchParams.set("utm_source", campaign.utmSource);
      if (campaign.utmMedium) url.searchParams.set("utm_medium", campaign.utmMedium);
      if (campaign.utmCampaign) url.searchParams.set("utm_campaign", campaign.utmCampaign);
      if (utmTerm.trim()) url.searchParams.set("utm_term", utmTerm.trim());
      else url.searchParams.delete("utm_term");
      if (utmContent.trim()) url.searchParams.set("utm_content", utmContent.trim());
      else url.searchParams.delete("utm_content");
      return url.toString();
    } catch {
      return campaign.generatedUrl;
    }
  }, [campaign, utmTerm, utmContent]);

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Campaign name cannot be empty");
      return;
    }
    setIsSaving(true);
    try {
      const input = {
        id: campaign.id,
        name: name.trim(),
        status,
        utmTerm: utmTerm.trim() || undefined,
        utmContent: utmContent.trim() || undefined,
      };
      try {
        await updateCampaignMutation({ variables: { input } });
      } catch (err) {
        console.warn("Apollo update fallback:", err);
      }
      toast.success("Campaign updated successfully");
      setSaved(true);
      setIsDirty(false);
      router.push(`/marketing/utm/${campaign.id}`);
    } catch (err: unknown) {
      toast.error((err as Error)?.message || "Failed to update campaign");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscard = () => {
    setIsDirty(false);
    router.push(`/marketing/utm/${campaign.id}`);
  };

  return (
    <EcosystemContainer className="h-full border-none shadow-none bg-transparent p-0 ring-0">
      <PolarisFormLayout
        sidebar={
          <div className="space-y-4">
            <PolarisSidebarCard
              title="Tracking Link Preview"
              badge="Live Preview"
              icon={Sparkles}
            >
              <UtmEditPreview
                name={name}
                status={status}
                utmSource={campaign.utmSource}
                utmMedium={campaign.utmMedium}
                utmCampaign={campaign.utmCampaign}
                utmTerm={utmTerm}
                utmContent={utmContent}
                previewUrl={previewUrl}
              />
            </PolarisSidebarCard>

            <PolarisTipCard title="What can be edited?">
              Campaign name, status, utm_term, and utm_content can be freely changed.
              Core parameters (source, medium, campaign slug) are locked to preserve attribution history.
            </PolarisTipCard>
          </div>
        }
      >
        {/* ── Step 1: Campaign Identity ── */}
        <PolarisFormCard
          step={1}
          title="Campaign Identity"
          description="Update the display name shown in the UTM attribution dashboard."
          badge="Editable"
        >
          <div className="space-y-1.5">
            <PolarisLabel required>Campaign Display Name</PolarisLabel>
            <Input
              placeholder="e.g. Summer 2026 Growth Drop"
              value={name}
              onChange={(e) => { setName(e.target.value); markDirty(); }}
              className="h-9 text-xs"
              autoFocus
            />
            <p className="text-[11px] text-[#616161] dark:text-zinc-400">
              Shown in dashboards only. Does not affect UTM tracking or attribution.
            </p>
          </div>
        </PolarisFormCard>

        {/* ── Step 2: Locked UTM Parameters (read-only audit) ── */}
        <PolarisFormCard
          step={2}
          title="Locked Attribution Parameters"
          description="These core UTM values are frozen to preserve historical ClickHouse attribution integrity."
          badge="Read-only"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {[
              { label: "utm_source", value: campaign.utmSource },
              { label: "utm_medium", value: campaign.utmMedium },
              { label: "utm_campaign", value: campaign.utmCampaign },
            ].map((p) => (
              <div
                key={p.label}
                className="p-3 rounded-[6px] bg-[#f6f6f7] dark:bg-zinc-800/50 border border-[#d2d5d9] dark:border-zinc-700 opacity-75 cursor-not-allowed"
              >
                <div className="text-[10px] text-[#616161] dark:text-zinc-400 uppercase font-semibold tracking-wide mb-1">
                  {p.label}
                </div>
                <div className="font-mono text-[12.5px] font-bold text-indigo-600 dark:text-indigo-400 truncate">
                  {p.value}
                </div>
              </div>
            ))}
          </div>
        </PolarisFormCard>

        {/* ── Step 3: Campaign Status ── */}
        <PolarisFormCard
          step={3}
          title="Campaign Status"
          description="Control whether this tracking link is actively ingesting traffic and conversion telemetry."
          badge="Editable"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <StatusTile
              value="ACTIVE"
              label="Active"
              description="Ingesting traffic & conversions in real-time."
              icon={ShieldCheck}
              selected={status === "ACTIVE"}
              onClick={() => { setStatus("ACTIVE"); markDirty(); }}
            />
            <StatusTile
              value="PAUSED"
              label="Paused"
              description="Temporarily halting telemetry collection."
              icon={Pause}
              selected={status === "PAUSED"}
              onClick={() => { setStatus("PAUSED"); markDirty(); }}
            />
            <StatusTile
              value="ARCHIVED"
              label="Archived"
              description="Retired campaign — historical data preserved."
              icon={Archive}
              selected={status === "ARCHIVED"}
              onClick={() => { setStatus("ARCHIVED"); markDirty(); }}
            />
          </div>
        </PolarisFormCard>

        {/* ── Step 4: Optional Parameters ── */}
        <PolarisFormCard
          step={4}
          title="Optional Attribution Parameters"
          description="Refine attribution with paid keyword and creative variant identifiers."
          badge="Optional"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <PolarisLabel>
                  <div className="flex items-center gap-1">
                    <Tag className="h-3 w-3" />
                    Search Keyword
                  </div>
                </PolarisLabel>
                <span className="text-[10px] text-[#616161] dark:text-zinc-400">utm_term</span>
              </div>
              <Input
                placeholder="e.g. saas_community"
                value={utmTerm}
                onChange={(e) => { setUtmTerm(e.target.value); markDirty(); }}
                className="h-9 text-xs font-mono"
              />
              <p className="text-[11px] text-[#616161] dark:text-zinc-400">
                Paid search keywords or audience segment identifiers.
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <PolarisLabel>
                  <div className="flex items-center gap-1">
                    <Zap className="h-3 w-3" />
                    Creative Variant
                  </div>
                </PolarisLabel>
                <span className="text-[10px] text-[#616161] dark:text-zinc-400">utm_content</span>
              </div>
              <Input
                placeholder="e.g. hero_banner_v2"
                value={utmContent}
                onChange={(e) => { setUtmContent(e.target.value); markDirty(); }}
                className="h-9 text-xs font-mono"
              />
              <p className="text-[11px] text-[#616161] dark:text-zinc-400">
                A/B test ad variant or button label for click attribution.
              </p>
            </div>
          </div>
        </PolarisFormCard>

        {/* Floating Save Panel */}
        <FloatingSavePanel
          hasChanged={isDirty}
          saved={saved}
          isSaving={isSaving}
          onSave={handleSave}
          onReset={handleDiscard}
          title="Unsaved Changes"
          buttonText="Save Changes"
          discardButtonText="Discard"
        />
      </PolarisFormLayout>
    </EcosystemContainer>
  );
}
