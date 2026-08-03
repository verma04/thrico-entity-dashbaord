"use client";

import { useState, useEffect } from "react";
import {
  Store,
  Globe,
  Image as ImageIcon,
  CreditCard,
  MapPin,
  Fingerprint,
  Layers,
  RotateCcw,
  ExternalLink,
} from "lucide-react";
import BillingDetailsForm from "./billing-details-form";
import { useGetEntity } from "@/graphql/actions";
import { EntityProfileCard } from "./entity-profile-card";
import { EntityLogoUpload } from "./entity-logo-upload";
import { FaviconUpload } from "./favicon-upload";
import { Skeleton } from "@/components/ui/skeleton";
import { PlatformContainer } from "@/components/ui/platform/container";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

type Tab = "identity" | "branding" | "billing";

const TABS: {
  key: Tab;
  label: string;
  icon: React.ElementType;
  description: string;
}[] = [
  {
    key: "identity",
    label: "Identity",
    icon: Fingerprint,
    description: "Entity name and profile",
  },
  {
    key: "branding",
    label: "Branding",
    icon: Layers,
    description: "Logo, favicon & visual assets",
  },
  {
    key: "billing",
    label: "Billing Details",
    icon: CreditCard,
    description: "Legal address & billing info",
  },
];

export default function GeneralSettings() {
  const { data: entityData, loading: entityLoading, refetch } = useGetEntity();
  const [activeTab, setActiveTab] = useState<Tab>("identity");

  const [communityName, setCommunityName] = useState(
    entityData?.getEntity?.name || "My Page",
  );
  const [communityImage, setCommunityImage] = useState<string>("");
  const [faviconImage, setFaviconImage] = useState<string>("");

  useEffect(() => {
    if (entityData?.getEntity) {
      setCommunityName(entityData.getEntity.name || "My Page");
      setCommunityImage(
        entityData.getEntity.logo
          ? `${process.env.NEXT_PUBLIC_CDN_URL}/${entityData.getEntity.logo}`
          : "",
      );
    }
  }, [entityData]);

  const handleNameUpdate = (newName: string) => setCommunityName(newName);
  const handleLogoUpdate = (newUrl: string) => setCommunityImage(newUrl);
  const handleFaviconUpdate = (newUrl: string) => setFaviconImage(newUrl);

  if (entityLoading) {
    return (
      <PlatformContainer className="py-0">
        <div className="flex flex-col gap-8">
          {/* skeleton header */}
          <div className="flex items-center gap-3 pb-6 border-b border-border">
            <div className="w-9 h-9 rounded-xl bg-muted animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 w-40 bg-muted rounded-md animate-pulse" />
              <div className="h-3 w-64 bg-muted/50 rounded-md animate-pulse" />
            </div>
          </div>
          {/* skeleton tabs */}
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-10 w-28 bg-muted rounded-lg animate-pulse"
              />
            ))}
          </div>
          {/* skeleton content */}
          <Skeleton className="h-[300px] w-full rounded-xl" />
        </div>
      </PlatformContainer>
    );
  }

  return (
    <PlatformContainer className="py-0">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white shrink-0">
            <Store size={16} strokeWidth={2} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-[15px] font-semibold text-foreground tracking-tight leading-none">
                General Settings
              </h1>
              <span className="px-1.5 py-0.5 rounded-md bg-muted text-[10px] font-medium text-muted-foreground uppercase tracking-wide border border-border/60">
                Identity
              </span>
            </div>
            <p className="mt-1 text-[12.5px] text-muted-foreground font-normal leading-snug">
              Manage your entity's profile, visual identity, and billing
              information.
            </p>
          </div>
        </div>
        <button
          onClick={() => refetch()}
          className="h-8 px-3 rounded-lg text-[12px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors flex items-center gap-1.5 shrink-0"
        >
          <RotateCcw size={12} />
          Refresh
        </button>
      </div>

      {/* ── Tab Bar ── */}
      <div className="mt-5 flex gap-1.5 border-b border-border pb-0 -mb-px">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "relative flex items-center gap-2 px-3.5 py-2.5 rounded-t-lg text-[12.5px] font-medium transition-colors duration-150 border border-transparent",
                isActive
                  ? "text-foreground bg-card border-border border-b-card -mb-px z-10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
              )}
            >
              <Icon size={13} strokeWidth={isActive ? 2.2 : 1.8} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── Tab Content ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="mt-6"
        >
          {/* ── Identity Tab ── */}
          {activeTab === "identity" && (
            <div className="max-w-2xl space-y-6">
              <SectionCard
                icon={Fingerprint}
                title="Entity Profile"
                description="Your entity's display name and primary identity across the platform."
              >
                <EntityProfileCard
                  name={communityName}
                  image={communityImage}
                  onNameUpdate={handleNameUpdate}
                />
              </SectionCard>

              {/* Entity metadata info rows */}
              <SectionCard
                icon={Globe}
                title="Platform Metadata"
                description="Heuristic signals and read-only descriptors for this entity node."
              >
                <div className="divide-y divide-zinc-100">
                  <InfoRow label="Entity Type" value="Organizational Unit" />
                  <InfoRow
                    label="Protocol Status"
                    value="Active / Synchronized"
                    valueClass="text-emerald-600"
                    dot="emerald"
                  />
                  <InfoRow
                    label="Registry ID"
                    value={entityData?.getEntity?.id || "—"}
                    mono
                  />
                  <InfoRow label="Workspace" value={communityName} />
                  <InfoRow label="Primary Language" value="English (Global)" />
                  <InfoRow
                    label="Subdomain"
                    value={entityData?.getEntity?.subdomain || "—"}
                    mono
                  />
                  <InfoRow
                    label="Public URL"
                    value={`https://${entityData?.getEntity?.subdomain}.thrico.network`}
                    isLink
                    href={`https://${entityData?.getEntity?.subdomain}.thrico.network`}
                  />
                </div>
              </SectionCard>
            </div>
          )}

          {/* ── Branding Tab ── */}
          {activeTab === "branding" && (
            <div className="max-w-2xl space-y-6">
              <SectionCard
                icon={ImageIcon}
                title="Primary Logo"
                description="Used in the header, email templates, and all public-facing surfaces. Use PNG or SVG with a transparent background."
              >
                <div className="p-4 rounded-lg border border-border bg-muted/50/40">
                  <EntityLogoUpload
                    currentImage={communityImage}
                    onImageUpdate={handleLogoUpdate}
                  />
                </div>
              </SectionCard>

              <SectionCard
                icon={Globe}
                title="Browser Favicon"
                description="Displayed in browser tabs and bookmarks. Recommend 32×32px or 64×64px ICO, PNG, or SVG."
              >
                <div className="p-4 rounded-lg border border-border bg-muted/50/40">
                  <FaviconUpload
                    currentImage={faviconImage}
                    onImageUpdate={handleFaviconUpdate}
                  />
                </div>
              </SectionCard>

              {/* Asset guidelines */}
              <div className="rounded-xl border border-border/60 bg-primary p-5 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-md bg-card/10 flex items-center justify-center">
                    <ImageIcon size={12} className="text-muted-foreground" />
                  </div>
                  <p className="text-[12px] font-semibold text-zinc-100">
                    Asset Guidelines
                  </p>
                </div>
                <p className="text-[12px] text-muted-foreground leading-relaxed">
                  Use high-quality assets with transparent backgrounds. PNG or
                  SVG are preferred formats. Minimum recommended size is
                  256×256px for the logo.
                </p>
              </div>
            </div>
          )}

          {/* ── Billing Tab ── */}
          {activeTab === "billing" && (
            <div className="max-w-2xl space-y-6">
              <SectionCard
                icon={MapPin}
                title="Billing Details"
                description="Manage account type, tax information, card details, and billing address for invoicing."
              >
                <BillingDetailsForm />
              </SectionCard>

              <SectionCard
                icon={CreditCard}
                title="Billing Status"
                description="Comprehensive overview of your financial standing and current protocol plan."
              >
                <div className="divide-y divide-zinc-100">
                  <InfoRow label="Platform Plan" value="Enterprise Protocol" />
                  <InfoRow
                    label="Billing Frequency"
                    value="Annual / Recurring"
                  />
                  <InfoRow label="Renewal Date" value="Jan 12, 2027" />
                  <InfoRow
                    label="Current Status"
                    value="Settled"
                    valueClass="text-emerald-600"
                    dot="emerald"
                  />
                  <InfoRow label="Auto-Renewal" value="Enabled" />
                </div>
              </SectionCard>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </PlatformContainer>
  );
}

