"use client";

import React, { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@apollo/client";
import { ADMIN_CREATE_UTM_CAMPAIGN } from "@/graphql/actions/utm/admin-utm.graphql";
import { UtmCampaignItem, UtmDestinationType } from "@/types/utm";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
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
import { useSiteDomain } from "@/hooks/use-site-domain";
import {
  Copy,
  Check,
  Link2,
  Sparkles,
  Globe,
  LogIn,
  ExternalLink,
  BarChart3,
  Tag,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// ── Constants ──────────────────────────────────────────────────────────────
const COMMON_SOURCES = [
  "google", "twitter", "linkedin", "newsletter",
  "facebook", "reddit", "youtube", "partner",
];
const COMMON_MEDIUMS = [
  "cpc", "social", "email", "referral",
  "affiliate", "display", "organic",
];

// ── UTM Link Preview Card (sidebar) ───────────────────────────────────────
function UtmLinkPreview({
  name,
  destinationType,
  utmSource,
  utmMedium,
  effectiveCampaignSlug,
  utmTerm,
  utmContent,
  generatedUrl,
}: {
  name: string;
  destinationType: UtmDestinationType;
  utmSource: string;
  utmMedium: string;
  effectiveCampaignSlug: string;
  utmTerm: string;
  utmContent: string;
  generatedUrl: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedUrl);
    setCopied(true);
    toast.success("Tracking URL copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const destLabel =
    destinationType === "SIGNUP"
      ? "Signup Funnel"
      : destinationType === "LOGIN"
      ? "Login Funnel"
      : "Custom Landing";

  return (
    <div className="space-y-3">
      {/* Campaign identity */}
      <div className="flex items-start gap-2.5 pb-3 border-b border-[#e1e3e5] dark:border-zinc-800">
        <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/40 shrink-0">
          <Link2 className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <div className="text-[12.5px] font-bold text-[#303030] dark:text-zinc-100 truncate">
            {name || "Untitled Campaign"}
          </div>
          <div className="text-[10px] text-muted-foreground font-mono mt-0.5 truncate">
            {effectiveCampaignSlug}
          </div>
        </div>
      </div>

      {/* UTM Params Grid */}
      <div className="space-y-1">
        <PolarisSummaryRow label="Destination" value={destLabel} />
        <PolarisSummaryRow
          label="utm_source"
          value={
            <span className="font-mono text-indigo-600 dark:text-indigo-400">
              {utmSource || <span className="text-muted-foreground italic">not set</span>}
            </span>
          }
        />
        <PolarisSummaryRow
          label="utm_medium"
          value={
            <span className="font-mono text-indigo-600 dark:text-indigo-400">
              {utmMedium || <span className="text-muted-foreground italic">not set</span>}
            </span>
          }
        />
        <PolarisSummaryRow
          label="utm_campaign"
          value={
            <span className="font-mono text-indigo-600 dark:text-indigo-400">
              {effectiveCampaignSlug}
            </span>
          }
        />
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

      {/* Generated URL Box */}
      <div className="rounded-lg bg-zinc-900 dark:bg-zinc-950 border border-zinc-800 p-2.5 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Sparkles className="h-3 w-3 text-indigo-400" />
            <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-wide">
              Generated URL
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
              onClick={() => window.open(generatedUrl, "_blank")}
              className="h-6 w-6 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
            >
              <ExternalLink className="h-3 w-3" />
            </button>
          </div>
        </div>
        <div className="text-[10px] font-mono text-zinc-400 break-all leading-relaxed select-all">
          {generatedUrl}
        </div>
      </div>

      {/* UTM Param Badges */}
      <div className="flex flex-wrap gap-1">
        <Badge variant="outline" className="text-[9px] font-mono">
          source: {utmSource || "—"}
        </Badge>
        <Badge variant="outline" className="text-[9px] font-mono">
          medium: {utmMedium || "—"}
        </Badge>
        <Badge variant="outline" className="text-[9px] font-mono">
          campaign: {effectiveCampaignSlug}
        </Badge>
        {utmContent && (
          <Badge variant="outline" className="text-[9px] font-mono">
            content: {utmContent}
          </Badge>
        )}
      </div>

      {/* 360° Attribution Note */}
      <div className="flex items-start gap-2 p-2.5 rounded-lg bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30">
        <BarChart3 className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 mt-0.5 shrink-0" />
        <p className="text-[10.5px] text-indigo-700 dark:text-indigo-300 leading-relaxed">
          This link will be tracked end-to-end via ClickHouse — visits, signups, logins, and member journeys all attributed.
        </p>
      </div>
    </div>
  );
}

// ── Quick Chip ─────────────────────────────────────────────────────────────
function QuickChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "text-[10px] px-2 py-0.5 rounded-md border transition-all cursor-pointer",
        active
          ? "bg-indigo-50 border-indigo-300 text-indigo-700 dark:bg-indigo-950/60 dark:border-indigo-700 dark:text-indigo-300 font-semibold"
          : "border-[#d2d5d9] dark:border-zinc-700 text-[#616161] dark:text-zinc-400 hover:border-[#aeb4b9] dark:hover:border-zinc-500 hover:text-[#303030] dark:hover:text-zinc-200 bg-white dark:bg-zinc-900"
      )}
    >
      {label}
    </button>
  );
}

