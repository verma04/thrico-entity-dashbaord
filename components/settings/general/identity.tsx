"use client";

import { useState, useEffect } from "react";
import { Globe, Fingerprint, ExternalLink } from "lucide-react";
import { useGetEntity } from "@/graphql/actions";
import { EntityProfileCard } from "./entity-profile-card";
import { Skeleton } from "@/components/ui/skeleton";
import { PlatformContainer } from "@/components/ui/platform/container";
import { cn } from "@/lib/utils";

export default function Identity() {
  const { data: entityData, loading: entityLoading, refetch } = useGetEntity();

  const [communityName, setCommunityName] = useState(
    entityData?.getEntity?.name || "My Page",
  );
  const [communityImage, setCommunityImage] = useState<string>("");

  useEffect(() => {
    if (entityData?.getEntity) {
      setCommunityName(entityData.getEntity.name || "My Page");
      setCommunityImage(
        entityData.getEntity.logo
          ? `https://cdn.thrico.network/${entityData.getEntity.logo}`
          : "",
      );
    }
  }, [entityData]);

  const handleNameUpdate = (newName: string) => setCommunityName(newName);

  if (entityLoading) {
    return (
      <PlatformContainer className="py-0">
        <div className="flex flex-col gap-8">
          <Skeleton className="h-[300px] w-full rounded-xl" />
        </div>
      </PlatformContainer>
    );
  }

  return (
    <PlatformContainer className="py-0">
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
              valueClass="text-zinc-600 dark:text-zinc-400"
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
    </PlatformContainer>
  );
}

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
      <span className="text-[12px] text-muted-foreground font-medium">
        {label}
      </span>
      <div className="flex items-center gap-1.5">
        {dot && (
          <div
            className={cn(
              "w-1.5 h-1.5 rounded-full",
              dot === "emerald" ? "bg-zinc-800 dark:bg-zinc-200" : "bg-zinc-400",
            )}
          />
        )}
        {isLink ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[12.5px] font-medium text-zinc-600 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300 hover:underline flex items-center gap-1 transition-all"
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