// ── Internal sub-components ──────────────────────────────────────────────────

function SectionCard({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
      {/* Card header */}
      <div className="flex items-start gap-3 px-5 py-4 border-b border-border bg-muted/50/40">
        <div className="w-7 h-7 rounded-lg bg-muted border border-border/60 flex items-center justify-center text-muted-foreground shrink-0 mt-0.5">
          <Icon size={13} strokeWidth={2} />
        </div>
        <div>
          <p className="text-[13.5px] font-semibold text-foreground leading-none">
            {title}
          </p>
          <p className="mt-1 text-[12px] text-muted-foreground leading-snug">
            {description}
          </p>
        </div>
      </div>
      {/* Card body */}
      <div className="p-5">{children}</div>
    </div>
  );
}

function InfoRow({
  label,
  value,
  mono = false,
  valueClass,
  dot,
  isLink = false,
  href,
}: {
  label: string;
  value: string;
  mono?: boolean;
  valueClass?: string;
  dot?: "emerald" | "zinc";
  isLink?: boolean;
  href?: string;
}) {
  return (
    <div className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
      <span className="text-[12px] text-muted-foreground font-medium">{label}</span>
      <div className="flex items-center gap-1.5">
        {dot && (
          <div
            className={cn(
              "w-1.5 h-1.5 rounded-full",
              dot === "emerald" ? "bg-emerald-500" : "bg-zinc-400",
            )}
          />
        )}
        {isLink ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[12.5px] font-medium text-emerald-600 hover:text-emerald-700 hover:underline flex items-center gap-1 transition-all"
          >
            {value}
            <ExternalLink size={11} strokeWidth={2.5} />
          </a>
        ) : (
          <span
            className={cn(
              "text-[12.5px] font-medium text-foreground",
              mono && "font-mono text-[11px] text-muted-foreground",
              valueClass,
            )}
          >
            {value}
          </span>
        )}
      </div>
    </div>
  );
}