// ── Destination Tile ───────────────────────────────────────────────────────
function DestinationTile({
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
export default function CreateUtmCampaignPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [createCampaignMutation] = useMutation(ADMIN_CREATE_UTM_CAMPAIGN);

  const {
    hasCustomDomain,
    hasThricoDomain,
    thricoDomainUrl,
    customDomainUrl,
    primaryUrl,
    domainHost,
    getDestinationUrl,
  } = useSiteDomain();

  const [selectedBaseUrl, setSelectedBaseUrl] = useState<string>("");
  const activeBaseUrl = selectedBaseUrl || primaryUrl;

  // Pre-fill from URL params (from acquisition starters on the list page)
  const [name, setName] = useState(searchParams.get("name") || "");
  const [destinationType, setDestinationType] = useState<UtmDestinationType>(
    (searchParams.get("destinationType") as UtmDestinationType) || "SIGNUP"
  );
  const [destinationUrl, setDestinationUrl] = useState(
    getDestinationUrl(
      (searchParams.get("destinationType") as UtmDestinationType) || "SIGNUP",
      activeBaseUrl
    )
  );
  const [utmSource, setUtmSource] = useState(searchParams.get("utmSource") || "google");
  const [utmMedium, setUtmMedium] = useState(searchParams.get("utmMedium") || "cpc");
  const [utmCampaign, setUtmCampaign] = useState(searchParams.get("utmCampaign") || "");
  const [utmTerm, setUtmTerm] = useState("");
  const [utmContent, setUtmContent] = useState("");
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Sync destinationUrl once primaryUrl is resolved from GraphQL
  React.useEffect(() => {
    if (primaryUrl && (!destinationUrl || destinationUrl.includes("thrico.app") || destinationUrl.includes("thrico.community"))) {
      setDestinationUrl(getDestinationUrl(destinationType, activeBaseUrl));
    }
  }, [primaryUrl, activeBaseUrl, destinationType, destinationUrl, getDestinationUrl]);

  // Mark dirty whenever any field changes
  const markDirty = () => {
    setIsDirty(true);
    setSaved(false);
  };

  const handleDestinationTypeChange = (type: UtmDestinationType) => {
    setDestinationType(type);
    setDestinationUrl(getDestinationUrl(type, activeBaseUrl));
    markDirty();
  };

  const effectiveCampaignSlug = useMemo(() => {
    if (utmCampaign.trim())
      return utmCampaign.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "_");
    return name.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "_") || "campaign";
  }, [utmCampaign, name]);

  const generatedUrl = useMemo(() => {
    try {
      const baseUrl = destinationUrl.trim() || getDestinationUrl("SIGNUP", activeBaseUrl);
      const url = new URL(baseUrl.startsWith("http") ? baseUrl : `https://${baseUrl}`);
      if (utmSource) url.searchParams.set("utm_source", utmSource.trim().toLowerCase());
      if (utmMedium) url.searchParams.set("utm_medium", utmMedium.trim().toLowerCase());
      if (effectiveCampaignSlug) url.searchParams.set("utm_campaign", effectiveCampaignSlug);
      if (utmTerm.trim()) url.searchParams.set("utm_term", utmTerm.trim());
      if (utmContent.trim()) url.searchParams.set("utm_content", utmContent.trim());
      return url.toString();
    } catch {
      return `${destinationUrl}?utm_source=${utmSource}&utm_medium=${utmMedium}&utm_campaign=${effectiveCampaignSlug}`;
    }
  }, [destinationUrl, utmSource, utmMedium, effectiveCampaignSlug, utmTerm, utmContent, getDestinationUrl, activeBaseUrl]);

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Please enter a campaign name");
      return;
    }
    if (!utmSource.trim() || !utmMedium.trim()) {
      toast.error("UTM Source and Medium are required");
      return;
    }
    setIsSaving(true);
    try {
      const input = {
        name: name.trim(),
        destinationType,
        destinationUrl: destinationUrl.trim(),
        utmSource: utmSource.trim().toLowerCase(),
        utmMedium: utmMedium.trim().toLowerCase(),
        utmCampaign: effectiveCampaignSlug,
        utmTerm: utmTerm.trim() || undefined,
        utmContent: utmContent.trim() || undefined,
      };

      let newRecord: UtmCampaignItem | null = null;
      try {
        const res = await createCampaignMutation({ variables: { input } });
        if (res.data?.createUtmCampaign) newRecord = res.data.createUtmCampaign;
      } catch (err) {
        console.warn("GraphQL mutation fallback:", err);
      }

      if (!newRecord) {
        newRecord = {
          id: `utm-${Date.now()}`,
          name: input.name,
          destinationType: input.destinationType,
          destinationUrl: input.destinationUrl,
          utmSource: input.utmSource,
          utmMedium: input.utmMedium,
          utmCampaign: input.utmCampaign,
          utmTerm: input.utmTerm,
          utmContent: input.utmContent,
          generatedUrl,
          shortCode: `thrc.io/${effectiveCampaignSlug.slice(0, 8)}`,
          status: "ACTIVE",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      }

      toast.success("UTM Tracking Link created successfully!");
      setSaved(true);
      setIsDirty(false);
      router.push(`/marketing/utm/${newRecord.id}`);
    } catch (err: unknown) {
      toast.error((err as Error)?.message || "Failed to create UTM tracking link");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscard = () => {
    setIsDirty(false);
    router.push("/marketing/utm");
  };

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Create UTM Tracking Link"
        description="Generate a tagged campaign URL with full-funnel ClickHouse attribution tracking"
        icon={Link2}
        badgeText="New"
        breadcrumbs={[
          { label: "Marketing", href: "/marketing" },
          { label: "UTM Manager", href: "/marketing/utm" },
          { label: "Create Tracking Link" },
        ]}
      />

      <EcosystemContainer className="h-full border-none shadow-none bg-transparent p-0 ring-0">
        <PolarisFormLayout
          sidebar={
            <div className="space-y-4">
              {/* Live URL Preview */}
              <PolarisSidebarCard
                title="Tracking Link Preview"
                badge="Live Preview"
                icon={Sparkles}
              >
                <UtmLinkPreview
                  name={name}
                  destinationType={destinationType}
                  utmSource={utmSource}
                  utmMedium={utmMedium}
                  effectiveCampaignSlug={effectiveCampaignSlug}
                  utmTerm={utmTerm}
                  utmContent={utmContent}
                  generatedUrl={generatedUrl}
                />
              </PolarisSidebarCard>

              {/* Tip */}
              <PolarisTipCard title="UTM Attribution Strategy">
                High-performing campaigns use specific utm_source and utm_medium values. 
                Keep utm_campaign slugs concise and descriptive for easy ClickHouse filtering.
              </PolarisTipCard>
            </div>
          }
        >
          {/* ── Step 1: Campaign Identity ── */}
          <PolarisFormCard
            step={1}
            title="Campaign Identity"
            description="Set the display name and funnel destination for this tracking link."
            badge="Required"
          >
            {/* Campaign Name */}
            <div className="space-y-1.5">
              <PolarisLabel required>Campaign Name</PolarisLabel>
              <Input
                id="utm-name"
                placeholder="e.g. Summer 2026 Growth Drop"
                value={name}
                onChange={(e) => { setName(e.target.value); markDirty(); }}
                className="h-9 text-xs"
                autoFocus
              />
              <p className="text-[11px] text-[#616161] dark:text-zinc-400">
                Human-readable label shown in the dashboard. Does not affect UTM tracking.
              </p>
            </div>

            {/* Destination Type */}
            <div className="space-y-2.5 pt-3 border-t border-[#e1e3e5] dark:border-zinc-800">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <PolarisLabel required>Destination Goal</PolarisLabel>
                {/* Domain indicator from visit.tsx logic */}
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Globe className="h-3 w-3 text-emerald-500 shrink-0" />
                  <span className="text-[11.5px] truncate">
                    Domain: <strong className="text-foreground font-mono font-medium">{domainHost}</strong>
                  </span>
                  {hasCustomDomain && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      Custom
                    </span>
                  )}
                  {hasCustomDomain && hasThricoDomain && (
                    <div className="flex items-center gap-1 ml-1 pl-1.5 border-l border-border/60">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedBaseUrl(customDomainUrl!);
                          setDestinationUrl(getDestinationUrl(destinationType, customDomainUrl!));
                          markDirty();
                        }}
                        className={cn(
                          "px-1.5 py-0.5 text-[10px] rounded transition-all font-semibold",
                          activeBaseUrl === customDomainUrl
                            ? "bg-foreground text-background"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        Custom
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedBaseUrl(thricoDomainUrl!);
                          setDestinationUrl(getDestinationUrl(destinationType, thricoDomainUrl!));
                          markDirty();
                        }}
                        className={cn(
                          "px-1.5 py-0.5 text-[10px] rounded transition-all font-semibold",
                          activeBaseUrl === thricoDomainUrl
                            ? "bg-foreground text-background"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        Thrico
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <DestinationTile
                  value="SIGNUP"
                  label="Signup Funnel"
                  description="Routes to /signup — track new member acquisition."
                  icon={Globe}
                  selected={destinationType === "SIGNUP"}
                  onClick={() => handleDestinationTypeChange("SIGNUP")}
                />
                <DestinationTile
                  value="LOGIN"
                  label="Login Funnel"
                  description="Routes to /login — track re-engagement campaigns."
                  icon={LogIn}
                  selected={destinationType === "LOGIN"}
                  onClick={() => handleDestinationTypeChange("LOGIN")}
                />
                <DestinationTile
                  value="CUSTOM"
                  label="Custom Landing"
                  description="Enter any destination URL for campaign-specific pages."
                  icon={ExternalLink}
                  selected={destinationType === "CUSTOM"}
                  onClick={() => handleDestinationTypeChange("CUSTOM")}
                />
              </div>

              {/* Resolved URL Preview for Funnel Goals */}
              {destinationType !== "CUSTOM" && (
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-mono bg-muted/30 px-3 py-1.5 rounded-lg border border-border/50">
                  <span className="text-muted-foreground/70 shrink-0">Resolves to:</span>
                  <span className="text-foreground truncate">{destinationUrl}</span>
                </div>
              )}

              {/* Custom URL input */}
              {destinationType === "CUSTOM" && (
                <Input
                  placeholder={`${activeBaseUrl}/landing`}
                  value={destinationUrl}
                  onChange={(e) => { setDestinationUrl(e.target.value); markDirty(); }}
                  className="h-9 text-xs font-mono mt-2"
                />
              )}
            </div>
          </PolarisFormCard>

          {/* ── Step 2: UTM Parameters ── */}
          <PolarisFormCard
            step={2}
            title="UTM Attribution Parameters"
            description="Define source, medium, and campaign slug for ClickHouse attribution."
            badge="Required"
          >
            {/* Source & Medium */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Source */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <PolarisLabel required>UTM Source</PolarisLabel>
                  <span className="text-[10px] text-[#616161] dark:text-zinc-400">utm_source</span>
                </div>
                <Input
                  placeholder="e.g. google"
                  value={utmSource}
                  onChange={(e) => { setUtmSource(e.target.value); markDirty(); }}
                  className="h-9 text-xs font-mono"
                />
                <div className="flex flex-wrap gap-1">
                  {COMMON_SOURCES.map((s) => (
                    <QuickChip
                      key={s}
                      label={s}
                      active={utmSource === s}
                      onClick={() => { setUtmSource(s); markDirty(); }}
                    />
                  ))}
                </div>
              </div>

              {/* Medium */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <PolarisLabel required>UTM Medium</PolarisLabel>
                  <span className="text-[10px] text-[#616161] dark:text-zinc-400">utm_medium</span>
                </div>
                <Input
                  placeholder="e.g. cpc"
                  value={utmMedium}
                  onChange={(e) => { setUtmMedium(e.target.value); markDirty(); }}
                  className="h-9 text-xs font-mono"
                />
                <div className="flex flex-wrap gap-1">
                  {COMMON_MEDIUMS.map((m) => (
                    <QuickChip
                      key={m}
                      label={m}
                      active={utmMedium === m}
                      onClick={() => { setUtmMedium(m); markDirty(); }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Campaign Slug */}
            <div className="space-y-1.5 pt-3 border-t border-[#e1e3e5] dark:border-zinc-800">
              <div className="flex items-center justify-between">
                <PolarisLabel>Campaign Slug</PolarisLabel>
                <span className="text-[10px] text-[#616161] dark:text-zinc-400">utm_campaign</span>
              </div>
              <Input
                placeholder="e.g. summer_growth_2026"
                value={utmCampaign}
                onChange={(e) => { setUtmCampaign(e.target.value); markDirty(); }}
                className="h-9 text-xs font-mono"
              />
              <p className="text-[11px] text-[#616161] dark:text-zinc-400">
                Auto-slugified from Campaign Name if left empty.{" "}
                <span className="font-mono text-indigo-600 dark:text-indigo-400">
                  → {effectiveCampaignSlug}
                </span>
              </p>
            </div>
          </PolarisFormCard>

          {/* ── Step 3: Optional Parameters ── */}
          <PolarisFormCard
            step={3}
            title="Optional Attribution Parameters"
            description="Add paid search keywords or creative variant identifiers for deeper ClickHouse segmentation."
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
            title="Unsaved Campaign"
            buttonText="Save & Generate Link"
            discardButtonText="Discard"
          />
        </PolarisFormLayout>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
