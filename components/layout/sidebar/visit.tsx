"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Globe2,
  ExternalLink,
  Copy,
  BadgeCheck,
  Check,
  ArrowUpRight,
  Plus,
  Sparkles,
  SquareArrowOutUpRight,
} from "lucide-react";
import {
  getCustomDomain,
  getThricoDomain,
} from "../../../graphql/actions/domain";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const Visit = () => {
  const { data } = getThricoDomain();
  const { data: custom } = getCustomDomain();
  const [copied, setCopied] = useState<string | null>(null);

  const NEXT_PUBLIC_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL
    ? process.env.NEXT_PUBLIC_SITE_URL
    : "thrico.community";

  const hasThricoDomain = !!data?.getThricoDomain?.domain;
  const hasCustomDomain = !!custom?.getCustomDomain?.domain;

  if (!hasThricoDomain && !hasCustomDomain) return null;

  const thricoDomainUrl = `https://${data?.getThricoDomain?.domain}.${NEXT_PUBLIC_SITE_URL}`;

  const customDomainUrl = hasCustomDomain
    ? `https://${custom.getCustomDomain.domain}`
    : null;

  const handleCopyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(url);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(null), 2000);
    } catch {
      toast.error("Failed to copy URL");
    }
  };

  const DomainCard = ({
    title,
    url,
    icon: Icon,
    isCustom,
  }: {
    title: string;
    url: string;
    icon: React.ElementType;
    isCustom?: boolean;
  }) => (
    <div
      className={cn(
        "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200 cursor-default",
        "hover:bg-accent/60 border border-transparent hover:border-border/60",
      )}
    >
      {/* Live indicator */}
      <div className="relative shrink-0">
        <div
          className={cn(
            "flex size-8 items-center justify-center rounded-lg border",
            isCustom
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
              : "bg-primary/8 border-primary/15 text-primary",
          )}
        >
          <Icon size={14} />
        </div>
        {/* Pulse dot */}
        <span className="absolute -top-0.5 -right-0.5 flex size-2.5">
          <span
            className={cn(
              "animate-ping absolute inline-flex h-full w-full rounded-full opacity-50",
              isCustom ? "bg-emerald-500" : "bg-primary",
            )}
          />
          <span
            className={cn(
              "relative inline-flex rounded-full size-2.5",
              isCustom ? "bg-emerald-500" : "bg-primary",
            )}
          />
        </span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-[12.5px] font-semibold text-foreground leading-none">
            {title}
          </span>
          {isCustom && (
            <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-px text-[9px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              <BadgeCheck size={8} />
              Custom
            </span>
          )}
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-0.5 block text-[11.5px] text-muted-foreground/70 truncate hover:text-primary transition-colors leading-tight max-w-[170px]"
        >
          {url.replace(/^https?:\/\//, "")}
        </a>
      </div>

      {/* Actions — appear on hover */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-1 group-hover:translate-x-0 shrink-0">
        <button
          onClick={() => handleCopyUrl(url)}
          title="Copy URL"
          className="flex size-6 items-center justify-center rounded-md text-muted-foreground/50 hover:text-foreground hover:bg-accent border border-transparent hover:border-border/60 transition-all"
        >
          {copied === url ? (
            <Check size={11} className="text-emerald-500" />
          ) : (
            <Copy size={11} />
          )}
        </button>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          title="Open in new tab"
          className="flex size-6 items-center justify-center rounded-md text-muted-foreground/50 hover:text-foreground hover:bg-accent border border-transparent hover:border-border/60 transition-all"
        >
          <ExternalLink size={11} />
        </a>
      </div>
    </div>
  );

  const domainCount = (hasThricoDomain ? 1 : 0) + (hasCustomDomain ? 1 : 0);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="group relative flex h-8 items-center gap-1.5 rounded-md px-2.5 text-[12.5px] font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-150 outline-none focus-visible:ring-2 focus-visible:ring-primary/30">
          {/* Tiny live dot */}
          <span className="relative flex size-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-60" />
            <span className="relative inline-flex rounded-full size-1.5 bg-emerald-500" />
          </span>
          <span>View Site</span>
          <SquareArrowOutUpRight
            size={11}
            className="opacity-50 group-hover:opacity-80 transition-opacity"
          />
        </button>
      </PopoverTrigger>

      <PopoverContent
        className="w-[310px] p-0 rounded-xl border border-border/80 shadow-[0_8px_32px_-4px_rgba(0,0,0,0.12),0_2px_8px_-2px_rgba(0,0,0,0.06)] overflow-hidden outline-none"
        align="end"
        sideOffset={10}
      >
        {/* Header */}
        <div className="px-4 pt-3.5 pb-3 border-b border-border/60">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-[13px] font-semibold text-foreground tracking-tight leading-none">
                Live Deployments
              </h3>
              <p className="text-[11.5px] text-muted-foreground/60 mt-1 leading-snug">
                {domainCount} active endpoint{domainCount !== 1 ? "s" : ""} · publicly reachable
              </p>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-1">
              <span className="relative flex size-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-60" />
                <span className="relative inline-flex rounded-full size-1.5 bg-emerald-500" />
              </span>
              <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                Online
              </span>
            </div>
          </div>
        </div>

        {/* Domain list */}
        <div className="p-2 space-y-0.5 bg-card/50">
          {hasThricoDomain && (
            <DomainCard
              title="Thrico Network"
              url={thricoDomainUrl}
              icon={Globe2}
            />
          )}

          {hasCustomDomain ? (
            <DomainCard
              title="Custom Domain"
              url={customDomainUrl!}
              icon={BadgeCheck}
              isCustom
            />
          ) : (
            <Link
              href="/settings"
              className="group flex items-center gap-3 rounded-lg px-3 py-2.5 border border-dashed border-border/60 hover:border-primary/40 hover:bg-accent/40 transition-all duration-200 outline-none mx-0.5"
            >
              <div className="flex size-8 items-center justify-center rounded-lg bg-muted border border-border/60 text-muted-foreground/50 group-hover:text-primary group-hover:border-primary/30 group-hover:bg-primary/5 transition-all">
                <Plus size={13} />
              </div>
              <div>
                <span className="block text-[12.5px] font-medium text-muted-foreground group-hover:text-foreground transition-colors leading-none">
                  Connect Custom Domain
                </span>
                <span className="block text-[11px] text-muted-foreground/50 mt-0.5 leading-tight">
                  Use your own brand URL
                </span>
              </div>
            </Link>
          )}
        </div>

        {/* Footer */}
        <Link
          href="/settings"
          className="group flex items-center justify-between px-4 py-2.5 bg-muted/40 border-t border-border/60 hover:bg-muted/70 transition-colors outline-none"
        >
          <span className="text-[11px] font-semibold text-muted-foreground/50 uppercase tracking-[0.07em] group-hover:text-muted-foreground transition-colors">
            Domain Settings
          </span>
          <ArrowUpRight
            size={12}
            className="text-muted-foreground/30 group-hover:text-muted-foreground group-hover:-translate-y-px group-hover:translate-x-px transition-all duration-150"
          />
        </Link>
      </PopoverContent>
    </Popover>
  );
};

export default Visit;
