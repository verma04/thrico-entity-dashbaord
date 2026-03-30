"use client";

import { Button } from "@/components/ui/button";
import {
  Globe,
  Lock,
  Zap,
  ArrowUpRight,
  Plus,
  ExternalLink,
} from "lucide-react";

import { ThricoDomain } from "./thrico-domain";
import { CustomDomain } from "./custom-domain";
import { AddDomain } from "./add-domain";
import Link from "next/link";
import { getCustomDomain } from "@/graphql/actions/domain";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { cn } from "@/lib/utils";

export const DomainsPage = () => {
  const { data: domainData } = getCustomDomain();
  const hasCustomDomain = !!domainData?.getCustomDomain?.id;

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Domains"
        description="Configure your workspace identity, manage DNS records, and secure your traffic with automated TLS."
        breadcrumb="Network & DNS"
        icon={Globe}
        badgeText="Core Infrastructure"
        showLiveIndicator={false}
      />

      {/* Main Provisioning Card (Empty State or Upsell) */}
      {!hasCustomDomain && (
        <div className="rounded-xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-slate-900 flex items-center justify-center shrink-0">
                <Globe className="h-4.5 w-4.5 text-white" />
              </div>
              <div>
                <h2 className="text-[14px] font-semibold text-slate-900 leading-none tracking-tight">
                  Domain Provisioning
                </h2>
                <p className="text-[11px] text-slate-400 mt-1">
                  Configure your custom namespace
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <AddDomain />
              <Link
                href="https://www.godaddy.com/domains/searchresults.aspx?domainToCheck=yourdomain"
                target="_blank"
                rel="noreferrer"
              >
                <Button
                  variant="ghost"
                  className="h-8 px-3 text-[11px] font-semibold text-slate-500 hover:text-slate-900 gap-1.5"
                >
                  Buy Registry
                  <ArrowUpRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="p-5 space-y-6">
            <p className="text-[13px] text-slate-500 leading-relaxed max-w-2xl">
              Connect a domain you already own or procure a new one. A custom
              domain ensures your brand remains consistent and trusted by your
              global user base.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FeatureCard
                icon={Globe}
                iconColor="text-blue-500"
                title="DNS Resolution"
                desc="Support for main domains and subdomains with edge-weighted DNS resolution."
              />
              <FeatureCard
                icon={Lock}
                iconColor="text-emerald-500"
                title="TLS Encryption"
                desc="Automatic provisioning of industry-standard TLS certificates for secure transport."
              />
              <FeatureCard
                icon={Zap}
                iconColor="text-amber-500"
                title="Edge Delivery"
                desc="Traffic accelerated via our global Anycast network for sub-millisecond latency."
              />
            </div>
          </div>
        </div>
      )}

      {/* Active Domains List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest leading-none">
            Active Domains
          </p>
          <span className="text-[10px] font-semibold text-slate-500 tabular-nums">
            {hasCustomDomain ? "2" : "1"} Total
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <ThricoDomain />
          <CustomDomain />
        </div>
      </div>
    </EcosystemWrapper>
  );
};

const FeatureCard = ({ icon: Icon, iconColor, title, desc }: any) => (
  <div className="p-4 rounded-xl bg-slate-50/50 border border-slate-100 space-y-2.5 transition-colors hover:bg-slate-50 hover:border-slate-200">
    <div className="flex items-center gap-2">
      <div className="h-6 w-6 rounded-md bg-white border border-slate-200/60 flex items-center justify-center shrink-0">
        <Icon className={cn("h-3.5 w-3.5", iconColor)} />
      </div>
      <span className="text-[12px] font-semibold text-slate-800 uppercase tracking-tight">
        {title}
      </span>
    </div>
    <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
      {desc}
    </p>
  </div>
);
