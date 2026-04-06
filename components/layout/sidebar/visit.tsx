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
  Link2,
  BadgeCheck,
  Check,
  ArrowRight,
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
      toast.success("URL copied to clipboard!");
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      toast.error("Failed to copy URL");
    }
  };

  const DomainCard = ({
    title,
    url,
    icon: Icon,
    colorClass,
    bgClass,
    isCustom,
  }: any) => (
    <div className="group relative flex flex-col gap-2 rounded-xl p-3 hover:bg-zinc-50 border border-transparent hover:border-zinc-100 transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div
            className={cn(
              "flex size-7 items-center justify-center rounded-lg shadow-sm border",
              bgClass,
              colorClass,
            )}
          >
            <Icon
              size={14}
              className={isCustom ? "text-emerald-600" : "text-indigo-600"}
            />
          </div>
          <span className="text-[13px] font-bold text-zinc-800 tracking-tight">
            {title}
          </span>
          {isCustom && (
            <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-emerald-600 border border-emerald-100/50">
              Verified
            </span>
          )}
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity translate-x-1 group-hover:translate-x-0 duration-200">
          <button
            onClick={() => handleCopyUrl(url)}
            className="flex size-7 items-center justify-center rounded-md text-zinc-400 hover:text-indigo-600 hover:bg-white border border-transparent hover:border-zinc-200 shadow-sm transition-all"
            title="Copy URL"
          >
            {copied === url ? (
              <Check size={13} className="text-emerald-500" />
            ) : (
              <Copy size={13} />
            )}
          </button>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex size-7 items-center justify-center rounded-md text-zinc-400 hover:text-indigo-600 hover:bg-white border border-transparent hover:border-zinc-200 shadow-sm transition-all"
            title="Open in new tab"
          >
            <ExternalLink size={13} />
          </a>
        </div>
      </div>
      <div className="pl-[2.3rem] pr-2">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[12.5px] font-medium text-zinc-500 group-hover:text-indigo-600 truncate block transition-colors group-hover:underline decoration-indigo-200 underline-offset-4"
        >
          {url.replace(/^https?:\/\//, "")}
        </a>
      </div>
    </div>
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="group relative flex h-9 items-center gap-2 rounded-xl bg-indigo-50/50 hover:bg-indigo-100/50 px-3.5 text-[13px] font-bold text-indigo-700 outline-none ring-indigo-500/20 hover:ring-2 focus-visible:ring-2 transition-all duration-200 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8)] border border-indigo-100/60">
          <Link2 className="size-4 shrink-0 transition-transform duration-300 group-hover:-rotate-45" />
          <span>Visit Site</span>
        </button>
      </PopoverTrigger>

      <PopoverContent
        className="w-[340px] p-0 rounded-2xl border border-zinc-200/80 shadow-[0_12px_24px_-8px_rgba(0,0,0,0.15)] overflow-hidden outline-none"
        align="end"
        sideOffset={14}
      >
        <div className="bg-linear-to-b from-zinc-50/80 to-white px-5 py-4 border-b border-zinc-100/80">
          <h3 className="text-[14px] font-bold text-zinc-800 tracking-tight flex items-center gap-2">
            Active Deployments
          </h3>
          <p className="text-[12px] text-zinc-500 max-w-[260px] mt-1 leading-relaxed">
            Manage and securely navigate to your publicly accessible community
            networks.
          </p>
        </div>

        <div className="p-2 space-y-0.5 bg-white">
          {hasThricoDomain && (
            <DomainCard
              title="Thrico Network"
              url={thricoDomainUrl}
              icon={Globe2}
              bgClass="bg-indigo-50"
              colorClass="border-indigo-100/50"
            />
          )}

          {hasCustomDomain ? (
            <DomainCard
              title="Custom Domain"
              url={customDomainUrl}
              icon={BadgeCheck}
              bgClass="bg-emerald-50"
              colorClass="border-emerald-100/50"
              isCustom={true}
            />
          ) : (
            <Link
              href="/settings"
              className="block px-3 py-3 mx-1 mt-1 rounded-xl bg-zinc-50/50 border border-dashed border-zinc-200 flex flex-col items-center justify-center text-center gap-2 group hover:bg-zinc-50 hover:border-zinc-300 transition-colors cursor-pointer outline-none"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm border border-zinc-100 text-zinc-400 group-hover:text-indigo-600 transition-colors">
                <Globe2 size={14} />
              </div>
              <div>
                <span className="block text-[12px] font-bold text-zinc-700 group-hover:text-indigo-600 transition-colors">
                  Connect Custom Domain
                </span>
                <span className="block text-[11px] text-zinc-500 mt-0.5 px-2">
                  Mask the Thrico subdomain with your own brand.
                </span>
              </div>
            </Link>
          )}
        </div>

        <Link
          href="/settings"
          className="block bg-zinc-50/80 border-t border-zinc-100 p-3 hover:bg-zinc-100/80 transition-colors outline-none group flex items-center justify-between"
        >
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest group-hover:text-indigo-600 transition-colors pl-2">
            Domain Settings
          </span>
          <ArrowRight
            size={14}
            className="text-zinc-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all"
          />
        </Link>
      </PopoverContent>
    </Popover>
  );
};

export default Visit;
